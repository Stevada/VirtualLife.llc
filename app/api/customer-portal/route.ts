import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      throw new Error('Customer not found')
    }

    const customer = customers.data[0]  // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_WEBSITE_A_URL}/profile`,
    })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Customer portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
} 