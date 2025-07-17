'use server'
import { stripe } from '@/lib/stripe'

export async function createCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
  })
  return session
}

export async function createCustomerPortalSessionByEmail(email: string) {
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
    return_url: `${process.env.NEXT_PUBLIC_WEBSITE_A_URL}/pricing`,
  })
  
  return session
}