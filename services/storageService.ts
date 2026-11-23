// =======================================================================
// SSK PROFESSIONAL COACHING CLASSES - STORAGE SERVICE
// =======================================================================
// All media & document file uploading logic is encapsulated here.
// Currently simulates client-side progress callbacks, file validation,
// and produces mock object/data URLs.
//
// =======================================================================
// [FIREBASE STORAGE MIGRATION GUIDE]
// When ready to connect Firebase Storage (Google Cloud Storage):
// 1. Initialize:
//    import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
//    const storage = getStorage()
//
// 2. In uploadFile():
//    const storageRef = ref(storage, path)
//    const uploadTask = uploadBytesResumable(storageRef, file)
//    uploadTask.on('state_changed',
//      (snapshot) => {
//        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//        onProgress?.(Math.round(progress))
//      },
//      (error) => reject(error),
//      async () => {
//        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
//        resolve({ url: downloadURL, path, name: file.name, size: file.size, mimeType: file.type })
//      }
//    )
//
// 3. In deleteFile():
//    const fileRef = ref(storage, path)
//    await deleteObject(fileRef)
// =======================================================================

export interface UploadResult {
  url: string
  path: string
  name: string
  size: number
  sizeFormatted: string
  mimeType: string
  uploadedAt: string
}

export interface FileValidationResult {
  valid: boolean
  error?: string
}

class StorageService {
  private inMemoryFiles: Map<string, { url: string; size: number }> = new Map()

  // ---------------------------------------------------------------------
  // VALIDATE FILE (Type & Size constraints)
  // ---------------------------------------------------------------------
  public validateFile(file: File, expectedType: 'video' | 'pdf' | 'image' | 'any'): FileValidationResult {
    const maxVideoSize = 500 * 1024 * 1024 // 500 MB
    const maxPdfSize = 50 * 1024 * 1024 // 50 MB
    const maxImageSize = 10 * 1024 * 1024 // 10 MB

    if (expectedType === 'video') {
      const validVideoMimes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska']
      const hasValidExt = /\.(mp4|mov|webm|mkv)$/i.test(file.name)
      if (!validVideoMimes.includes(file.type) && !hasValidExt) {
        return { valid: false, error: 'Invalid video format. Supported: MP4, MOV, WebM.' }
      }
      if (file.size > maxVideoSize) {
        return { valid: false, error: 'Video file size exceeds the 500 MB limit.' }
      }
    } else if (expectedType === 'pdf') {
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
      if (!isPdf) {
        return { valid: false, error: 'Invalid file format. Please upload a standard PDF (.pdf) document.' }
      }
      if (file.size > maxPdfSize) {
        return { valid: false, error: 'PDF file size exceeds the 50 MB limit.' }
      }
    } else if (expectedType === 'image') {
      const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|svg)$/i.test(file.name)
      if (!isImage) {
        return { valid: false, error: 'Invalid image format. Supported: PNG, JPG, WebP, SVG.' }
      }
      if (file.size > maxImageSize) {
        return { valid: false, error: 'Image file size exceeds the 10 MB limit.' }
      }
    }

    return { valid: true }
  }

  // ---------------------------------------------------------------------
  // UPLOAD FILE WITH PROGRESS CALLBACK
  // ---------------------------------------------------------------------
  // CONNECT FIREBASE STORAGE HERE:
  // Use uploadBytesResumable(ref(storage, path), file)
  // ---------------------------------------------------------------------
  public async uploadFile(
    file: File,
    path: string,
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    return new Promise((resolve) => {
      // Simulate stepped network upload progression
      let currentProgress = 0
      onProgress?.(0)

      const interval = setInterval(() => {
        const step = Math.floor(Math.random() * 20) + 15
        currentProgress = Math.min(100, currentProgress + step)
        onProgress?.(currentProgress)

        if (currentProgress >= 100) {
          clearInterval(interval)

          // In browser, create a usable Object URL for live preview
          let objectUrl = ''
          if (typeof window !== 'undefined' && window.URL && window.URL.createObjectURL) {
            try {
              objectUrl = window.URL.createObjectURL(file)
            } catch {
              objectUrl = `/uploads/${encodeURIComponent(file.name)}`
            }
          } else {
            objectUrl = `/uploads/${encodeURIComponent(file.name)}`
          }

          const formatted = this.formatBytes(file.size)
          this.inMemoryFiles.set(path, { url: objectUrl, size: file.size })

          resolve({
            url: objectUrl,
            path,
            name: file.name,
            size: file.size,
            sizeFormatted: formatted,
            mimeType: file.type || 'application/octet-stream',
            uploadedAt: new Date().toISOString(),
          })
        }
      }, 120)
    })
  }

  // ---------------------------------------------------------------------
  // GET FILE URL
  // ---------------------------------------------------------------------
  // CONNECT FIREBASE STORAGE HERE:
  // getDownloadURL(ref(storage, path))
  // ---------------------------------------------------------------------
  public async getFileUrl(path: string): Promise<string> {
    const existing = this.inMemoryFiles.get(path)
    if (existing) return existing.url
    return `/uploads/${path}`
  }

  // ---------------------------------------------------------------------
  // DELETE FILE
  // ---------------------------------------------------------------------
  // CONNECT FIREBASE STORAGE HERE:
  // deleteObject(ref(storage, path))
  // ---------------------------------------------------------------------
  public async deleteFile(path: string): Promise<{ success: boolean }> {
    this.inMemoryFiles.delete(path)
    return { success: true }
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
