import { NextRequest, NextResponse } from 'next/server'
import { createPaymentRequest } from '@/lib/payment-store'
import { razorpayConfig } from '@/lib/materials'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { materialId, courseId } = body

    if (!materialId) {
      return NextResponse.json({ success: false, error: 'Study material is required' }, { status: 400 })
    }

    const record = await createPaymentRequest({
      materialId,
      courseId,
    })

    return NextResponse.json({
      success: true,
      requestId: record.requestId,
      materialId: record.materialId,
      amount: record.amount,
      currency: record.currency,
      paymentUrl: razorpayConfig.paymentProfileUrl,
    })
  } catch (err: any) {
    console.error('Error initiating payment request:', err)
    return NextResponse.json({ success: false, error: 'Could not create payment request' }, { status: 500 })
  }
}

