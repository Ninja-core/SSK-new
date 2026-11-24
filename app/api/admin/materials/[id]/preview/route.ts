import { NextRequest, NextResponse } from 'next/server'
import { getServerStorage, getServerFirestore } from '@/lib/firebase-server'

export const dynamic = 'force-dynamic'

function isAuthorizedAdmin(req: NextRequest): boolean {
  const sessionCookie = req.cookies.get('ssk_admin_logged_in')?.value
  const adminHeader = req.headers.get('x-admin-user') || req.headers.get('x-admin-id')
  return sessionCookie === 'true' || !!adminHeader
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Admin authentication required.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { id } = await params
    const db = await getServerFirestore()
    const docSnap = await db.collection('studyMaterials').doc(id).get()

    if (!docSnap.exists) {
      return new NextResponse(JSON.stringify({ error: 'Material metadata not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = docSnap.data()
    const storagePath = data?.storagePath

    if (!storagePath) {
      return new NextResponse(JSON.stringify({ error: 'Storage path missing in metadata.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { bucket } = await getServerStorage()
    const file = bucket.file(storagePath)

    const [exists] = await file.exists()
    if (!exists) {
      return new NextResponse(JSON.stringify({ error: 'File not found in Firebase Storage bucket.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const [fileBuffer] = await file.download()
    const filename = data?.originalFileName || storagePath.split('/').pop() || 'material'
    const mimeType = data?.mimeType || 'application/octet-stream'

    const { searchParams } = new URL(req.url)
    const download = searchParams.get('download') === 'true'
    const disposition = download ? `attachment; filename="${filename}"` : `inline; filename="${filename}"`

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': disposition,
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (error: any) {
    console.error('Error serving material file:', error)
    return new NextResponse(JSON.stringify({ error: 'Error streaming file from Firebase Storage' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
