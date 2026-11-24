'use client'

import React, { useState } from 'react'
import { dataService, LessonItem } from '@/services/dataService'
import { useToast } from '../ToastContext'
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Check,
  X,
  FileCheck2,
} from 'lucide-react'

interface DocumentsViewProps {
  onOpenUpload: (type?: 'PDF' | 'Notes' | 'DPP' | 'PYQ') => void
}

export function DocumentsView({ onOpenUpload }: DocumentsViewProps) {
  const { success } = useToast()
  const courses = dataService.getCourses(true)

  const [courseFilter, setCourseFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null)
  const [tempTitle, setTempTitle] = useState('')

  const allDocuments = dataService
    .getLessons(true, {
      courseId: courseFilter,
      type: typeFilter === 'all' ? undefined : typeFilter,
      search: searchQuery,
    })
    .filter((l) => l.type !== 'Video')

  const handleToggleStatus = async (item: LessonItem) => {
    const updatedStatus = item.status === 'live' ? 'draft' : 'live'
    await dataService.saveLesson({
      ...item,
      status: updatedStatus,
    })
    success(`Status updated to ${updatedStatus}`, `"${item.title}" is now ${updatedStatus}.`)
  }

  const handleToggleDownload = async (item: LessonItem) => {
    await dataService.saveLesson({
      ...item,
      allowDownload: !item.allowDownload,
    })
    success('Permissions updated', `Offline download is now ${!item.allowDownload ? 'enabled' : 'disabled'}.`)
  }

  const handleToggleEnrolled = async (item: LessonItem) => {
    await dataService.saveLesson({
      ...item,
      enrolledOnly: !item.enrolledOnly,
    })
    success('Permissions updated', `Enrolled-only restriction updated.`)
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete document "${title}"?`)) {
      await dataService.deleteLesson(id)
      success('Document deleted', `"${title}" has been deleted.`)
    }
  }

  const startRename = (item: LessonItem) => {
    setEditingTitleId(item.id)
    setTempTitle(item.title)
  }

  const saveRename = async (item: LessonItem) => {
    if (!tempTitle.trim()) return
    await dataService.saveLesson({
      ...item,
      title: tempTitle.trim(),
    })
    setEditingTitleId(null)
    success('Renamed', 'Document title updated.')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
            PDFs, Lecture Notes & DPPs
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A70] mt-0.5">
            Manage chapter derivations, board-evaluated answer keys, formula cheat-sheets, and daily problem sheets.
          </p>
        </div>

        <button
          onClick={() => onOpenUpload('PDF')}
          className="admin-pill-btn self-start sm:self-center h-11 px-5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] shadow-md transition cursor-pointer flex items-center gap-2"
        >
          <Plus className="size-4 text-[#E8A33D]" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-glass-card rounded-[24px] p-3 sm:p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6B7A70]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, chapters, derivations..."
            className="admin-input w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-[#E6DFCC] text-xs font-medium text-[#13321F]"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="admin-input h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="admin-input h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
          >
            <option value="all">All Document Types</option>
            <option value="PDF">PDF Notes</option>
            <option value="Notes">Classroom Summary</option>
            <option value="DPP">Daily Practice Problems (DPP)</option>
            <option value="PYQ">Board PYQ Solutions</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      {allDocuments.length === 0 ? (
        <div className="admin-glass-card rounded-[28px] p-12 text-center">
          <div className="size-14 rounded-2xl bg-[#E8A33D]/15 text-[#E8A33D] flex items-center justify-center mx-auto mb-3">
            <FileText className="size-7" />
          </div>
          <h3 className="text-base font-bold text-[#13321F]">No documents found</h3>
          <p className="text-xs text-[#6B7A70] mt-1 max-w-sm mx-auto">
            Upload your first chapter derivation notes or practice problem sheet.
          </p>
          <button
            onClick={() => onOpenUpload('PDF')}
            className="admin-pill-btn mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A]"
          >
            <Plus className="size-4" />
            <span>Upload PDF</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allDocuments.map((doc) => (
            <div
              key={doc.id}
              className="admin-glass-card rounded-[28px] p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition group border border-white/80"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="size-10 rounded-2xl bg-[#E3EEF8] text-[#2C4F9E] flex items-center justify-center shrink-0 shadow-2xs">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-[#8A5D14] uppercase tracking-wider block">
                        {doc.courseName}
                      </span>
                      <span className="text-[11px] text-[#6B7A70] font-semibold">
                        {doc.chapter}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      doc.type === 'DPP'
                        ? 'bg-[#FEF8EA] text-[#8A5D14]'
                        : doc.type === 'PYQ'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-[#EAF3EC] text-[#1F5A3A]'
                    }`}
                  >
                    {doc.type}
                  </span>
                </div>

                {/* Title */}
                {editingTitleId === doc.id ? (
                  <div className="mt-3 flex items-center gap-1">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="admin-input w-full h-8 px-2 text-xs font-bold rounded-lg"
                      autoFocus
                    />
                    <button
                      onClick={() => saveRename(doc)}
                      className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                    >
                      <Check className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingTitleId(null)}
                      className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-start justify-between gap-1 group/title">
                    <h4 className="text-sm font-black text-[#13321F] line-clamp-2 leading-snug">
                      {doc.title}
                    </h4>
                    <button
                      onClick={() => startRename(doc)}
                      className="opacity-0 group-hover/title:opacity-100 p-1 text-[#6B7A70] hover:text-[#13321F] transition cursor-pointer"
                      title="Rename title"
                    >
                      <Edit2 className="size-3" />
                    </button>
                  </div>
                )}

                {doc.description && (
                  <p className="text-xs text-[#6B7A70] mt-1.5 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                )}

                {/* Metadata Pills */}
                <div className="mt-3.5 flex items-center gap-2 text-[11px] text-[#6B7A70]">
                  <span className="bg-white/70 px-2.5 py-0.5 rounded-full font-mono text-[10px] border border-[#E6DFCC]/60 font-semibold">
                    {doc.fileSize}
                  </span>
                  {doc.pages && (
                    <span className="bg-white/70 px-2.5 py-0.5 rounded-full text-[10px] border border-[#E6DFCC]/60 font-semibold">
                      {doc.pages} Pages
                    </span>
                  )}
                  <span className="text-[10px] text-[#1F5A3A] font-bold">
                    {doc.downloadsCount || 45} downloads
                  </span>
                </div>
              </div>

              {/* Bottom Actions & Controls */}
              <div className="mt-5 pt-3.5 border-t border-[#E6DFCC]/60 flex items-center justify-between">
                {/* Status Toggle */}
                <button
                  onClick={() => handleToggleStatus(doc)}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer transition ${
                    doc.status === 'live'
                      ? 'bg-[#EAF3EC] text-[#1F5A3A] hover:bg-emerald-100'
                      : 'bg-[#FEF8EA] text-[#8A5D14] hover:bg-amber-100'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      doc.status === 'live' ? 'bg-[#2E9E6B]' : 'bg-[#E8A33D]'
                    }`}
                  />
                  <span>{doc.status === 'live' ? 'Live' : 'Draft'}</span>
                </button>

                <div className="flex items-center gap-1">
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="size-8 rounded-full flex items-center justify-center text-[#1F5A3A] hover:bg-[#EAF3EC] transition cursor-pointer"
                      title="Preview / Open in new tab"
                    >
                      <Eye className="size-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => handleToggleEnrolled(doc)}
                    className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:bg-[#F8F4EA] transition cursor-pointer"
                    title={doc.enrolledOnly ? 'Restricted to enrolled' : 'Public preview'}
                  >
                    <Lock className={`size-3.5 ${doc.enrolledOnly ? 'text-[#C48A2C]' : 'opacity-40'}`} />
                  </button>

                  <button
                    onClick={() => handleToggleDownload(doc)}
                    className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:bg-[#F8F4EA] transition cursor-pointer"
                    title={doc.allowDownload ? 'Download permitted' : 'View-only'}
                  >
                    <Download className={`size-3.5 ${doc.allowDownload ? 'text-[#1F5A3A]' : 'opacity-40'}`} />
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="size-8 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
