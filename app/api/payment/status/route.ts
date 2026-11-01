import { NextRequest, NextResponse } from 'next/server'
import { getPaymentRequest } from '@/lib/payment-store'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get('requestId')

    if (!requestId) {
      return NextResponse.json({
        success: false,
        status: 'locked',
        error: 'Missing payment request identifier',
      }, { status: 400 })
    }

    const record = await getPaymentRequest(requestId)

    if (!record) {
      return NextResponse.json({
        success: false,
        status: 'locked',
        error: 'Payment request not found or expired',
      }, { status: 404 })
    }

    if (record.status === 'verified') {
      return NextResponse.json({
        success: true,
        status: 'verified',
        materialId: record.materialId,
        token: record.accessToken,
        verifiedAt: record.verifiedAt,
        message: 'Payment Successful! Your study material is now unlocked.',
      })
    }

    if (record.status === 'failed') {
      return NextResponse.json({
        success: true,
        status: 'failed',
        materialId: record.materialId,
        message: 'Payment could not be confirmed. Please try again.',
      })
    }

    return NextResponse.json({
      success: true,
      status: 'pending',
      requestId: record.requestId,
      materialId: record.materialId,
      message: 'Payment initiated. Waiting for confirmation.',
      createdAt: record.createdAt,
    })
  } catch (err) {
    console.error('Error fetching payment status:', err)
    return NextResponse.json({ success: false, status: 'locked', error: 'Internal server error' }, { status: 500 })
  }
}

