import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to call Main App API with retry logic
async function callMainAppAPI(endpoint: string, data: any, retries = 3) {
  const url = `${process.env.NEXT_PUBLIC_WEBSITE_A_URL}/api/internal/${endpoint}`;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.INTERNAL_API_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API call failed: ${errorData.error || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Attempt ${attempt} failed for ${endpoint}:`, error);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

// Handle successful subscription checkout
async function handleSubscriptionSuccess(session: Stripe.Checkout.Session) {
  try {
    const { userId, planId, billingPeriod } = session.metadata || {};
    
    console.log('Subscription payment successful:', {
      sessionId: session.id,
      userId,
      planId,
      billingPeriod,
      subscriptionId: session.subscription
    });

    if (!userId || !planId || !billingPeriod || !session.subscription) {
      throw new Error('Missing required metadata in session');
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    // Calculate next credit renewal date (usually same as current period end)
    const nextCreditRenewalDate = new Date((subscription as any).current_period_end * 1000).toISOString();
    
    // Create subscription record in Main App
    await callMainAppAPI('subscription/create', {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      planId,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status,
      billingPeriod,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
      nextCreditRenewalDate,
      allocateCredits: true,
    });

    console.log('Subscription created successfully in Main App');

  } catch (error) {
    console.error('Error handling subscription success:', error);
    throw error;
  }
}

// Handle successful credit purchase
async function handleCreditPurchaseSuccess(session: Stripe.Checkout.Session) {
  try {
    const { userId, packageId, userPlanType } = session.metadata || {};
    
    console.log('Credit purchase successful:', {
      sessionId: session.id,
      userId,
      packageId,
      userPlanType,
      paymentIntentId: session.payment_intent
    });

    if (!userId || !packageId) {
      throw new Error('Missing required metadata in session');
    }

    // Credit amounts mapping
    const creditAmounts: Record<string, number> = {
      '500': 500,
      '2000': 2000,
      '3500': 3500
    };

    const creditsToAdd = creditAmounts[packageId];
    if (!creditsToAdd) {
      throw new Error(`Unknown package ID: ${packageId}`);
    }

    // Add credits to user account
    await callMainAppAPI('credits/add', {
      userId,
      amount: creditsToAdd,
      reason: `Credit package purchase: ${packageId} credits`,
      transactionId: session.payment_intent as string,
    });

    // Record transaction
    await callMainAppAPI('credits/transaction', {
      userId,
      amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
      creditsAdded: creditsToAdd,
      status: 'completed',
      paymentMethod: 'credit_card',
      paymentId: session.payment_intent as string,
      metadata: {
        sessionId: session.id,
        packageId,
        userPlanType,
      },
    });

    console.log('Credit purchase processed successfully in Main App');

  } catch (error) {
    console.error('Error handling credit purchase success:', error);
    throw error;
  }
}

// Handle subscription status changes
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const { userId, planId } = subscription.metadata || {};
    
    console.log('Subscription status changed:', {
      subscriptionId: subscription.id,
      userId,
      planId,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });

    if (!userId) {
      throw new Error('Missing userId in subscription metadata');
    }

    // Update subscription status in Main App
    await callMainAppAPI('subscription/update', {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
    });

    console.log('Subscription status updated successfully in Main App');

  } catch (error) {
    console.error('Error handling subscription change:', error);
    throw error;
  }
}

// Handle payment failures
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed:', {
      paymentIntentId: paymentIntent.id,
      lastPaymentError: paymentIntent.last_payment_error?.message
    });

    // Log the failure - could extend to notify user or trigger retry logic
    console.warn('Payment failure logged. Manual intervention may be required.');
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

// Handle invoice payment failures (for subscriptions)
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Cast to access subscription property
    const invoiceWithSub = invoice as any;
    const subscriptionId = invoiceWithSub.subscription;
      
    if (!subscriptionId) {
      console.log('No subscription found for invoice:', invoice.id);
      return;
    }
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const { userId } = subscription.metadata || {};
    
    console.log('Invoice payment failed:', {
      invoiceId: invoice.id,
      subscriptionId,
      userId,
      attemptCount: invoice.attempt_count
    });

    if (!userId) {
      throw new Error('Missing userId in subscription metadata');
    }

    // Update subscription status to reflect payment failure
    await callMainAppAPI('subscription/update', {
      stripeSubscriptionId: subscriptionId,
      status: 'past_due',
      cancelAtPeriodEnd: false,
    });

    console.log('Subscription marked as past_due due to payment failure');
    
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  
  if (!signature) {
    console.error('Stripe signature missing');
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
    
    console.log('Webhook received:', event.type);
    
    // Handle different event types
    switch (event.type) {
      // Checkout completion events
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.type === 'credit_purchase') {
          await handleCreditPurchaseSuccess(session);
        } else {
          // Default to subscription
          await handleSubscriptionSuccess(session);
        }
        break;
      
      // Subscription lifecycle events
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      
      // Payment failure events
      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      
      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      
      // Customer events
      case 'customer.subscription.trial_will_end':
        console.log('Trial ending soon for subscription:', event.data.object.id);
        // Could extend to send trial ending notification
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    if (error.type === 'StripeSignatureVerificationError') {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 500 }
    );
  }
}