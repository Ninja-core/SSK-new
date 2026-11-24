'use client'

import React, { useState } from 'react'
import { dataService, LessonItem } from '@/services/dataService'
import { useToast } from '../ToastContext'
import {
  Video,
  Plus,
  Search,
  Filter,
  Trash2,
  Lock,
  Download,
  Play,
  CheckCircle2,
  ExternalLink,
  Edit2,
  X,
  Check,
} from 'lucide-react'

interface VideosViewProps {
  onOpenUpload: () => void
}

export function VideosView({ onOpenUpload }: VideosViewProps) {
  const { success } = useToast()
  const courses = dataService.getCourses(true)

  const [courseFilter, setCourseFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null)
  const [tempTitle, setTempTitle] = useState('')

  const allLessons = dataService.getLessons(true, {
    courseId: courseFilter,
    type: 'Video',
    search: searchQuery,
  })

  const handleToggleStatus = async (lesson: LessonItem) => {
    const updatedStatus = lesson.status === 'live' ? 'draft' : 'live'
    await dataService.saveLesson({
      ...lesson,
      status: updatedStatus,
    })
    success(
      `Status updated to ${updatedStatus}`,
      `"${lesson.title}" is now ${updatedStatus}.`
    )
  }

  const handleToggleEnrolledOnly = async (lesson: LessonItem) => {
    await dataService.saveLesson({
      ...lesson,
      enrolledOnly: !lesson.enrolledOnly,
    })
    success('Visibility updated', `Updated enrollment requirement.`)
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete video "${title}"?`)) {
      await dataService.deleteLesson(id)
      success('Video deleted', `"${title}" has been removed.`)
    }
  }

  const startRename = (lesson: LessonItem) => {
    setEditingTitleId(lesson.id)
    setTempTitle(lesson.title)
  }

  const saveRename = async (lesson: LessonItem) => {
    if (!tempTitle.trim()) return
    await dataService.saveLesson({
      ...lesson,
      title: tempTitle.trim(),
    })
    setEditingTitleId(null)
    success('Renamed', 'Video lecture title updated.')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
            Video Lectures Library
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A70] mt-0.5">
            Manage classroom whiteboard recordings, concept derivations, and high-yield video lessons.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="admin-pill-btn self-start sm:self-center h-11 px-5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] shadow-md transition cursor-pointer flex items-center gap-2"
        >
          <Plus className="size-4 text-[#E8A33D]" />
          <span>Upload Video Lecture</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-glass-card rounded-[24px] p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6B7A70]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or chapter..."
            className="admin-input w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-[#E6DFCC] text-xs font-medium text-[#13321F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="size-4 text-[#6B7A70] shrink-0" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="admin-input w-full sm:w-52 h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      {allLessons.length === 0 ? (
        <div className="admin-glass-card rounded-[28px] p-12 text-center">
          <div className="size-14 rounded-2xl bg-[#E8A33D]/15 text-[#E8A33D] flex items-center justify-center mx-auto mb-3">
            <Video className="size-7" />
          </div>
          <h3 className="text-base font-bold text-[#13321F]">No video lectures found</h3>
          <p className="text-xs text-[#6B7A70] mt-1 max-w-sm mx-auto">
            {searchQuery || courseFilter !== 'all'
              ? 'Try adjusting your search query or course filter.'
              : 'Start by uploading your first high-yield classroom lecture video.'}
          </p>
          <button
            onClick={onOpenUpload}
            className="admin-pill-btn mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A]"
          >
            <Plus className="size-4" />
            <span>Upload Video</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allLessons.map((video) => (
            <div
              key={video.id}
              className="admin-glass-card rounded-[28px] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition group p-4 border border-white/80"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-2xl bg-[#13321F] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <div className="size-12 rounded-full bg-[#E8A33D] text-[#13321F] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-20">
                  <Play className="size-5 fill-current ml-0.5" />
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2.5 right-2.5 z-20 px-2 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-mono font-bold">
                  {video.duration || '42:15'}
                </div>

                {/* Enrolled only badge */}
                <div className="absolute top-2.5 left-2.5 z-20">
                  {video.enrolledOnly ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8A33D] text-[#13321F] text-[10px] font-black">
                      <Lock className="size-2.5" />
                      Enrolled Students
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E9E6B] text-white text-[10px] font-bold">
                      Public Preview
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-[#8A5D14]">
                    <span className="truncate">{video.courseName}</span>
                    <span className="text-[#6B7A70] shrink-0">{video.chapter}</span>
                  </div>

                  {/* Title or inline edit */}
                  {editingTitleId === video.id ? (
                    <div className="mt-2 flex items-center gap-1">
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="admin-input w-full h-8 px-2 text-xs font-bold rounded-lg"
                        autoFocus
                      />
                      <button
                        onClick={() => saveRename(video)}
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
                    <div className="mt-1.5 flex items-start justify-between gap-1 group/title">
                      <h4 className="text-sm font-black text-[#13321F] line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                      <button
                        onClick={() => startRename(video)}
                        className="opacity-0 group-hover/title:opacity-100 p-1 text-[#6B7A70] hover:text-[#13321F] transition cursor-pointer"
                        title="Rename title"
                      >
                        <Edit2 className="size-3" />
                      </button>
                    </div>
                  )}

                  {video.description && (
                    <p className="text-xs text-[#6B7A70] mt-1.5 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>

                {/* Bottom Status & Toggles */}
                <div className="mt-4 pt-3 border-t border-[#E6DFCC]/60 flex items-center justify-between">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(video)}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full cursor-pointer transition ${
                      video.status === 'live'
                        ? 'bg-[#EAF3EC] text-[#1F5A3A] hover:bg-emerald-100'
                        : 'bg-[#FEF8EA] text-[#8A5D14] hover:bg-amber-100'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        video.status === 'live' ? 'bg-[#2E9E6B]' : 'bg-[#E8A33D]'
                      }`}
                    />
                    <span>{video.status === 'live' ? 'Live' : 'Draft'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {video.fileUrl && (
                      <a
                        href={video.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-8 rounded-full flex items-center justify-center text-[#1F5A3A] hover:bg-[#EAF3EC] transition cursor-pointer"
                        title="Watch / Preview video"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => handleToggleEnrolledOnly(video)}
                      className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:bg-[#F8F4EA] transition cursor-pointer"
                      title={video.enrolledOnly ? 'Lock to enrolled students' : 'Publicly accessible'}
                    >
                      <Lock className={`size-3.5 ${video.enrolledOnly ? 'text-[#C48A2C]' : 'opacity-40'}`} />
                    </button>

                    <button
                      onClick={() => handleDelete(video.id, video.title)}
                      className="size-8 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete video"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
