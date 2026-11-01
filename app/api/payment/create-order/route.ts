import { NextRequest, NextResponse } from 'next/server'
import { studyMaterials, razorpayConfig } from '@/lib/materials'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { materialId } = body

    const material = studyMaterials.find((m) => m.id === materialId)
    if (!material) {
      return NextResponse.json({ success: false, error: 'Invalid study material selected' }, { status: 400 })
    }

    const amountInPaise = material.demoPrice * 100 // ₹1 -> 100 paise
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    // If Razorpay live/test API keys are configured in environment
    if (keyId && keySecret) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
        const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}_${material.id.slice(0, 10)}`,
            notes: {
              materialId: material.id,
              materialTitle: material.title,
            },
          }),
        })

        if (!razorpayRes.ok) {
          const errData = await razorpayRes.text()
          console.error('Razorpay Order API error:', errData)
          throw new Error('Razorpay API order creation failed')
        }

        const order = await razorpayRes.json()
        return NextResponse.json({
          success: true,
          demoMode: false,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: keyId,
          material: {
            id: material.id,
            title: material.title,
            price: material.demoPrice,
          },
        })
      } catch (err) {
        console.warn('Falling back to direct demonstration mode:', err)
      }
    }

    // Demonstration fallback when Razorpay credentials are not yet entered in .env.local
    const demoOrderId = `order_demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    return NextResponse.json({
      success: true,
      demoMode: true,
      orderId: demoOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_demo_ssk',
      paymentProfileUrl: razorpayConfig.paymentProfileUrl,
      material: {
        id: material.id,
        title: material.title,
        price: material.demoPrice,
      },
    })
  } catch (error) {
    console.error('Error creating payment order:', error)
    return NextResponse.json({ success: false, error: 'Internal server error while initiating payment' }, { status: 500 })
  }
}

