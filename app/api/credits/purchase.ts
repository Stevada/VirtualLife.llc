import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface PurchaseCreditsRequest {
  userId: string;
  priceId: string;
  userPlanType: 'pro' | 'plus' | 'astro' | 'base';
  userEmail?: string;
}

interface CreditPriceConfig {
  [key: string]: {
    base: string;
    pro: string;
    plus: string;
    astro: string;
  };
}

// Store credit package price IDs - in production, fetch from database
const CREDIT_PRICE_IDS: CreditPriceConfig = {
  '500': {
    base: process.env.STRIPE_PRICE_CREDIT_500_BASE!,
    pro: process.env.STRIPE_PRICE_CREDIT_500_PRO!,
    plus: process.env.STRIPE_PRICE_CREDIT_500_PLUS!,
    astro: process.env.STRIPE_PRICE_CREDIT_500_ASTRO!
  },
  '2000': {
    base: process.env.STRIPE_PRICE_CREDIT_2000_BASE!,
    pro: process.env.STRIPE_PRICE_CREDIT_2000_PRO!,
    plus: process.env.STRIPE_PRICE_CREDIT_2000_PLUS!,
    astro: process.env.STRIPE_PRICE_CREDIT_2000_ASTRO!
  },
  '3500': {
    base: process.env.STRIPE_PRICE_CREDIT_3500_BASE!,
    pro: process.env.STRIPE_PRICE_CREDIT_3500_PRO!,
    plus: process.env.STRIPE_PRICE_CREDIT_3500_PLUS!,
    astro: process.env.STRIPE_PRICE_CREDIT_3500_ASTRO!
  }
};

// Enhanced error handling function
function handleStripeError(error: any) {
  console.error('Stripe error:', error);

  switch (error.type) {
    case 'StripeCardError':
      return NextResponse.json({
        error: 'Payment failed',
        message: error.message,
        type: 'card_error'
      }, { status: 402 });
    
    case 'StripeRateLimitError':
      return NextResponse.json({
        error: 'Too many requests',
        message: 'Please try again later',
        type: 'rate_limit_error'
      }, { status: 429 });
    
    case 'StripeInvalidRequestError':
      return NextResponse.json({
        error: 'Invalid request',
        message: error.message,
        type: 'invalid_request_error'
      }, { status: 400 });
    
    case 'StripeAPIError':
      return NextResponse.json({
        error: 'Stripe API error',
        message: 'An error occurred with our payment processor',
        type: 'api_error'
      }, { status: 500 });
    
    case 'StripeConnectionError':
      return NextResponse.json({
        error: 'Network error',
        message: 'Unable to connect to payment processor',
        type: 'connection_error'
      }, { status: 503 });
    
    case 'StripeAuthenticationError':
      return NextResponse.json({
        error: 'Authentication error',
        message: 'Invalid API credentials',
        type: 'authentication_error'
      }, { status: 401 });
    
    default:
      return NextResponse.json({
        error: 'Unknown error',
        message: 'An unexpected error occurred',
        type: 'unknown_error'
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

export async function POST(request: NextRequest) {
  try {
    const body: PurchaseCreditsRequest = await request.json();
    const { userId, priceId, userPlanType, userEmail } = body;

    // Validate request
    if (!userId || !priceId || !userPlanType) {
      return NextResponse.json({
        error: 'Missing required fields: userId, priceId, userPlanType'
      }, { status: 400 });
    }

    // Create or get customer
    let customer: Stripe.Customer;
    try {
      customer = await findOrCreateCustomer(userEmail, userId);
      console.log('Customer operation completed for credit purchase');
    } catch (error: any) {
      return handleStripeError(error);
    }

    // Generate idempotency key for checkout session
    const idempotencyKey = `credits_${userId}_${priceId}_${userPlanType}_${Date.now()}`;

    // Create checkout session for one-time payment
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_WEBSITE_A_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}&type=credit`,
        cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_A_URL}/subscribe/cancel`,
        metadata: {
          userId,
          priceId,
          userPlanType,
          type: 'credit_purchase'
        }
      }, {
        idempotencyKey
      });

      console.log('Credit purchase checkout session created, session ID:', session.id);

      return NextResponse.json({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id
      });

    } catch (error: any) {
      return handleStripeError(error);
    }

  } catch (error: any) {
    console.error('Error creating credit purchase:', error);
    return NextResponse.json({
      error: 'Failed to create credit purchase session',
      message: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userPlanType = searchParams.get('userPlanType');

    const packages = [
      {
        id: '500',
        name: '500 Credits',
        credits: 500,
        basePrice: 9.99,
        description: 'Perfect for casual users'
      },
      {
        id: '2000',
        name: '2000 Credits',
        credits: 2000,
        basePrice: 19.99,
        description: 'Great for regular users'
      },
      {
        id: '3500',
        name: '3500 Credits',
        credits: 3500,
        basePrice: 39.99,
        description: 'Best value for power users'
      }
    ];

    // Apply discounts based on user plan
    const discountRates = {
      base: 0,
      pro: 5,
      plus: 10,
      astro: 20
    };

    const planType = (userPlanType as keyof typeof discountRates) || 'base';
    const discount = discountRates[planType];

    const packagesWithDiscounts = packages.map(pkg => ({
      ...pkg,
      discountPercent: discount,
      discountedPrice: pkg.basePrice * (1 - discount / 100),
      savings: pkg.basePrice * (discount / 100)
    }));

    return NextResponse.json({
      success: true,
      packages: packagesWithDiscounts
    });

  } catch (error: any) {
    console.error('Error fetching credit packages:', error);
    return NextResponse.json({
      error: 'Failed to fetch credit packages',
      message: error.message
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, userPlanType } = body;

    if (!packageId || !userPlanType) {
      return NextResponse.json({
        error: 'Missing required fields: packageId, userPlanType'
      }, { status: 400 });
    }

    const basePrices = {
      '500': 9.99,
      '2000': 19.99,
      '3500': 39.99
    };

    const discountRates = {
      base: 0,
      pro: 5,
      plus: 10,
      astro: 20
    };

    const basePrice = basePrices[packageId as keyof typeof basePrices];
    const discount = discountRates[userPlanType as keyof typeof discountRates] || 0;

    if (!basePrice) {
      return NextResponse.json({
        error: 'Invalid package ID'
      }, { status: 400 });
    }

    const discountedPrice = basePrice * (1 - discount / 100);
    const savings = basePrice * (discount / 100);

    return NextResponse.json({
      success: true,
      basePrice,
      discountPercent: discount,
      discountedPrice,
      savings
    });

  } catch (error: any) {
    console.error('Error calculating discounted price:', error);
    return NextResponse.json({
      error: 'Failed to calculate discounted price',
      message: error.message
    }, { status: 500 });
  }
} 