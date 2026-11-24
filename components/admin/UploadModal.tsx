'use client'

import React, { useState, useRef, useEffect } from 'react'
import { storageService } from '@/services/storageService'
import { dataService, LessonItem } from '@/services/dataService'
import { useToast } from './ToastContext'
import {
  X,
  Upload,
  FileText,
  Video,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Lock,
  Download,
  ChevronDown,
} from 'lucide-react'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (savedLesson: LessonItem) => void
  initialType?: 'Video' | 'PDF' | 'Notes' | 'DPP' | 'PYQ'
  initialCourseId?: string
}

export function UploadModal({
  isOpen,
  onClose,
  onSuccess,
  initialType = 'PDF',
  initialCourseId = 'physical',
}: UploadModalProps) {
  const { success, error } = useToast()

  const [courseName, setCourseName] = useState('')
  const [contentType, setContentType] = useState<'Video' | 'PDF' | 'Notes' | 'DPP' | 'PYQ'>(initialType)
  const [title, setTitle] = useState('')
  const [chapter, setChapter] = useState('')
  const [description, setDescription] = useState('')
  const [enrolledOnly, setEnrolledOnly] = useState(true)
  const [allowDownload, setAllowDownload] = useState(true)
  const [scheduleDate, setScheduleDate] = useState('')

  // Drag & drop state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setCourseName('')
      setContentType(initialType)
      setTitle('')
      setChapter('')
      setDescription('')
      setSelectedFile(null)
      setValidationError(null)
      setUploadProgress(null)
    }
  }, [isOpen, initialType])

  if (!isOpen) return null

  const isVideo = contentType === 'Video'

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0])
    }
  }

  const handleFileSelected = (file: File) => {
    setValidationError(null)
    const expected = isVideo ? 'video' : 'document'
    const check = storageService.validateFile(file, expected)
    if (!check.valid) {
      setValidationError(check.error || 'Invalid file format')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    // Auto-populate title if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1))
    }
  }

  const handleSubmit = async (saveAsDraft: boolean) => {
    if (!title.trim()) {
      setValidationError('Please enter a lesson title.')
      return
    }

    if (!selectedFile) {
      setValidationError(`Please select a ${isVideo ? 'video' : 'study material'} file to upload.`)
      return
    }

    setSaving(true)
    setValidationError(null)

    try {
      // -----------------------------------------------------------------
      // REAL FIREBASE STORAGE & FIRESTORE UPLOAD
      // Uploads actual bytes to gs://ssk-coaching-website-33ef8.firebasestorage.app
      // and records metadata in Cloud Firestore ('studyMaterials')
      // -----------------------------------------------------------------
      const finalCourseName = courseName.trim() || 'General Chemistry'
      const finalCourseId = finalCourseName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) || 'course'

      const uploadResult = await storageService.uploadFile(
        selectedFile,
        {
          title: title.trim(),
          courseName: finalCourseName,
          class: 'Class 11 & 12',
          contentType,
          chapter: chapter.trim() || 'General Topics',
          description: description.trim(),
          enrolledOnly,
          allowDownload,
          uploadedBy: 'sskadmin',
        },
        (progress) => {
          setUploadProgress(progress)
        }
      )

      // Save lesson record to data layer
      const newLesson = await dataService.saveLesson({
        id: uploadResult.id,
        title: title.trim(),
        courseId: finalCourseId,
        courseName: finalCourseName,
        chapter: chapter.trim() || 'General Topics',
        type: contentType,
        description: description.trim(),
        fileUrl: uploadResult.url,
        fileName: uploadResult.name,
        fileSize: uploadResult.sizeFormatted,
        duration: isVideo ? '35:00' : undefined,
        pages: isVideo ? undefined : 6,
        enrolledOnly,
        allowDownload,
        status: saveAsDraft ? 'draft' : 'live',
        uploadedAt: scheduleDate ? new Date(scheduleDate).toISOString() : new Date().toISOString(),
      })

      success(
        saveAsDraft ? 'Saved as draft' : 'Uploaded successfully',
        `"${newLesson.title}" has been saved to Firebase Storage.`
      )
      onSuccess(newLesson)
      onClose()
    } catch (err: any) {
      const msg = err?.message || 'An error occurred while uploading to Firebase Storage. Please try again.'
      setValidationError(msg)
      error('Upload failed', msg)
    } finally {
      setSaving(false)
      setUploadProgress(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={saving ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box: Exactly min(90vw, 600px) and max-height 90vh */}
      <div
        className="relative w-full max-h-[90vh] bg-[#FAF7F0] rounded-[28px] border border-[#E6DFCC] shadow-[0_24px_60px_rgba(19,50,31,0.25)] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
        style={{ width: 'min(90vw, 600px)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Fixed Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E6DFCC]/70 flex items-center justify-between shrink-0 bg-white/95">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-10 rounded-2xl bg-[#13321F] text-[#FAF5EC] flex items-center justify-center shadow-xs shrink-0">
              {isVideo ? <Video className="size-5 text-[#E8A33D]" /> : <FileText className="size-5 text-[#E8A33D]" />}
            </div>
            <div className="min-w-0">
              <h3 id="modal-title" className="text-base sm:text-lg font-black text-[#13321F] tracking-tight truncate">
                Upload New Study Material
              </h3>
              <p className="text-xs text-[#6B7A70] truncate">
                Add video lectures, chapter notes, DPPs or question papers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-black/5 transition cursor-pointer shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1 space-y-4">
          {/* Validation Error Banner */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Row 1: Target Course & Content Type (Clean Two-Column Grid on Desktop, Single Column on Mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Target Course Field: Direct text input for custom course name */}
            <div className="flex flex-col">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Target Course
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Write custom course name..."
                disabled={saving}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-semibold text-[#13321F] placeholder:text-[#6B7A70]/60 focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition shadow-2xs"
              />
            </div>

            {/* Content Type Field */}
            <div className="flex flex-col">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Content Type
              </label>
              <div className="relative w-full">
                <select
                  value={contentType}
                  onChange={(e) => {
                    setContentType(e.target.value as any)
                    setSelectedFile(null)
                    setValidationError(null)
                  }}
                  disabled={saving}
                  className="w-full h-11 px-3.5 pr-9 rounded-xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-semibold text-[#13321F] focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition shadow-2xs appearance-none cursor-pointer"
                >
                  <option value="PDF">PDF Notes</option>
                  <option value="Video">Video Lecture (MP4, MOV, WebM)</option>
                  <option value="Notes">Classroom Summary Notes</option>
                  <option value="DPP">Daily Practice Problem (DPP)</option>
                  <option value="PYQ">Board & Entrance PYQ Solutions</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#6B7A70] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Lesson Title & Chapter Topic (Clean Two-Column Grid on Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Lesson Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bohr Radius & Orbital Energy Derivations"
                disabled={saving}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-medium text-[#13321F] placeholder:text-[#6B7A70]/60 focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Chapter / Unit Topic
              </label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Chapter 2 – Structure of Atom"
                disabled={saving}
                className="w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-medium text-[#13321F] placeholder:text-[#6B7A70]/60 focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Row 3: Drag & Drop File Upload Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
              File Attachment ({isVideo ? 'MP4 / MOV / WebM up to 500MB' : 'PDF, DOCX, PPTX, JPG, PNG up to 50MB'})
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept={
                isVideo
                  ? 'video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm'
                  : '.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/png,image/jpeg'
              }
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-[#E8A33D] bg-[#E8A33D]/10 scale-[1.01]'
                  : selectedFile
                  ? 'border-[#1F5A3A] bg-[#1F5A3A]/5'
                  : 'border-[#E6DFCC] bg-white hover:bg-[#F8F4EA]/50 hover:border-[#13321F]/30'
              }`}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="size-11 rounded-full bg-[#1F5A3A]/15 text-[#1F5A3A] flex items-center justify-center mb-1.5">
                    <CheckCircle2 className="size-5.5 text-[#1F5A3A]" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-[#13321F] max-w-full truncate px-2">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-[#6B7A70] mt-0.5">
                    {storageService.formatBytes(selectedFile.size)} &bull; Ready to upload
                  </p>
                  <span className="mt-1.5 text-[11px] font-bold text-[#8A5D14] underline hover:text-[#13321F]">
                    Click to choose a different file
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="size-11 rounded-full bg-[#13321F]/10 text-[#13321F] flex items-center justify-center mb-1.5">
                    <Upload className="size-5.5 text-[#13321F]" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#13321F]">
                    Drag and drop your {isVideo ? 'video' : 'document'} here, or{' '}
                    <span className="text-[#C48A2C] underline font-black">browse</span>
                  </p>
                  <p className="text-[11px] text-[#6B7A70] mt-0.5">
                    {isVideo
                      ? 'Supports MP4, MOV, WebM (Max 500 MB)'
                      : 'Supports PDF, DOC, DOCX, PPT, PPTX, JPG, PNG (Max 50 MB)'}
                  </p>
                </div>
              )}
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress !== null && (
              <div className="mt-2.5 p-3 rounded-xl bg-white border border-[#DED5C5]">
                <div className="flex items-center justify-between text-xs font-bold text-[#13321F] mb-1">
                  <span>Uploading to Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E6DFCC] overflow-hidden">
                  <div
                    className="h-full bg-[#13321F] rounded-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Row 4: Description (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
              Description or Key Topics (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of derivations, formulas, or key concepts covered..."
              disabled={saving}
              className="w-full p-3 rounded-xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-medium text-[#13321F] placeholder:text-[#6B7A70]/60 focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 resize-none leading-relaxed shadow-2xs"
            />
          </div>

          {/* Row 5: Permissions & Scheduling */}
          <div className="pt-2 border-t border-[#E6DFCC]/60 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E6DFCC] cursor-pointer select-none hover:bg-[#F8F4EA]/60 transition">
                <input
                  type="checkbox"
                  checked={enrolledOnly}
                  onChange={(e) => setEnrolledOnly(e.target.checked)}
                  disabled={saving}
                  className="size-4 rounded border-[#DED5C5] text-[#13321F] focus:ring-[#13321F] accent-[#13321F]"
                />
                <div className="flex items-center gap-1.5 min-w-0">
                  <Lock className="size-3.5 text-[#8A5D14] shrink-0" />
                  <span className="text-xs font-bold text-[#13321F] truncate">
                    Enrolled students only
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E6DFCC] cursor-pointer select-none hover:bg-[#F8F4EA]/60 transition">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  disabled={saving}
                  className="size-4 rounded border-[#DED5C5] text-[#13321F] focus:ring-[#13321F] accent-[#13321F]"
                />
                <div className="flex items-center gap-1.5 min-w-0">
                  <Download className="size-3.5 text-[#1F5A3A] shrink-0" />
                  <span className="text-xs font-bold text-[#13321F] truncate">
                    Allow offline download
                  </span>
                </div>
              </label>
            </div>

            {/* Schedule Date */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Calendar className="size-3.5 text-[#6B7A70]" />
              <label className="text-xs font-bold text-[#13321F]">Schedule publish date (Optional):</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                disabled={saving}
                className="px-2.5 py-1 text-xs rounded-lg border border-[#E6DFCC] bg-white text-[#13321F] font-medium focus:outline-none focus:border-[#E8A33D]"
              />
            </div>
          </div>
        </div>

        {/* Fixed Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#E6DFCC]/70 flex items-center justify-end gap-2.5 shrink-0 bg-white/95">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-full border border-[#DED5C5] bg-white text-xs font-bold text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-4 py-2 rounded-full border border-[#DED5C5] bg-[#F8F4EA] text-xs font-bold text-[#13321F] hover:bg-[#EBE3D5] transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            Save as draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#13321F] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#1C4B3A] transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Processing Upload...</span>
              </>
            ) : (
              <>
                <Upload className="size-4 text-[#E8A33D]" />
                <span>Upload & save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
