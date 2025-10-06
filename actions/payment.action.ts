'use server'

import { connectToDatabase } from '@/lib/mongoose'
import stripe from '@/lib/stripe'
import { atachPayment, getCustomer } from './customer.action'
import { generateNumericId } from '@/lib/utils'

// Price (USD) -> cents (integer) + validation
const toStripeAmount = (value: unknown) => {
  const cents = Math.round(Number(value) * 100) // 80.40 -> 8040
  if (!Number.isFinite(cents) || !Number.isInteger(cents)) {
    throw new Error('Invalid amount')
  }
  if (cents < 1) {
    throw new Error('Invalid amount: must be >= $0.01')
  }
  if (!Number.isSafeInteger(cents)) {
    throw new Error('Invalid amount: too large')
  }
  return cents
}

export const payment = async (
  price: number,
  clerkId: string,
  paymentMethod: string
) => {
  try {
    await connectToDatabase()
    const customer = await getCustomer(clerkId)
    await atachPayment(paymentMethod, customer.id)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: toStripeAmount(price), // <<< FIX: always integer cents
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethod,
      metadata: { orderId: generateNumericId() },
    })

    return paymentIntent.client_secret
  } catch (error) {
    const result = error as Error
    throw new Error(result.message)
  }
}

export const retrievePayment = async (pi: string) => {
  try {
    return await stripe.paymentIntents.retrieve(pi, {
      expand: ['payment_method'],
    })
  } catch (error) {
    const result = error as Error
    throw new Error(result.message)
  }
}

export const applyCoupon = async (code: string) => {
  try {
    const coupon = await stripe.coupons.retrieve(code)
    return JSON.parse(JSON.stringify(coupon))
  } catch (error) {
    const result = error as Error
    throw new Error(result.message)
  }
}

export const getBalance = async () => {
  try {
    const data = await stripe.balance.retrieve()
    const totalAvaliable = data.available.reduce((acc, cur) => acc + cur.amount, 0)
    const totalPending = data.pending.reduce((acc, cur) => acc + cur.amount, 0)
    return totalAvaliable + totalPending
  } catch (error) {
    const result = error as Error
    throw new Error(result.message)
  }
}
