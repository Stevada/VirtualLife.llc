import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sessionStore } from '@/lib/session';
import { authenticate, createVerificationToken } from '@/lib/auth';

// Handler for the checkout API
async function createCheckoutHandler(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { userId, planId, priceAmount, priceCurrency, interval, productName } = body;
    
    // Check required fields
    if (!userId) {
      console.error('Missing required parameters:', { userId });
      return NextResponse.json(
        { error: 'Missing user ID!' },
        { status: 400 }
      );
    }
    
    // Create metadata for tracking
    const metadata = {
      userId,
      planId,
    };
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: priceCurrency,
            product_data: {
              name: productName,
            },
            unit_amount: priceAmount,
            recurring: interval ? {
              interval,
            } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.WEBSITE_A_DOMAIN}/subscribe/success`,
      cancel_url: `${process.env.WEBSITE_A_DOMAIN}/discover`,
      metadata,
    });
    
    // Store session data for verification later
    await sessionStore.storeSession(session.id, metadata);
    
    // Create a verification token for future authentication
    const verificationToken = createVerificationToken({
      sessionId: session.id,
      userId,
      planId,
      timestamp: new Date().toISOString(),
    });
    
    // Return the checkout URL and verification token to be embedded in an iframe
    return NextResponse.json({ 
      checkoutUrl: session.url,
      verificationToken
    });
    
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: `Failed to create checkout session: ${error.message}` },
      { status: 500 }
    );
  }
}

// Export the POST method with authentication
export async function POST(request: NextRequest) {
  return authenticate(request, createCheckoutHandler);
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.WEBSITE_A_DOMAIN as string,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}