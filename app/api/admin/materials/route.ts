import { NextRequest, NextResponse } from 'next/server'
import { getServerStorage, getServerFirestore, FieldValue, STORAGE_BUCKET } from '@/lib/firebase-server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds max execution time for file uploads

// Helper: Verify admin authorization from session cookie or header
function isAuthorizedAdmin(req: NextRequest): { authorized: boolean; adminId: string } {
  const sessionCookie = req.cookies.get('ssk_admin_logged_in')?.value
  const adminHeader = req.headers.get('x-admin-user') || req.headers.get('x-admin-id')

  if (sessionCookie === 'true' || adminHeader) {
    return {
      authorized: true,
      adminId: adminHeader || 'admin',
    }
  }

  return { authorized: false, adminId: '' }
}

// Format bytes helper
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Clean and sanitize string for storage path
function sanitizePathSegment(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
    .replace(/^-|-$/g, '') || 'general'
}

/**
 * GET /api/admin/materials
 * Lists all uploaded study materials from Firestore metadata collection (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const auth = isAuthorizedAdmin(req)
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required' }, { status: 401 })
    }

    const db = await getServerFirestore()
    const snapshot = await db.collection('studyMaterials').orderBy('createdAt', 'desc').get()

    const materials = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
      }
    })

    return NextResponse.json({ success: true, count: materials.length, materials })
  } catch (error: any) {
    console.error('Error fetching study materials from Firestore:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve study materials' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/materials
 * Handles actual multipart file uploads to Firebase Storage & creates Firestore metadata (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const auth = isAuthorizedAdmin(req)
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = (formData.get('title') as string) || ''
    const courseName = (formData.get('courseName') as string) || 'Chemistry'
    const targetClass = (formData.get('class') as string) || 'Class 11 & 12'
    const contentType = (formData.get('contentType') as string) || 'PDF'
    const chapter = (formData.get('chapter') as string) || 'General'
    const description = (formData.get('description') as string) || ''
    const enrolledOnly = formData.get('enrolledOnly') === 'true'
    const allowDownload = formData.get('allowDownload') !== 'false'
    const adminUser = (formData.get('uploadedBy') as string) || auth.adminId || 'sskadmin'

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided for upload' }, { status: 400 })
    }

    if (!title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }

    // Supported extensions & MIME types validation
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const validExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'mp4', 'mov', 'webm']
    if (!validExtensions.includes(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file extension .${ext}. Supported: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, MP4, MOV, WebM.`,
        },
        { status: 400 }
      )
    }

    // Size constraint checks: 500MB for video, 50MB for documents, 20MB for images
    const isVideo = ['mp4', 'mov', 'webm'].includes(ext)
    const isImage = ['jpg', 'jpeg', 'png'].includes(ext)
    const maxSize = isVideo ? 500 * 1024 * 1024 : isImage ? 20 * 1024 * 1024 : 50 * 1024 * 1024

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the allowed limit (${formatBytes(maxSize)}).`,
        },
        { status: 400 }
      )
    }

    // Construct clean, structured Storage path:
    // study-materials/[class]/[subject]/[timestamp]_[sanitized_filename]
    const classSlug = sanitizePathSegment(targetClass.includes('11') ? 'class-11' : targetClass.includes('12') ? 'class-12' : 'general')
    const subjectSlug = sanitizePathSegment(courseName)
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const uniqueFileName = `${Date.now()}_${sanitizedFileName}`
    const storagePath = `study-materials/${classSlug}/${subjectSlug}/${uniqueFileName}`

    // Convert file to buffer and stream bytes to Firebase Storage (Google Cloud Storage)
    const { bucket } = await getServerStorage()
    const storageFile = bucket.file(storagePath)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await storageFile.save(buffer, {
      contentType: file.type || 'application/octet-stream',
      resumable: buffer.length > 5 * 1024 * 1024, // Resumable for files > 5MB
      metadata: {
        metadata: {
          originalFileName: file.name,
          title: title.trim(),
          uploadedBy: adminUser,
          class: targetClass,
          course: courseName,
          contentType,
        },
      },
    })

    // Now write metadata to Cloud Firestore under collection 'studyMaterials'
    const db = await getServerFirestore()
    const docId = `mat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    const docRef = db.collection('studyMaterials').doc(docId)

    const metadataPayload = {
      id: docId,
      title: title.trim(),
      originalFileName: file.name,
      storagePath,
      storageBucket: STORAGE_BUCKET,
      contentType,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      fileSizeFormatted: formatBytes(file.size),
      subject: courseName.trim(),
      class: targetClass.trim(),
      chapter: chapter.trim() || 'General',
      description: description.trim(),
      enrolledOnly,
      allowDownload,
      published: false, // Student access disabled by default as instructed
      uploadedBy: adminUser,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    try {
      await docRef.set(metadataPayload)
    } catch (firestoreError) {
      // Rollback: remove uploaded file from Storage if metadata write fails
      console.error('Firestore metadata write failed, rolling back storage file:', firestoreError)
      await storageFile.delete({ ignoreNotFound: true }).catch(() => {})
      throw firestoreError
    }

    return NextResponse.json({
      success: true,
      message: 'File successfully uploaded to Firebase Storage and registered in Firestore.',
      material: {
        ...metadataPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        previewUrl: `/api/admin/materials/${docId}/preview`,
      },
    })
  } catch (error: any) {
    console.error('Error uploading study material to Firebase Storage:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'File upload to Firebase Storage failed.' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/materials
 * Deletes file from Firebase Storage and removes corresponding Firestore metadata (admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    const auth = isAuthorizedAdmin(req)
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin session required' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const storagePath = searchParams.get('storagePath')

    if (!id && !storagePath) {
      return NextResponse.json({ success: false, error: 'Material ID or storagePath required' }, { status: 400 })
    }

    const db = await getServerFirestore()
    const { bucket } = await getServerStorage()

    let docToDeleteId = id
    let targetStoragePath = storagePath

    if (id) {
      const docSnap = await db.collection('studyMaterials').doc(id).get()
      if (docSnap.exists) {
        const data = docSnap.data()
        targetStoragePath = targetStoragePath || data?.storagePath
      }
    } else if (storagePath) {
      const querySnap = await db.collection('studyMaterials').where('storagePath', '==', storagePath).limit(1).get()
      if (!querySnap.empty) {
        docToDeleteId = querySnap.docs[0].id
      }
    }

    // 1. Delete actual file from Google Cloud Storage
    if (targetStoragePath) {
      const file = bucket.file(targetStoragePath)
      await file.delete({ ignoreNotFound: true }).catch((err) => {
        console.warn(`[storage] Notice deleting file ${targetStoragePath}:`, err.message)
      })
    }

    // 2. Delete metadata document from Firestore
    if (docToDeleteId) {
      await db.collection('studyMaterials').doc(docToDeleteId).delete()
    }

    return NextResponse.json({
      success: true,
      message: 'File and metadata deleted successfully from Firebase Storage & Firestore.',
    })
  } catch (error: any) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete study material' },
      { status: 500 }
    )
  }
}
