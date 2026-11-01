import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { studyMaterials } from '@/lib/materials'
import { verifyPurchaseToken } from '@/lib/payment-auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const materialId = searchParams.get('id')
    const token = searchParams.get('token')

    if (!materialId || !token) {
      return new NextResponse(
        JSON.stringify({ error: 'Access denied: Payment verification token required.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { valid } = verifyPurchaseToken(token, materialId)
    if (!valid) {
      return new NextResponse(
        JSON.stringify({ error: 'Access denied: Invalid or expired payment token.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const material = studyMaterials.find((m) => m.id === materialId)
    if (!material) {
      return new NextResponse(
        JSON.stringify({ error: 'Requested study material not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const filePath = path.join(process.cwd(), 'protected-materials', material.fileName)
    if (!fs.existsSync(filePath)) {
      return new NextResponse(
        JSON.stringify({ error: 'Material file is currently unavailable on server.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const fileBuffer = fs.readFileSync(filePath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${material.fileName.replace(/\s+/g, '-')}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error serving protected PDF:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error processing material' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

