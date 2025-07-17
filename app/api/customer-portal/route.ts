import { NextRequest, NextResponse } from 'next/server'
import { createCustomerPortalSessionByEmail } from '@/app/actions/stripe_actions'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const session = await createCustomerPortalSessionByEmail(email)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Customer portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
} 