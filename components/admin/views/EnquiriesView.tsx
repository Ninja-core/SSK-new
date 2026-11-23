'use client'

import React, { useState } from 'react'
import { dataService, EnquiryItem, StudentItem } from '@/services/dataService'
import { useToast } from '../ToastContext'
import {
  Users,
  Search,
  Filter,
  Download,
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldAlert,
  Edit3,
  Lock,
  Unlock,
  BookOpen,
} from 'lucide-react'

export function EnquiriesView() {
  const { success } = useToast()
  const [subTab, setSubTab] = useState<'inbox' | 'students'>('inbox')

  // Inbox state
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeEnquiryNotesId, setActiveEnquiryNotesId] = useState<string | null>(null)
  const [tempNotes, setTempNotes] = useState('')

  const enquiries = dataService.getEnquiries({
    status: statusFilter,
    search: searchQuery,
  })

  // Students state
  const [studentSearch, setStudentSearch] = useState('')
  const allStudents = dataService.getStudents()
  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone.includes(studentSearch)
  )

  const courses = dataService.getCourses(true)

  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryItem['status']) => {
    await dataService.updateEnquiryStatus(enquiryId, newStatus)
    success('Enquiry updated', `Status changed to ${newStatus}.`)
  }

  const handleSaveNotes = async (enquiryId: string) => {
    await dataService.updateEnquiryStatus(enquiryId, undefined as any, tempNotes)
    setActiveEnquiryNotesId(null)
    success('Notes saved', 'Internal enquiry notes updated.')
  }

  const handleToggleCourseAccess = async (studentId: string, courseId: string, currentlyHas: boolean) => {
    await dataService.toggleStudentAccess(studentId, courseId, !currentlyHas)
    success(
      'Access updated',
      !currentlyHas ? 'Course access granted to student.' : 'Course access revoked.'
    )
  }

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Name,Phone,Class,Stream,Date,Status,Message']
        .concat(
          enquiries.map(
            (e) =>
              `"${e.name}","${e.phone}","${e.classGrade}","${e.stream}","${e.date}","${e.status}","${(e.message || '').replace(/"/g, '""')}"`
          )
        )
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `ssk_admissions_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    success('CSV Exported', 'Downloaded admission enquiries spreadsheet.')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
            Student Admissions & Enquiries
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A70] mt-0.5">
            Real-time demo class requests, follow-up notes, and student study material access control.
          </p>
        </div>

        {subTab === 'inbox' && (
          <button
            onClick={handleExportCSV}
            className="admin-pill-btn self-start sm:self-center h-11 px-5 rounded-full bg-white border border-[#E6DFCC] text-xs font-bold text-[#13321F] hover:bg-[#F8F4EA] shadow-xs transition cursor-pointer flex items-center gap-2"
          >
            <Download className="size-4 text-[#E8A33D]" />
            <span>Export to CSV</span>
          </button>
        )}
      </div>

      {/* Sub-Tabs: Enquiry Inbox vs Enrolled Students (Pill Shaped) */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#F8F4EA]/80 border border-[#E6DFCC]/60 max-w-fit">
        <button
          onClick={() => setSubTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
            subTab === 'inbox'
              ? 'bg-[#13321F] text-white shadow-xs'
              : 'text-[#6B7A70] hover:text-[#13321F]'
          }`}
        >
          <MessageSquare className="size-3.5" />
          <span>Enquiry Inbox ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setSubTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
            subTab === 'students'
              ? 'bg-[#13321F] text-white shadow-xs'
              : 'text-[#6B7A70] hover:text-[#13321F]'
          }`}
        >
          <Users className="size-3.5" />
          <span>Enrolled Students ({allStudents.length})</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* SUB-TAB 1: ENQUIRY INBOX                                      */}
      {/* ============================================================= */}
      {subTab === 'inbox' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="admin-glass-card rounded-[24px] p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6B7A70]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student name or phone..."
                className="admin-input w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-[#E6DFCC] text-xs font-medium text-[#13321F]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="size-4 text-[#6B7A70] shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-input w-full sm:w-52 h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
              >
                <option value="all">All Statuses</option>
                <option value="New">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Enquiries Cards */}
          <div className="space-y-3.5">
            {enquiries.length === 0 ? (
              <div className="admin-glass-card rounded-[28px] p-10 text-center text-xs text-[#6B7A70]">
                No admission enquiries matching your criteria.
              </div>
            ) : (
              enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="admin-glass-card rounded-[28px] p-5 sm:p-6 shadow-sm hover:shadow-md transition border border-white/80"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left: Student identity & query */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-base font-black text-[#13321F]">
                          {enq.name}
                        </h4>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E3EEF8] text-[#2C4F9E]">
                          {enq.classGrade} &bull; {enq.stream}
                        </span>
                        <span className="text-[11px] text-[#6B7A70] flex items-center gap-1 font-mono font-medium">
                          <Calendar className="size-3 text-[#E8A33D]" />
                          {new Date(enq.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#13321F] font-semibold pt-0.5">
                        <a
                          href={`tel:${enq.phone}`}
                          className="inline-flex items-center gap-1.5 text-[#13321F] hover:text-[#E8A33D] transition"
                        >
                          <Phone className="size-3 text-[#1F5A3A]" />
                          <span>{enq.phone}</span>
                        </a>
                        <span className="text-[#DED5C5]">&bull;</span>
                        <a
                          href={`https://wa.me/91${enq.phone}?text=Hi%20${encodeURIComponent(enq.name)},%20this%20is%20Dalip%20Sir%20from%20SSK%20Coaching%20Classes.`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#2E9E6B] font-bold hover:underline"
                        >
                          WhatsApp Reply &rarr;
                        </a>
                      </div>

                      <p className="text-xs text-[#13321F] bg-white/70 p-3.5 rounded-2xl border border-[#E6DFCC]/60 mt-2.5 leading-relaxed">
                        &ldquo;{enq.message}&rdquo;
                      </p>

                      {/* Internal Notes Display or Edit */}
                      <div className="pt-2">
                        {activeEnquiryNotesId === enq.id ? (
                          <div className="mt-1 space-y-2">
                            <textarea
                              rows={2}
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              placeholder="Add follow-up notes, batch preferences, or demo confirmation..."
                              className="w-full p-3 text-xs rounded-2xl border border-[#E6DFCC] bg-white text-[#13321F] font-medium resize-none focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveNotes(enq.id)}
                                className="admin-pill-btn px-4 py-1.5 rounded-full bg-[#13321F] text-white text-[11px] font-bold hover:bg-[#1C4B3A]"
                              >
                                Save Note
                              </button>
                              <button
                                onClick={() => setActiveEnquiryNotesId(null)}
                                className="admin-pill-btn px-4 py-1.5 rounded-full border border-[#DED5C5] bg-white text-[11px] font-bold text-[#6B7A70]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#6B7A70] italic">
                              {enq.notes ? `Note: ${enq.notes}` : 'No follow-up notes yet.'}
                            </span>
                            <button
                              onClick={() => {
                                setActiveEnquiryNotesId(enq.id)
                                setTempNotes(enq.notes || '')
                              }}
                              className="text-[11px] font-bold text-[#8A5D14] hover:underline cursor-pointer"
                            >
                              Edit Note
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Status Selector */}
                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[#6B7A70]">
                        Status
                      </label>
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-full border cursor-pointer focus:outline-none shadow-2xs ${
                          enq.status === 'New'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : enq.status === 'Contacted'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : enq.status === 'Enrolled'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        <option value="New">&#9679; New Lead</option>
                        <option value="Contacted">&#9679; Contacted</option>
                        <option value="Enrolled">&#9679; Enrolled</option>
                        <option value="Closed">&#9679; Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 2: ENROLLED STUDENTS & ACCESS CONTROL                 */}
      {/* ============================================================= */}
      {subTab === 'students' && (
        <div className="space-y-4">
          <div className="admin-glass-card rounded-[24px] p-3 sm:p-4 shadow-sm flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6B7A70]" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search enrolled students..."
                className="admin-input w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-[#E6DFCC] text-xs font-medium text-[#13321F]"
              />
            </div>
            <span className="hidden sm:inline text-xs text-[#6B7A70] font-semibold">
              Toggle pills to grant or revoke course material access.
            </span>
          </div>

          <div className="admin-glass-card rounded-[28px] overflow-hidden shadow-sm border border-white/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E6DFCC]/60 bg-[#F8F4EA]/50 text-[#6B7A70] uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3.5 px-5">Student</th>
                    <th className="py-3.5 px-5">Class & Stream</th>
                    <th className="py-3.5 px-5">Fee Status</th>
                    <th className="py-3.5 px-5">Course Access Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFCC]/60 font-medium text-[#13321F]">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-[#F8F4EA]/30 transition">
                      <td className="py-4 px-5">
                        <div className="font-bold text-[#13321F]">{std.name}</div>
                        <div className="text-[11px] text-[#6B7A70] font-mono">{std.phone}</div>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="text-xs font-semibold text-[#13321F]">{std.classGrade}</div>
                        <div className="text-[10px] text-[#6B7A70]">{std.stream}</div>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            std.feeStatus === 'Paid'
                              ? 'bg-[#EAF3EC] text-[#1F5A3A]'
                              : std.feeStatus === 'Partial'
                              ? 'bg-[#FEF8EA] text-[#8A5D14]'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {std.feeStatus}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-2">
                          {courses.map((course) => {
                            const hasAccess = std.enrolledCourses.includes(course.id)
                            return (
                              <button
                                key={course.id}
                                onClick={() => handleToggleCourseAccess(std.id, course.id, hasAccess)}
                                className={`admin-pill-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                                  hasAccess
                                    ? 'bg-[#13321F] text-white border-[#13321F]'
                                    : 'bg-white/70 text-[#6B7A70] border-[#DED5C5] hover:bg-[#F8F4EA]'
                                }`}
                                title={hasAccess ? 'Click to revoke access' : 'Click to grant access'}
                              >
                                {hasAccess ? (
                                  <CheckCircle2 className="size-3 text-[#E8A33D]" />
                                ) : (
                                  <Lock className="size-3 opacity-40" />
                                )}
                                <span>{course.name.split(' ')[0]}</span>
                              </button>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
