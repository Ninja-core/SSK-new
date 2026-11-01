import fs from 'fs'
import path from 'path'
import { studyMaterials } from './materials'
import { generatePurchaseToken } from './payment-auth'

export interface PaymentRequestRecord {
  requestId: string
  materialId: string
  materialTitle: string
  courseId: string
  amount: number
  currency: string
  status: 'pending' | 'verified' | 'failed'
  createdAt: number
  verifiedAt?: number
  verifiedBy?: 'owner' | 'webhook' | 'api'
  razorpayPaymentId?: string
  accessToken?: string
  failureReason?: string
}

const STORAGE_FILE = path.join(process.cwd(), 'protected-materials', 'payment_records.json')
const OWNER_PIN = process.env.OWNER_SECRET_PIN || 'ssk_admin_2026'

// Load records from persistent disk storage
function loadRecords(): Record<string, PaymentRequestRecord> {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify({}, null, 2), 'utf-8')
      return {}
    }
    const data = fs.readFileSync(STORAGE_FILE, 'utf-8')
    return JSON.parse(data || '{}')
  } catch (err) {
    console.error('Error reading payment records file:', err)
    return {}
  }
}

// Save records to persistent disk storage
function saveRecords(records: Record<string, PaymentRequestRecord>) {
  try {
    const dir = path.dirname(STORAGE_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(records, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error saving payment records file:', err)
  }
}

// 1. Create a new pending payment request when student clicks "Pay ₹1"
export async function createPaymentRequest(params: {
  materialId: string
  courseId?: string
}): Promise<PaymentRequestRecord> {
  const material = studyMaterials.find((m) => m.id === params.materialId) || studyMaterials[0]
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  const requestId = `req_${Date.now()}_${randomSuffix}`

  const record: PaymentRequestRecord = {
    requestId,
    materialId: material.id,
    materialTitle: material.title,
    courseId: params.courseId || material.courseId,
    amount: material.demoPrice,
    currency: 'INR',
    status: 'pending',
    createdAt: Date.now(),
  }

  const records = loadRecords()
  records[requestId] = record
  saveRecords(records)

  return record
}

// 2. Retrieve payment request status for student verification check
export async function getPaymentRequest(requestId: string): Promise<PaymentRequestRecord | null> {
  if (!requestId) return null
  const records = loadRecords()
  return records[requestId] || null
}

// 3. Get all payment requests (for owner audit dashboard)
export async function getAllPaymentRequests(): Promise<PaymentRequestRecord[]> {
  const records = loadRecords()
  return Object.values(records).sort((a, b) => b.createdAt - a.createdAt)
}

// 4. Owner approves payment after checking real transaction in Razorpay dashboard
export async function verifyPaymentByOwner(params: {
  requestId: string
  razorpayPaymentId?: string
  ownerPin: string
}): Promise<{ success: boolean; record?: PaymentRequestRecord; error?: string }> {
  const { requestId, razorpayPaymentId, ownerPin } = params

  if (ownerPin !== OWNER_PIN) {
    return { success: false, error: 'Unauthorized: Invalid Owner PIN' }
  }

  const records = loadRecords()
  const record = records[requestId]

  if (!record) {
    return { success: false, error: 'Payment request not found' }
  }

  const cleanPaymentId = (razorpayPaymentId && razorpayPaymentId.trim()) || `pay_verified_${Date.now()}`
  const accessToken = generatePurchaseToken(record.materialId, cleanPaymentId, record.requestId)

  record.status = 'verified'
  record.verifiedAt = Date.now()
  record.verifiedBy = 'owner'
  record.razorpayPaymentId = cleanPaymentId
  record.accessToken = accessToken

  records[requestId] = record
  saveRecords(records)

  return { success: true, record }
}

// 5. Owner marks payment request as failed
export async function rejectPaymentByOwner(params: {
  requestId: string
  reason?: string
  ownerPin: string
}): Promise<{ success: boolean; error?: string }> {
  const { requestId, reason, ownerPin } = params

  if (ownerPin !== OWNER_PIN) {
    return { success: false, error: 'Unauthorized: Invalid Owner PIN' }
  }

  const records = loadRecords()
  const record = records[requestId]

  if (!record) {
    return { success: false, error: 'Payment request not found' }
  }

  record.status = 'failed'
  record.failureReason = reason || 'Payment could not be confirmed in Razorpay'
  records[requestId] = record
  saveRecords(records)

  return { success: true }
}

// 6. Webhook verification for automated Razorpay confirmation in future
export async function verifyPaymentByWebhook(params: {
  requestId?: string
  razorpayPaymentId: string
  materialId?: string
}): Promise<{ success: boolean; record?: PaymentRequestRecord }> {
  const records = loadRecords()

  let targetRecord: PaymentRequestRecord | undefined

  if (params.requestId && records[params.requestId]) {
    targetRecord = records[params.requestId]
  } else {
    // Find most recent pending request for material
    const matching = Object.values(records)
      .filter((r) => r.status === 'pending' && (!params.materialId || r.materialId === params.materialId))
      .sort((a, b) => b.createdAt - a.createdAt)
    targetRecord = matching[0]
  }

  if (!targetRecord) {
    return { success: false }
  }

  const accessToken = generatePurchaseToken(targetRecord.materialId, params.razorpayPaymentId, targetRecord.requestId)

  targetRecord.status = 'verified'
  targetRecord.verifiedAt = Date.now()
  targetRecord.verifiedBy = 'webhook'
  targetRecord.razorpayPaymentId = params.razorpayPaymentId
  targetRecord.accessToken = accessToken

  records[targetRecord.requestId] = targetRecord
  saveRecords(records)

  return { success: true, record: targetRecord }
}

