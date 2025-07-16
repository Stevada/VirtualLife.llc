import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CreateSubscriptionRequest {
  userId: string;
  planType: string;
  price: string;
  userEmail?: string;
}

interface UpdateSubscriptionRequest {
  subscriptionId: string;
  newPlanType: string;
  newPrice: string;
}

interface CancelSubscriptionRequest {
  subscriptionId: string;
}

interface ResumeSubscriptionRequest {
  subscriptionId: string;
}

interface PlanPriceConfig {
  [key: string]: {
    monthly: string;
    halfYear: string;
    yearly: string;
  };
}

// Enhanced error handling function
function handleStripeError(error: any, requestId?: string) {
  console.error('Stripe error:', error);
  if (requestId) {
    console.error('Request ID:', requestId);
  }

  switch (error.type) {
    case 'StripeCardError':
      return NextResponse.json({
        error: 'Payment failed',
        message: error.message,
        type: 'card_error',
        requestId
      }, { status: 402 });
    
    case 'StripeRateLimitError':
      return NextResponse.json({
        error: 'Too many requests',
        message: 'Please try again later',
        type: 'rate_limit_error',
        requestId
      }, { status: 429 });
    
    case 'StripeInvalidRequestError':
      return NextResponse.json({
        error: 'Invalid request',
        message: error.message,
        type: 'invalid_request_error',
        requestId
      }, { status: 400 });
    
    case 'StripeAPIError':
      return NextResponse.json({
        error: 'Stripe API error',
        message: 'An error occurred with our payment processor',
        type: 'api_error',
        requestId
      }, { status: 500 });
    
    case 'StripeConnectionError':
      return NextResponse.json({
        error: 'Network error',
        message: 'Unable to connect to payment processor',
        type: 'connection_error',
        requestId
      }, { status: 503 });
    
    case 'StripeAuthenticationError':
      return NextResponse.json({
        error: 'Authentication error',
        message: 'Invalid API credentials',
        type: 'authentication_error',
        requestId
      }, { status: 401 });
    
    default:
      return NextResponse.json({
        error: 'Unknown error',
        message: 'An unexpected error occurred',
        type: 'unknown_error',
        requestId
      }, { status: 500 });
  }
}

// Helper function to find or create customer
async function findOrCreateCustomer(userEmail?: string, userId?: string): Promise<Stripe.Customer> {
  let customer: Stripe.Customer;
  
  if (userEmail) {
    // Try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      // Update metadata if userId is provided and different
      if (userId && customer.metadata.userId !== userId) {
        customer = await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId }
        });
      }
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId: userId || '' }
      });
    }
  } else {
    // Create customer without email
    customer = await stripe.customers.create({
      metadata: { userId: userId || '' }
    });
  }
  
  return customer;
}

// Main POST handler for creating subscriptions
export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriptionRequest = await request.json();
    const { userId, planType, price, userEmail } = body;

    // Validate request
    if (!userId || !planType || !price) {
      return NextResponse.json({
        error: 'Missing required fields: userId, planType, price'
      }, { status: 400 });
    }

    // Create or get customer
    let customer: Stripe.Customer;
    try {
      customer = await findOrCreateCustomer(userEmail, userId);
      console.log('Customer operation completed');
    } catch (error: any) {
      return handleStripeError(error);
    }

    // Generate idempotency key for checkout session
    const idempotencyKey = `checkout_${userId}_${planType}_${price}_${Date.now()}`;

    // Create checkout session with expanded line items
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: price,
            quantity: 1,
          },
        ],
        success_url: `${process.env.MAIN_APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.MAIN_APP_URL}/subscribe/cancel`,
        metadata: {
          userId,
          planType,
          price
        },
        subscription_data: {
          metadata: {
            userId,
            planType,
            price
          }
        }
      }, {
        idempotencyKey
      });

      console.log('Checkout session created, session ID:', session.id);

      return NextResponse.json({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id
      });

    } catch (error: any) {
      return handleStripeError(error);
    }

  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({
      error: 'Failed to create subscription checkout session',
      message: error.message
    }, { status: 500 });
  }
}

// PATCH handler for updating subscriptions
export async function PATCH(request: NextRequest) {
  try {
    const body: UpdateSubscriptionRequest = await request.json();
    const { subscriptionId, newPlanType, newPrice } = body;

    if (!subscriptionId || !newPlanType || !newPrice) {
      return NextResponse.json({
        error: 'Missing required fields: subscriptionId, newPlanType, newPrice'
      }, { status: 400 });
    }

    try {
      // Get current subscription with expanded items
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['items.data.price']
      });
      console.log('Subscription retrieved, ID:', subscription.id);

      const currentItemId = subscription.items.data[0].id;

      // Generate idempotency key for update
      const idempotencyKey = `update_${subscriptionId}_${newPlanType}_${newPrice}_${Date.now()}`;

      // Update subscription with new price
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: currentItemId,
            price: newPrice,
          },
        ],
        metadata: {
          ...subscription.metadata,
          planType: newPlanType,
          price: newPrice
        },
        proration_behavior: 'create_prorations'
      }, {
        idempotencyKey
      });

      console.log('Subscription updated, ID:', updatedSubscription.id);

      return NextResponse.json({
        success: true,
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status
        }
      });

    } catch (error: any) {
      return handleStripeError(error);
    }

  } catch (error: any) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({
      error: 'Failed to update subscription',
      message: error.message
    }, { status: 500 });
  }
}

// DELETE handler for canceling subscriptions
export async function DELETE(request: NextRequest) {
  try {
    const body: CancelSubscriptionRequest = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json({
        error: 'Missing required field: subscriptionId'
      }, { status: 400 });
    }

    try {
      // Generate idempotency key for cancellation
      const idempotencyKey = `cancel_${subscriptionId}_${Date.now()}`;

      // Cancel subscription at period end
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      }, {
        idempotencyKey
      });

      console.log('Subscription cancelled, ID:', subscription.id);

      return NextResponse.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      });

    } catch (error: any) {
      return handleStripeError(error);
    }

  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json({
      error: 'Failed to cancel subscription',
      message: error.message
    }, { status: 500 });
  }
}

// PUT handler for resuming subscriptions
export async function PUT(request: NextRequest) {
  try {
    const body: ResumeSubscriptionRequest = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json({
        error: 'Missing required field: subscriptionId'
      }, { status: 400 });
    }

    try {
      // Generate idempotency key for resume
      const idempotencyKey = `resume_${subscriptionId}_${Date.now()}`;

      // Resume subscription
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      }, {
        idempotencyKey
      });

      console.log('Subscription resumed, ID:', subscription.id);

      return NextResponse.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      });

    } catch (error: any) {
      return handleStripeError(error);
    }

  } catch (error: any) {
    console.error('Error resuming subscription:', error);
    return NextResponse.json({
      error: 'Failed to resume subscription',
      message: error.message
    }, { status: 500 });
  }
} 