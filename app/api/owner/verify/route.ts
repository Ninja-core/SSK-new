import { NextRequest, NextResponse } from 'next/server'
import {
  getAllPaymentRequests,
  verifyPaymentByOwner,
  rejectPaymentByOwner,
} from '@/lib/payment-store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ownerPin, action, requestId, razorpayPaymentId, reason } = body

    const expectedPin = process.env.OWNER_SECRET_PIN || 'ssk_admin_2026'

    if (!ownerPin || ownerPin.trim() !== expectedPin) {
      return NextResponse.json({ success: false, error: 'Invalid Owner Access PIN' }, { status: 401 })
    }

    if (action === 'list') {
      const requests = await getAllPaymentRequests()
      return NextResponse.json({ success: true, requests })
    }

    if (action === 'approve') {
      if (!requestId) {
        return NextResponse.json({ success: false, error: 'Missing requestId to approve' }, { status: 400 })
      }
      const result = await verifyPaymentByOwner({
        requestId,
        razorpayPaymentId,
        ownerPin,
      })
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }
      return NextResponse.json({ success: true, record: result.record })
    }

    if (action === 'reject') {
      if (!requestId) {
        return NextResponse.json({ success: false, error: 'Missing requestId to reject' }, { status: 400 })
      }
      const result = await rejectPaymentByOwner({
        requestId,
        reason,
        ownerPin,
      })
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid action requested' }, { status: 400 })
  } catch (err) {
    console.error('Owner verify endpoint error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

