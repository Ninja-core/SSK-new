'use client'

import React, { useState } from 'react'
import { dataService, CourseItem } from '@/services/dataService'
import { useToast } from '../ToastContext'
import {
  BookOpen,
  Edit,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  DollarSign,
  Tag,
  Check,
  X,
  Sparkles,
} from 'lucide-react'

export function CoursesView() {
  const { success, error } = useToast()
  const courses = dataService.getCourses(true)

  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Edit form state
  const [name, setName] = useState('')
  const [eyebrow, setEyebrow] = useState('')
  const [tag, setTag] = useState('')
  const [price, setPrice] = useState<number>(4999)
  const [originalPrice, setOriginalPrice] = useState('₹8,999')
  const [discount, setDiscount] = useState('44% OFF')
  const [description, setDescription] = useState('')
  const [highlightsText, setHighlightsText] = useState('')
  const [topicsText, setTopicsText] = useState('')
  const [status, setStatus] = useState<'live' | 'draft'>('live')
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('')

  const handleEditClick = (course: CourseItem) => {
    setEditingCourse(course)
    setName(course.name)
    setEyebrow(course.eyebrow)
    setTag(course.tag)
    setPrice(course.price)
    setOriginalPrice(course.originalPrice)
    setDiscount(course.discount)
    setDescription(course.description)
    setHighlightsText(course.highlights.join('\n'))
    setTopicsText(course.topics.join(', '))
    setStatus(course.status)
    setYoutubePlaylistUrl(course.youtubePlaylistUrl || '')
    setModalOpen(true)
  }

  const handleNewCourse = () => {
    setEditingCourse(null)
    setName('')
    setEyebrow('CLASS 11th & 12th')
    setTag('Mastery & Derivations')
    setPrice(4999)
    setOriginalPrice('₹8,999')
    setDiscount('44% OFF')
    setDescription('Comprehensive module covering conceptual depth, problem derivation accuracy, and board techniques.')
    setHighlightsText('Chapter-wise Board PYQs & Daily Practice Problems\nSunday 1:1 dedicated doubt resolution')
    setTopicsText('Chapter 1, Chapter 2, Chapter 3')
    setStatus('draft')
    setYoutubePlaylistUrl('')
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      error('Course name required', 'Please provide a name for this course.')
      return
    }

    const highlights = highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const topics = topicsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const formattedPrice = `₹${price.toLocaleString('en-IN')}`

    const courseToSave: CourseItem = {
      ...(editingCourse || {
        id: `course_${Date.now()}`,
        number: `0${courses.length + 1}`,
        image: '/image4.jpg',
        cardBg: '#E8F0FE',
        accentColor: '#5277C3',
        borderColor: '#C7D9FA',
        pillBg: '#D6E4FC',
        pillText: '#2C4F9E',
        buttonBg: '#5277C3',
        buttonHoverBg: '#4163AC',
        schedulePill: 'Target Boards & Entrances',
        doubtPill: '1:1 Doubt Solving',
        totalStudents: 0,
        totalVideos: 0,
        totalPdfs: 0,
      }),
      name: name.trim(),
      eyebrow: eyebrow.trim(),
      tag: tag.trim(),
      price,
      formattedPrice,
      originalPrice,
      discount,
      description: description.trim(),
      highlights,
      topics,
      status,
      youtubePlaylistUrl,
    }

    await dataService.saveCourse(courseToSave)
    success('Course updated in draft', `"${courseToSave.name}" will go live when you press Publish Changes.`)
    setModalOpen(false)
  }

  const handleDelete = async (id: string, courseName: string) => {
    if (confirm(`Are you sure you want to delete course "${courseName}"?`)) {
      await dataService.deleteCourse(id)
      success('Course deleted', `"${courseName}" removed from draft state.`)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
            Curriculum & Pricing Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A70] mt-0.5">
            Set module pricing, original fees, discount badges, and syllabus highlights displayed on the public site.
          </p>
        </div>

        <button
          onClick={handleNewCourse}
          className="admin-pill-btn self-start sm:self-center h-11 px-5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] shadow-md transition cursor-pointer flex items-center gap-2"
        >
          <Plus className="size-4 text-[#E8A33D]" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Grid with 28px soft glass cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="admin-glass-card rounded-[28px] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 border border-white/80"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#E3EEF8] text-[#2C4F9E]">
                  {course.eyebrow}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${
                    course.status === 'live'
                      ? 'bg-[#EAF3EC] text-[#1F5A3A]'
                      : 'bg-[#FEF8EA] text-[#8A5D14]'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      course.status === 'live' ? 'bg-[#2E9E6B]' : 'bg-[#E8A33D]'
                    }`}
                  />
                  {course.status === 'live' ? 'Live on Site' : 'Draft Only'}
                </span>
              </div>

              {/* Title & Tag */}
              <h3 className="text-xl font-black text-[#13321F] mt-3">
                {course.number}. {course.name}
              </h3>
              <p className="text-xs font-semibold text-[#8A5D14] mt-0.5">{course.tag}</p>

              {/* Pricing Row */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white/70 border border-[#E6DFCC]/60 flex items-baseline gap-3">
                <span className="text-2xl font-black text-[#13321F]">
                  {course.formattedPrice}
                </span>
                <span className="text-xs line-through text-[#6B7A70] font-semibold">
                  {course.originalPrice}
                </span>
                <span className="text-[10px] font-black text-[#1F5A3A] bg-[#EAF3EC] px-2.5 py-0.5 rounded-full">
                  {course.discount}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#6B7A70] mt-3 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              {/* Highlights */}
              <div className="mt-3.5 space-y-1.5">
                {course.highlights.slice(0, 2).map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-[#13321F] font-medium">
                    <CheckCircle2 className="size-3.5 text-[#2E9E6B] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-[#E6DFCC]/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6B7A70]">
                {course.totalStudents || 120}+ Enrolled Students
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(course)}
                  className="admin-pill-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] transition cursor-pointer"
                >
                  <Edit className="size-3 text-[#E8A33D]" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => handleDelete(course.id, course.name)}
                  className="size-8 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete course"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl admin-glass-container bg-white/95 border border-white/80 rounded-[32px] shadow-2xl p-6 sm:p-8 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E6DFCC]/60 pb-3">
              <h3 className="text-lg font-black text-[#13321F]">
                {editingCourse ? `Edit Course: ${editingCourse.name}` : 'Add New Course'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-sm font-semibold text-[#13321F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                    Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={eyebrow}
                    onChange={(e) => setEyebrow(e.target.value)}
                    className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-xs font-medium text-[#13321F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-xs font-medium text-[#13321F]"
                  />
                </div>
              </div>

              {/* Pricing row */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F8F4EA]/70 border border-[#E6DFCC]/60">
                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[#DED5C5] bg-white text-xs font-bold text-[#13321F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Original Fee
                  </label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#DED5C5] bg-white text-xs font-bold text-[#13321F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Discount Label
                  </label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#DED5C5] bg-white text-xs font-bold text-[#13321F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F] resize-none focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Course Highlights (One per line)
                </label>
                <textarea
                  rows={2}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F] resize-none font-mono focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Syllabus Topics (Comma separated)
                </label>
                <input
                  type="text"
                  value={topicsText}
                  onChange={(e) => setTopicsText(e.target.value)}
                  className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-xs font-medium text-[#13321F]"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={status === 'live'}
                    onChange={(e) => setStatus(e.target.checked ? 'live' : 'draft')}
                    className="size-4 rounded text-[#13321F] accent-[#13321F]"
                  />
                  <span className="text-xs font-bold text-[#13321F]">
                    Publish to Live Website
                  </span>
                </label>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="admin-pill-btn px-5 py-2.5 rounded-full border border-[#DED5C5] bg-white text-xs font-bold text-[#6B7A70] hover:bg-[#F8F4EA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-pill-btn px-6 py-2.5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
