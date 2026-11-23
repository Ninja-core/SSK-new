'use client'

import React, { useState } from 'react'
import { dataService, TestItem } from '@/services/dataService'
import { useToast } from '../ToastContext'
import {
  FileCheck2,
  Plus,
  Clock,
  HelpCircle,
  Award,
  Calendar,
  Trash2,
  Edit,
  X,
  CheckCircle2,
} from 'lucide-react'

export function TestsView() {
  const { success, error } = useToast()
  const tests = dataService.getTests(true)
  const courses = dataService.getCourses(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<TestItem | null>(null)

  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('physical')
  const [chapter, setChapter] = useState('')
  const [totalQuestions, setTotalQuestions] = useState(30)
  const [totalMarks, setTotalMarks] = useState(70)
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [scheduledDate, setScheduledDate] = useState('')
  const [status, setStatus] = useState<'active' | 'draft'>('active')

  const handleOpenAdd = () => {
    setEditingTest(null)
    setTitle('')
    setCourseId('physical')
    setChapter('')
    setTotalQuestions(30)
    setTotalMarks(70)
    setDurationMinutes(60)
    setScheduledDate(new Date().toISOString().split('T')[0])
    setStatus('active')
    setModalOpen(true)
  }

  const handleOpenEdit = (test: TestItem) => {
    setEditingTest(test)
    setTitle(test.title)
    setCourseId(test.courseId)
    setChapter(test.chapter)
    setTotalQuestions(test.totalQuestions)
    setTotalMarks(test.totalMarks)
    setDurationMinutes(test.durationMinutes)
    setScheduledDate(test.scheduledDate)
    setStatus(test.status === 'archived' ? 'draft' : test.status)
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      error('Title required', 'Please provide a title for the mock test.')
      return
    }

    const matchedCourse = courses.find((c) => c.id === courseId)

    await dataService.saveTest({
      id: editingTest?.id,
      title: title.trim(),
      courseId,
      courseName: matchedCourse ? matchedCourse.name : 'Physical Chemistry',
      chapter: chapter.trim() || 'All Syllabus',
      totalQuestions: Number(totalQuestions),
      totalMarks: Number(totalMarks),
      durationMinutes: Number(durationMinutes),
      scheduledDate,
      status,
    })

    success(
      editingTest ? 'Test updated' : 'Test created',
      `"${title}" is saved in draft state.`
    )
    setModalOpen(false)
  }

  const handleDelete = async (id: string, testTitle: string) => {
    if (confirm(`Are you sure you want to delete test "${testTitle}"?`)) {
      await dataService.deleteTest(id)
      success('Test deleted', `"${testTitle}" has been removed.`)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
            Test Series & Mock Examination Center
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A70] mt-0.5">
            Schedule chapter speed drills, unit benchmark exams, and full-length board mock papers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="admin-pill-btn self-start sm:self-center h-11 px-5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] shadow-md transition cursor-pointer flex items-center gap-2"
        >
          <Plus className="size-4 text-[#E8A33D]" />
          <span>Create New Test</span>
        </button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div
            key={test.id}
            className="admin-glass-card rounded-[28px] p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition group border border-white/80"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#E3EEF8] text-[#2C4F9E]">
                  {test.courseName}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full ${
                    test.status === 'active'
                      ? 'bg-[#EAF3EC] text-[#1F5A3A]'
                      : 'bg-[#FEF8EA] text-[#8A5D14]'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      test.status === 'active' ? 'bg-[#2E9E6B]' : 'bg-[#E8A33D]'
                    }`}
                  />
                  {test.status === 'active' ? 'Active Exam' : 'Draft'}
                </span>
              </div>

              <h3 className="text-base font-black text-[#13321F] mt-3 leading-snug">
                {test.title}
              </h3>
              <p className="text-xs font-semibold text-[#8A5D14] mt-0.5">{test.chapter}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-white/70 border border-[#E6DFCC]/60 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-[#6B7A70] text-[10px] font-semibold">
                    <HelpCircle className="size-3" />
                    <span>Questions</span>
                  </div>
                  <span className="text-sm font-black text-[#13321F] block mt-0.5">
                    {test.totalQuestions}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[#6B7A70] text-[10px] font-semibold">
                    <Award className="size-3" />
                    <span>Marks</span>
                  </div>
                  <span className="text-sm font-black text-[#13321F] block mt-0.5">
                    {test.totalMarks}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[#6B7A70] text-[10px] font-semibold">
                    <Clock className="size-3" />
                    <span>Minutes</span>
                  </div>
                  <span className="text-sm font-black text-[#13321F] block mt-0.5">
                    {test.durationMinutes}m
                  </span>
                </div>
              </div>

              {test.attemptsCount > 0 && (
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#6B7A70]">
                  <span>{test.attemptsCount} student attempts</span>
                  <span className="font-bold text-[#1F5A3A]">
                    Avg: {test.averageScore} / {test.totalMarks}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3.5 border-t border-[#E6DFCC]/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#6B7A70] flex items-center gap-1">
                <Calendar className="size-3 text-[#E8A33D]" />
                {test.scheduledDate}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(test)}
                  className="size-8 rounded-full flex items-center justify-center text-[#13321F] hover:bg-[#F8F4EA] transition cursor-pointer"
                  title="Edit test"
                >
                  <Edit className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(test.id, test.title)}
                  className="size-8 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Delete test"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg admin-glass-container bg-white/95 border border-white/80 rounded-[32px] shadow-2xl p-6 sm:p-8 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E6DFCC]/60 pb-3">
              <h3 className="text-lg font-black text-[#13321F]">
                {editingTest ? 'Edit Test Details' : 'Create New Test / Exam'}
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
                  Test Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Structure of Atom Chapter Benchmark"
                  className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-sm font-semibold text-[#13321F]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                    Target Course
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="admin-input w-full h-12 px-3.5 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
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
                    Chapter / Unit
                  </label>
                  <input
                    type="text"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Chapter 2"
                    className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F]"
                  />
                </div>
              </div>

              {/* Exam specs */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F8F4EA]/70 border border-[#E6DFCC]/60">
                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Questions
                  </label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[#DED5C5] bg-white text-xs font-bold text-[#13321F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[#DED5C5] bg-white text-xs font-bold text-[#13321F]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[#DED5C5] bg-white text-xs font-bold text-[#13321F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                    Exam Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="admin-input w-full h-12 px-3.5 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
                  >
                    <option value="active">Active & Open</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6DFCC]/60">
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
                  Save Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
