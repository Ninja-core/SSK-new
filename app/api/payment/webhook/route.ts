import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { verifyPaymentByWebhook } from '@/lib/payment-store'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    // 1. Signature Verification if Webhook Secret is configured
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ success: false, error: 'Missing webhook signature' }, { status: 400 })
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex')

      if (expectedSignature !== signature) {
        return NextResponse.json({ success: false, error: 'Webhook signature verification failed' }, { status: 403 })
      }
    } else {
      console.warn('⚠️ RAZORPAY_WEBHOOK_SECRET is not set in environment. Webhook signature could not be verified cryptographically.')
    }

    const eventData = JSON.parse(rawBody || '{}')
    const event = eventData.event

    // 2. Handle Razorpay Payment Events
    // Common events: payment.captured, payment_link.paid, order.paid
    if (event === 'payment.captured' || event === 'payment_link.paid' || event === 'order.paid') {
      const paymentEntity = eventData.payload?.payment?.entity || eventData.payload?.payment_link?.entity
      const paymentId = paymentEntity?.id || `pay_${Date.now()}`
      const notes = paymentEntity?.notes || {}
      const requestId = notes.requestId

      const result = await verifyPaymentByWebhook({
        requestId,
        razorpayPaymentId: paymentId,
      })

      return NextResponse.json({
        success: true,
        message: 'Payment verified and unlocked via Razorpay webhook',
        matched: result.success,
      })
    }

    return NextResponse.json({ success: true, message: `Event ${event} received` })
  } catch (err: any) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ success: false, error: 'Webhook error' }, { status: 500 })
  }
}

