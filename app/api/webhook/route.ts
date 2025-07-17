import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

// Standardized metadata interface
interface StripeMetadata {
  userId: string;
  planId?: string;
  packageId?: string;
  billingPeriod?: 'monthly' | 'half_year' | 'yearly';
  // TODO: what about type basic?
  userPlanType?: 'pro' | 'plus' | 'astro';
  type: 'subscription' | 'credit_purchase';
}

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

// Validate metadata with fallback
function validateMetadata(metadata: any, eventType: string): StripeMetadata | null {
  if (!metadata) {
    console.warn(`⚠️ No metadata found for ${eventType}`);
    return null;
  }

  const requiredFields = ['userId', 'type'];
  const missingFields = requiredFields.filter(field => !metadata[field]);
  
  if (missingFields.length > 0) {
    console.error(`❌ Missing required metadata fields for ${eventType}:`, missingFields);
    return null;
  }

  return metadata as StripeMetadata;
}

// Handle successful subscription checkout with enhanced error handling
async function handleSubscriptionSuccess(session: Stripe.Checkout.Session) {
  try {
    const metadata = validateMetadata(session.metadata, 'subscription');
    if (!metadata) {
      throw new Error('Invalid or missing metadata for subscription');
    }
    
    console.log('📦 Subscription payment successful:', {
      sessionId: session.id,
      userId: metadata.userId,
      planId: metadata.planId,
      billingPeriod: metadata.billingPeriod,
      subscriptionId: session.subscription
    });

    if (!session.subscription) {
      throw new Error('No subscription ID in session');
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    // Calculate next credit renewal date
    const nextCreditRenewalDate = new Date((subscription as any).current_period_end * 1000).toISOString();
    
    // Create subscription record in Main App
    await callMainAppAPI('subscription/create', {
      userId: metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      planId: metadata.planId!,
      status: subscription.status,
      nextCreditRenewalDate,
      allocateCredits: true,
    });

    // Update sync status
    await callMainAppAPI('subscription/sync', {
      stripeSubscriptionId: subscription.id,
      syncStatus: 'synced',
      lastWebhookEvent: 'checkout.session.completed',
    });

    console.log('✅ Subscription created successfully in Main App');

  } catch (error) {
    console.error('❌ Error handling subscription success:', error);
    
    // Update sync status to failed if we have a subscription ID
    if (session.subscription) {
      try {
        await callMainAppAPI('subscription/sync', {
          stripeSubscriptionId: session.subscription as string,
          syncStatus: 'failed',
          lastWebhookEvent: 'checkout.session.completed',
        });
      } catch (syncError) {
        console.error('❌ Failed to update sync status:', syncError);
      }
    }
    
    throw error;
  }
}

// Handle successful credit purchase with enhanced error handling
async function handleCreditPurchaseSuccess(session: Stripe.Checkout.Session) {
  try {
    const metadata = validateMetadata(session.metadata, 'credit_purchase');
    if (!metadata) {
      throw new Error('Invalid or missing metadata for credit purchase');
    }
    
    console.log('💰 Credit purchase successful:', {
      sessionId: session.id,
      userId: metadata.userId,
      packageId: metadata.packageId,
      userPlanType: metadata.userPlanType,
      paymentIntentId: session.payment_intent
    });

    if (!metadata.packageId) {
      throw new Error('Missing packageId in metadata');
    }

    // Credit amounts mapping
    const creditAmounts: Record<string, number> = {
      '500': 500,
      '2000': 2000,
      '3500': 3500
    };

    const creditsToAdd = creditAmounts[metadata.packageId];
    if (!creditsToAdd) {
      throw new Error(`Unknown package ID: ${metadata.packageId}`);
    }

    // Add credits to user account
    await callMainAppAPI('credits/add', {
      userId: metadata.userId,
      amount: creditsToAdd,
      reason: `Credit package purchase: ${metadata.packageId} credits`,
      transactionId: session.payment_intent as string,
    });

    // Record transaction
    await callMainAppAPI('credits/transaction', {
      userId: metadata.userId,
      amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
      creditsAdded: creditsToAdd,
      status: 'completed',
      paymentMethod: 'credit_card',
      paymentId: session.payment_intent as string,
      metadata: {
        sessionId: session.id,
        packageId: metadata.packageId,
        userPlanType: metadata.userPlanType,
      },
    });

    console.log('✅ Credit purchase processed successfully in Main App');

  } catch (error) {
    console.error('❌ Error handling credit purchase success:', error);
    throw error;
  }
}

// Handle subscription status changes with enhanced error handling
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const metadata = validateMetadata(subscription.metadata, 'subscription_change');
    
    console.log('🔄 Subscription status changed:', {
      subscriptionId: subscription.id,
      userId: metadata?.userId || 'unknown',
      planId: metadata?.planId || 'unknown',
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });

    // Update subscription status in Main App
    await callMainAppAPI('subscription/update', {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    // Update sync status
    await callMainAppAPI('subscription/sync', {
      stripeSubscriptionId: subscription.id,
      syncStatus: 'synced',
      lastWebhookEvent: 'customer.subscription.updated',
    });

    console.log('✅ Subscription status updated successfully in Main App');

  } catch (error) {
    console.error('❌ Error handling subscription change:', error);
    
    // Update sync status to failed
    try {
      await callMainAppAPI('subscription/sync', {
        stripeSubscriptionId: subscription.id,
        syncStatus: 'failed',
        lastWebhookEvent: 'customer.subscription.updated',
      });
    } catch (syncError) {
      console.error('❌ Failed to update sync status:', syncError);
    }
    
    throw error;
  }
}

// Handle invoice payment failures (for subscriptions) with enhanced error handling
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Cast to access subscription property
    const invoiceWithSub = invoice as any;
    const subscriptionId = invoiceWithSub.subscription;
      
    if (!subscriptionId) {
      console.log('ℹ️ No subscription found for invoice:', invoice.id);
      return;
    }
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    // TODO: why do we need to validate metadata here?
    const metadata = validateMetadata(subscription.metadata, 'invoice_payment_failed');
    
    console.log('💥 Invoice payment failed:', {
      invoiceId: invoice.id,
      subscriptionId,
      userId: metadata?.userId || 'unknown',
      attemptCount: invoice.attempt_count,
      amountDue: invoice.amount_due,
      currency: invoice.currency
    });

    // Update subscription status to reflect payment failure
    await callMainAppAPI('subscription/update', {
      stripeSubscriptionId: subscriptionId,
      status: 'past_due',
      cancelAtPeriodEnd: false,
    });

    // Update sync status
    await callMainAppAPI('subscription/sync', {
      stripeSubscriptionId: subscriptionId,
      syncStatus: 'synced',
      lastWebhookEvent: 'invoice.payment_failed',
    });

    console.log('✅ Subscription marked as past_due due to payment failure');
    
  } catch (error) {
    console.error('❌ Error handling invoice payment failure:', error);
    
    // Update sync status to failed if we have a subscription ID
    const invoiceWithSub = invoice as any;
    const subscriptionId = invoiceWithSub.subscription;
    
    if (subscriptionId) {
      try {
        await callMainAppAPI('subscription/sync', {
          stripeSubscriptionId: subscriptionId,
          syncStatus: 'failed',
          lastWebhookEvent: 'invoice.payment_failed',
        });
      } catch (syncError) {
        console.error('❌ Failed to update sync status:', syncError);
      }
    }
    
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
    
    console.log('📨 Webhook received:', {
      type: event.type,
      id: event.id,
      created: new Date(event.created * 1000).toISOString()
    });
    
    // Handle different event types with enhanced error handling
    switch (event.type) {
      // Checkout completion events
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'payment') {
          await handleCreditPurchaseSuccess(session);
        } else if (session.mode === 'subscription') {
          await handleSubscriptionSuccess(session);
        } else {
          console.log('ℹ️ Unhandled checkout session mode:', session.mode);
          throw new Error(`Unhandled checkout session mode: ${session.mode}`);
        }
        break;
      
      // Subscription lifecycle events
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      
      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;

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