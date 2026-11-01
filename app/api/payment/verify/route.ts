import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { studyMaterials } from '@/lib/materials'
import { generatePurchaseToken } from '@/lib/payment-auth'

// Standard Razorpay Order Verification (used when RAZORPAY_KEY_SECRET is configured)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, paymentId, signature, materialId } = body

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json({
        success: false,
        error: 'Automatic verification via Razorpay Secret is not configured. Payments must be verified by website owner.',
      }, { status: 403 })
    }

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({
        success: false,
        error: 'Missing Razorpay verification parameters (orderId, paymentId, signature required)',
      }, { status: 400 })
    }

    const material = studyMaterials.find((m) => m.id === materialId)
    if (!material) {
      return NextResponse.json({ success: false, error: 'Invalid study material identifier' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({
        success: false,
        error: 'Payment verification failed: Signature mismatch. Access denied.',
      }, { status: 403 })
    }

    const token = generatePurchaseToken(material.id, paymentId, orderId)

    return NextResponse.json({
      success: true,
      message: 'Payment Successful! Your study material is now unlocked.',
      materialId: material.id,
      token,
      paymentId,
      orderId,
      unlockedAt: Date.now(),
    })
  } catch (error) {
    console.error('Error in payment verification:', error)
    return NextResponse.json({ success: false, error: 'Payment verification service error' }, { status: 500 })
  }
}
