// =======================================================================
// SSK PROFESSIONAL COACHING CLASSES - STORAGE SERVICE
// =======================================================================
// Encapsulates all real Firebase Storage upload, validation, and deletion.
// Uploads actual file bytes directly to the Firebase Storage bucket:
// gs://ssk-coaching-website-33ef8.firebasestorage.app
// and records corresponding metadata in Cloud Firestore ('studyMaterials').
// =======================================================================

export interface UploadResult {
  id?: string
  url: string
  path: string
  name: string
  size: number
  sizeFormatted: string
  mimeType: string
  uploadedAt: string
}

export interface UploadMetadataParams {
  title: string
  courseName?: string
  class?: string
  contentType?: string
  chapter?: string
  description?: string
  enrolledOnly?: boolean
  allowDownload?: boolean
  uploadedBy?: string
}

export interface FileValidationResult {
  valid: boolean
  error?: string
}

class StorageService {
  // ---------------------------------------------------------------------
  // VALIDATE FILE (Type & Size constraints for PDF, DOC, PPT, Images, Videos)
  // ---------------------------------------------------------------------
  public validateFile(file: File, expectedType: 'video' | 'pdf' | 'document' | 'image' | 'any'): FileValidationResult {
    const ext = (file.name.split('.').pop() || '').toLowerCase()
    const maxVideoSize = 500 * 1024 * 1024 // 500 MB
    const maxDocSize = 50 * 1024 * 1024 // 50 MB
    const maxImageSize = 20 * 1024 * 1024 // 20 MB

    if (expectedType === 'video') {
      const validVideoExts = ['mp4', 'mov', 'webm', 'mkv']
      if (!validVideoExts.includes(ext) && !file.type.startsWith('video/')) {
        return { valid: false, error: 'Invalid video format. Supported: MP4, MOV, WebM.' }
      }
      if (file.size > maxVideoSize) {
        return { valid: false, error: 'Video file size exceeds the 500 MB limit.' }
      }
    } else if (expectedType === 'pdf') {
      const isPdf = ext === 'pdf' || file.type === 'application/pdf'
      if (!isPdf) {
        return { valid: false, error: 'Invalid document format. Please upload a standard PDF (.pdf) file.' }
      }
      if (file.size > maxDocSize) {
        return { valid: false, error: 'PDF file size exceeds the 50 MB limit.' }
      }
    } else if (expectedType === 'document') {
      const validDocExts = ['pdf', 'doc', 'docx', 'ppt', 'pptx']
      if (!validDocExts.includes(ext)) {
        return { valid: false, error: 'Invalid file format. Supported: PDF, DOC, DOCX, PPT, PPTX.' }
      }
      if (file.size > maxDocSize) {
        return { valid: false, error: 'Document file size exceeds the 50 MB limit.' }
      }
    } else if (expectedType === 'image') {
      const validImgExts = ['png', 'jpg', 'jpeg', 'webp']
      if (!validImgExts.includes(ext) && !file.type.startsWith('image/')) {
        return { valid: false, error: 'Invalid image format. Supported: PNG, JPG, JPEG, WebP.' }
      }
      if (file.size > maxImageSize) {
        return { valid: false, error: 'Image file size exceeds the 20 MB limit.' }
      }
    } else if (expectedType === 'any') {
      const allValid = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'mp4', 'mov', 'webm']
      if (!allValid.includes(ext)) {
        return { valid: false, error: `Unsupported file type .${ext}. Allowed: PDF, DOC/DOCX, PPT/PPTX, JPG, PNG, MP4.` }
      }
      const isVideoFile = ['mp4', 'mov', 'webm'].includes(ext)
      const limit = isVideoFile ? maxVideoSize : maxDocSize
      if (file.size > limit) {
        return { valid: false, error: `File size exceeds the allowed limit (${this.formatBytes(limit)}).` }
      }
    }

    return { valid: true }
  }

  // ---------------------------------------------------------------------
  // UPLOAD FILE TO FIREBASE STORAGE (via authenticated server endpoint)
  // ---------------------------------------------------------------------
  public async uploadFile(
    file: File,
    uploadPathOrParams: string | UploadMetadataParams,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)

      // Handle either legacy path string or rich metadata params
      if (typeof uploadPathOrParams === 'object') {
        formData.append('title', uploadPathOrParams.title || file.name)
        if (uploadPathOrParams.courseName) formData.append('courseName', uploadPathOrParams.courseName)
        if (uploadPathOrParams.class) formData.append('class', uploadPathOrParams.class)
        if (uploadPathOrParams.contentType) formData.append('contentType', uploadPathOrParams.contentType)
        if (uploadPathOrParams.chapter) formData.append('chapter', uploadPathOrParams.chapter)
        if (uploadPathOrParams.description) formData.append('description', uploadPathOrParams.description)
        if (uploadPathOrParams.enrolledOnly !== undefined) formData.append('enrolledOnly', String(uploadPathOrParams.enrolledOnly))
        if (uploadPathOrParams.allowDownload !== undefined) formData.append('allowDownload', String(uploadPathOrParams.allowDownload))
        if (uploadPathOrParams.uploadedBy) formData.append('uploadedBy', uploadPathOrParams.uploadedBy)
      } else {
        // Path string fallback
        formData.append('title', file.name)
        formData.append('courseName', 'Chemistry')
        formData.append('class', 'Class 11 & 12')
      }

      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/admin/materials')
      xhr.withCredentials = true // Ensures ssk_admin_logged_in cookie is sent

      // Track true upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress?.(percent)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText)
            if (data.success && data.material) {
              const m = data.material
              resolve({
                id: m.id,
                url: `/api/admin/materials/${m.id}/preview`,
                path: m.storagePath,
                name: m.originalFileName || file.name,
                size: m.fileSize || file.size,
                sizeFormatted: m.fileSizeFormatted || this.formatBytes(file.size),
                mimeType: m.mimeType || file.type || 'application/octet-stream',
                uploadedAt: m.createdAt || new Date().toISOString(),
              })
              return
            }
            reject(new Error(data.error || 'Upload failed with invalid response.'))
          } catch {
            reject(new Error('Invalid response received from storage upload endpoint.'))
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText)
            reject(new Error(errorData.error || `Upload failed with HTTP ${xhr.status}`))
          } catch {
            reject(new Error(`Upload failed with HTTP status ${xhr.status}`))
          }
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error occurred while uploading file to Firebase Storage.'))
      }

      xhr.ontimeout = () => {
        reject(new Error('Upload request timed out.'))
      }

      xhr.send(formData)
    })
  }

  // ---------------------------------------------------------------------
  // DELETE FILE (from both Firebase Storage & Firestore)
  // ---------------------------------------------------------------------
  public async deleteFile(idOrPath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const isPath = idOrPath.includes('/')
      const url = isPath
        ? `/api/admin/materials?storagePath=${encodeURIComponent(idOrPath)}`
        : `/api/admin/materials?id=${encodeURIComponent(idOrPath)}`

      const res = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await res.json()
      if (res.ok && data.success) {
        return { success: true }
      }
      return { success: false, error: data.error || 'Failed to delete file' }
    } catch (err: any) {
      console.error('deleteFile error:', err)
      return { success: false, error: err.message || 'Network error deleting file' }
    }
  }

  // ---------------------------------------------------------------------
  // GET STORED MATERIALS LIST FROM FIRESTORE
  // ---------------------------------------------------------------------
  public async listMaterials(): Promise<any[]> {
    try {
      const res = await fetch('/api/admin/materials', {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) return []
      const data = await res.json()
      return data.materials || []
    } catch (e) {
      console.warn('Failed to fetch materials list:', e)
      return []
    }
  }

  // Utility byte formatter
  public formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }
}

export const storageService = new StorageService()
