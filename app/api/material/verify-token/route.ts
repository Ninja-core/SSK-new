import { NextRequest, NextResponse } from 'next/server'
import { verifyPurchaseToken } from '@/lib/payment-auth'

export async function POST(req: NextRequest) {
  try {
    const { materialId, token } = await req.json()
    if (!materialId || !token) {
      return NextResponse.json({ unlocked: false }, { status: 200 })
    }

    const { valid, payload } = verifyPurchaseToken(token, materialId)
    return NextResponse.json({
      unlocked: valid,
      paymentId: payload?.paymentId,
      unlockedAt: payload?.unlockedAt,
    })
  } catch {
    return NextResponse.json({ unlocked: false }, { status: 200 })
  }
}

