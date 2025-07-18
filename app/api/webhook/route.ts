import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

// Enhanced error handling with retry logic
async function callMainAppAPI(endpoint: string, data: any, retries = 3): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_WEBSITE_A_URL}/api/internal/${endpoint}`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 API call attempt ${attempt}/${retries} to ${endpoint}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(`API call failed: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      console.log(`✅ API call successful to ${endpoint}`);
      return result;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed for ${endpoint}:`, error);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Handle successful subscription checkout with enhanced error handling
async function handleSubscriptionSuccess(data: Stripe.Subscription) {
  try {
    const metadata = data.metadata;
    
    // Create subscription record in Main App
    await callMainAppAPI('subscription/create', {
      userId: metadata.userId,
      stripeSubscriptionId: data.id,
      stripeCustomerId: data.customer as string,
      planId: metadata.planId,
      status: data.status,
      allocateCredits: true,
    });

    // Update sync status
    await callMainAppAPI('subscription/sync', {
      stripeSubscriptionId: data.id,
      syncStatus: 'synced',
      lastWebhookEvent: 'customer.subscription.created',
    });

    console.log('✅ Subscription created successfully in Main App');

  } catch (error) {
    console.error('❌ Error handling subscription success:', error);
    
    // Update sync status to failed if we have a subscription ID
    if (data.id) {
      try {
        await callMainAppAPI('subscription/sync', {
          stripeSubscriptionId: data.id,
          syncStatus: 'failed',
          lastWebhookEvent: 'customer.subscription.created',
        });
      } catch (syncError) {
        console.error('❌ Failed to update sync status:', syncError);
      }
    }
    
    throw error;
  }
}

// Handle subscription status changes with enhanced error handling
async function handleSubscriptionStatusChange(data: Stripe.Subscription) {
  try {
    // Update subscription status in Main App
    await callMainAppAPI('subscription/update', {
      stripeSubscriptionId: data.id,
      status: data.status,
    });

    // Update sync status
    await callMainAppAPI('subscription/sync', {
      stripeSubscriptionId: data.id,
      syncStatus: 'synced',
      lastWebhookEvent: 'customer.subscription.updated',
    });

    console.log('✅ Subscription status updated successfully in Main App');

  } catch (error) {
    console.error('❌ Error handling subscription change:', error);
    
    // Update sync status to failed
    try {
      await callMainAppAPI('subscription/sync', {
        stripeSubscriptionId: data.id,
        syncStatus: 'failed',
        lastWebhookEvent: 'customer.subscription.updated',
      });
    } catch (syncError) {
      console.error('❌ Failed to update sync status:', syncError);
    }
    
    throw error;
  }
}

// Handle credit purchase success with enhanced error handling
async function handleCreditPurchaseSuccess(data: Stripe.Checkout.Session) {
  try {
    const metadata = data.metadata as unknown as { userId: string };
    const invoice = await stripe.invoices.retrieve(data.invoice as string);

    for (let i = 0; i < invoice.lines.data.length; i++) {
        const item = invoice.lines.data[i];
        const productId = item.pricing?.price_details?.product;
        if (productId) {
            const product = await stripe.products.retrieve(productId);
            const amount = product.metadata.credits;
            await callMainAppAPI('credits/add', {
                userId: metadata.userId,
                amount: amount,
            });
        }
    }
  } catch (error) {
    console.error('❌ Error handling credit purchase success:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  
  if (!signature) {
    console.error('❌ Stripe signature missing');
    return NextResponse.json(
      { error: 'Stripe signature missing' },
      { status: 400 }
    );
  }
  
  try {
    // Verify webhook signature for security
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Handle different event types with enhanced error handling
    switch (event.type) {
      // Subscription lifecycle events
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        await handleSubscriptionSuccess(subscriptionCreated);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        await handleSubscriptionStatusChange(subscriptionUpdated);
        break;

      // Credit purchase events
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session;
        if (checkoutSessionCompleted.metadata?.type === 'credit_purchase') {
          await handleCreditPurchaseSuccess(checkoutSessionCompleted);
        }
        break;
      
      // Failed payment events shall have been handeled by Stripe checkout session and subscription.updated
      // We don't need to sync anything here.

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Webhook processing error:', {
      message: errorMessage,
      stack: error.stack
    });
    
    return NextResponse.json(
      {message: `Webhook Error: ${errorMessage}`},
      {status: 400}
    );
  }
}