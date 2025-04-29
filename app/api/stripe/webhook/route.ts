import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sessionStore } from '@/lib/session';
import { headers } from 'next/headers';

// Disable body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Process successful payments
async function handleSuccessfulPayment(session: any) {
  try {
    // Update session status
    await sessionStore.updateSessionStatus(
      session.id, 
      'completed', 
      session.subscription
    );
    
    // Send notification to Website A about successful payment
    // This could be via webhook, message queue, or direct API call
    // For example:
    /*
    await fetch(`${process.env.WEBSITE_A_DOMAIN}/api/subscriptions/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WEBSITE_A_API_KEY}`
      },
      body: JSON.stringify({
        event: 'payment.success',
        data: {
          sessionId: session.id,
          userId: session.metadata.userId,
          planId: session.metadata.planId,
          subscriptionId: session.subscription
        }
      })
    });
    */
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Handle subscription changes
async function handleSubscriptionChange(subscription: any) {
  // Implement logic to handle subscription updates/cancellations
  console.log('Subscription change:', subscription.status);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature') as string;
  
  if (!signature) {
    console.error('Stripe signature missing');
    return NextResponse.json(
      { error: 'Stripe signature missing' },
      { status: 400 }
    );
  }
  
  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleSuccessfulPayment(session);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }
}