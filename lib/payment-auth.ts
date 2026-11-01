import crypto from 'crypto'

const AUTH_SECRET = process.env.PAYMENT_AUTH_SECRET || process.env.RAZORPAY_KEY_SECRET || 'ssk_coaching_secure_salt_2026_atom_unlock'

export interface PurchasePayload {
  materialId: string
  paymentId: string
  orderId: string
  unlockedAt: number
  exp: number
}

export function generatePurchaseToken(materialId: string, paymentId: string, orderId: string): string {
  const payload: PurchasePayload = {
    materialId,
    paymentId,
    orderId,
    unlockedAt: Date.now(),
    exp: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year access
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url')
  return `${encodedPayload}.${signature}`
}

export function verifyPurchaseToken(token: string, expectedMaterialId: string): { valid: boolean; payload?: PurchasePayload } {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false }
  }

  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) {
    return { valid: false }
  }

  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(encodedPayload).digest('base64url')
  if (signature !== expectedSignature) {
    return { valid: false }
  }

  try {
    const payload: PurchasePayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
    if (payload.materialId !== expectedMaterialId) {
      return { valid: false }
    }
    if (payload.exp && Date.now() > payload.exp) {
      return { valid: false }
    }
    return { valid: true, payload }
  } catch {
    return { valid: false }
  }
}

