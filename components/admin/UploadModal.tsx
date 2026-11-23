'use client'

import React, { useState, useRef } from 'react'
import { storageService } from '@/services/storageService'
import { dataService, LessonItem } from '@/services/dataService'
import { useToast } from './ToastContext'
import {
  X,
  Upload,
  FileText,
  Video,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Lock,
  Download,
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

  const [courseId, setCourseId] = useState(initialCourseId)
  const [title, setTitle] = useState('')
  const [chapter, setChapter] = useState('')
  const [contentType, setContentType] = useState<'Video' | 'PDF' | 'Notes' | 'DPP' | 'PYQ'>(initialType)
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

  if (!isOpen) return null

  const courses = dataService.getCourses(true)
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
    const expected = isVideo ? 'video' : 'pdf'
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
      setValidationError(`Please select a ${isVideo ? 'video' : 'PDF'} file to upload.`)
      return
    }

    setSaving(true)
    setValidationError(null)

    try {
      // -----------------------------------------------------------------
      // CONNECT FIREBASE STORAGE HERE:
      // Uses storageService.uploadFile which delegates to Firebase Storage
      // -----------------------------------------------------------------
      const folder = isVideo ? 'videos' : 'documents'
      const uploadPath = `${folder}/${courseId}/${Date.now()}_${selectedFile.name}`

      const uploadResult = await storageService.uploadFile(
        selectedFile,
        uploadPath,
        (progress) => {
          setUploadProgress(progress)
        }
      )

      const matchedCourse = courses.find((c) => c.id === courseId)

      // Save lesson record to data layer
      const newLesson = await dataService.saveLesson({
        title: title.trim(),
        courseId,
        courseName: matchedCourse ? matchedCourse.name : 'Physical Chemistry',
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
        `"${newLesson.title}" has been saved.`
      )
      onSuccess(newLesson)
      onClose()
    } catch (err) {
      error('Upload failed', 'An error occurred while uploading. Please try again.')
    } finally {
      setSaving(false)
      setUploadProgress(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl admin-glass-container bg-white/95 border border-white/80 rounded-[32px] shadow-2xl p-6 sm:p-8 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E6DFCC]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#13321F] text-[#FAF5EC] flex items-center justify-center shadow-xs">
              {isVideo ? <Video className="size-5 text-[#E8A33D]" /> : <FileText className="size-5 text-[#E8A33D]" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-[#13321F] tracking-tight">
                Upload New Study Material
              </h3>
              <p className="text-xs text-[#6B7A70] mt-0.5">
                Add video lectures, chapter notes, DPPs or question papers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <AlertCircle className="size-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="mt-5 space-y-4">
          {/* Row 1: Course & Content Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Target Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={saving}
                className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-semibold text-[#13321F]"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => {
                  setContentType(e.target.value as any)
                  setSelectedFile(null)
                  setValidationError(null)
                }}
                disabled={saving}
                className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-semibold text-[#13321F]"
              >
                <option value="PDF">PDF Notes</option>
                <option value="Video">Video Lecture (MP4, MOV, WebM)</option>
                <option value="Notes">Classroom Summary Notes</option>
                <option value="DPP">Daily Practice Problem (DPP)</option>
                <option value="PYQ">Board & Entrance PYQ Solutions</option>
              </select>
            </div>
          </div>

          {/* Row 2: Lesson Title & Chapter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-medium text-[#13321F] placeholder:text-[#6B7A70]/60"
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
                className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-medium text-[#13321F] placeholder:text-[#6B7A70]/60"
              />
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
              File Attachment ({isVideo ? 'MP4 / MOV / WebM up to 500MB' : 'PDF Document up to 50MB'})
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept={isVideo ? 'video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm' : 'application/pdf,.pdf'}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[24px] p-6 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-[#E8A33D] bg-[#E8A33D]/10 scale-[1.01]'
                  : selectedFile
                  ? 'border-[#1F5A3A] bg-[#1F5A3A]/5'
                  : 'border-[#E6DFCC] bg-[#F8F4EA]/40 hover:bg-[#F8F4EA] hover:border-[#13321F]/30'
              }`}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full bg-[#1F5A3A]/15 text-[#1F5A3A] flex items-center justify-center mb-2">
                    <CheckCircle2 className="size-6 text-[#1F5A3A]" />
                  </div>
                  <p className="text-sm font-black text-[#13321F]">{selectedFile.name}</p>
                  <p className="text-xs text-[#6B7A70] mt-0.5">
                    {storageService.formatBytes(selectedFile.size)} &bull; Ready to upload
                  </p>
                  <span className="mt-2 text-[11px] font-bold text-[#8A5D14] underline hover:text-[#13321F]">
                    Click to choose a different file
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full bg-[#13321F]/10 text-[#13321F] flex items-center justify-center mb-2">
                    <Upload className="size-6 text-[#13321F]" />
                  </div>
                  <p className="text-sm font-black text-[#13321F]">
                    Drag and drop your {isVideo ? 'video' : 'PDF'} here, or{' '}
                    <span className="text-[#C48A2C] underline">browse</span>
                  </p>
                  <p className="text-xs text-[#6B7A70] mt-1">
                    {isVideo ? 'Supports MP4, MOV, WebM (Max 500 MB)' : 'PDF format only (Max 50 MB)'}
                  </p>
                </div>
              )}
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress !== null && (
              <div className="mt-3 p-3.5 rounded-2xl bg-[#F8F4EA] border border-[#DED5C5]">
                <div className="flex items-center justify-between text-xs font-bold text-[#13321F] mb-1">
                  <span>Uploading to Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#DED5C5] overflow-hidden">
                  <div
                    className="h-full bg-[#13321F] rounded-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
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
              className="w-full p-3.5 rounded-2xl border border-[#E6DFCC] bg-white text-xs sm:text-sm font-medium text-[#13321F] placeholder:text-[#6B7A70]/60 focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 resize-none leading-relaxed"
            />
          </div>

          {/* Settings & Permissions */}
          <div className="pt-3 border-t border-[#E6DFCC]/60 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F8F4EA]/60 border border-[#E6DFCC]/80 cursor-pointer select-none hover:bg-[#F8F4EA] transition">
                <input
                  type="checkbox"
                  checked={enrolledOnly}
                  onChange={(e) => setEnrolledOnly(e.target.checked)}
                  disabled={saving}
                  className="size-4 rounded border-[#DED5C5] text-[#13321F] focus:ring-[#13321F] accent-[#13321F]"
                />
                <div className="flex items-center gap-1.5">
                  <Lock className="size-3.5 text-[#8A5D14]" />
                  <span className="text-xs font-bold text-[#13321F]">
                    Visible to enrolled students only
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#F8F4EA]/60 border border-[#E6DFCC]/80 cursor-pointer select-none hover:bg-[#F8F4EA] transition">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  disabled={saving}
                  className="size-4 rounded border-[#DED5C5] text-[#13321F] focus:ring-[#13321F] accent-[#13321F]"
                />
                <div className="flex items-center gap-1.5">
                  <Download className="size-3.5 text-[#1F5A3A]" />
                  <span className="text-xs font-bold text-[#13321F]">
                    Allow student offline download
                  </span>
                </div>
              </label>
            </div>
        
            {/* Schedule Date */}
            <div className="flex items-center gap-2 pt-1">
              <Calendar className="size-4 text-[#6B7A70]" />
              <label className="text-xs font-bold text-[#13321F]">Schedule publish date (Optional):</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                disabled={saving}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E6DFCC] bg-white text-[#13321F] font-medium"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#E6DFCC]/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="admin-pill-btn px-5 py-2.5 rounded-full border border-[#DED5C5] bg-white text-xs font-bold text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="admin-pill-btn px-5 py-2.5 rounded-full border border-[#DED5C5] bg-[#F8F4EA] text-xs font-bold text-[#13321F] hover:bg-[#EBE3D5] transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            Save as draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="admin-pill-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#13321F] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#1C4B3A] transition cursor-pointer active:scale-95 disabled:opacity-50"
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
