'use client'

import React, { useState } from 'react'
import { AdminTab } from './AdminSidebar'
import { dataService } from '@/services/dataService'
import {
  ArrowLeft,
  ExternalLink,
  UploadCloud,
  Check,
  RotateCcw,
  BookOpen,
  Video,
  FileText,
} from 'lucide-react'

interface AdminPageHeaderProps {
  currentTab: AdminTab
  onBack: () => void
  pendingChangesCount: number
  onPublish: () => Promise<void>
  onRevert: () => Promise<void>
}

export function AdminPageHeader({
  currentTab,
  onBack,
  pendingChangesCount,
  onPublish,
  onRevert,
}: AdminPageHeaderProps) {
  const [publishing, setPublishing] = useState(false)
  const [reverting, setReverting] = useState(false)
  const [justPublished, setJustPublished] = useState(false)

  const stats = dataService.getDashboardStats()

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await onPublish()
      setJustPublished(true)
      setTimeout(() => setJustPublished(false), 2500)
    } finally {
      setPublishing(false)
    }
  }

  const handleRevert = async () => {
    if (confirm('Discard all unsaved draft changes and revert to live version?')) {
      setReverting(true)
      try {
        await onRevert()
      } finally {
        setReverting(false)
      }
    }
  }

  const tabTitles: Record<AdminTab, { title: string; category: string }> = {
    dashboard: { title: 'Dashboard Overview', category: 'ANALYTICS & METRICS' },
    courses: { title: 'Courses & Pricing', category: 'CURRICULUM MANAGEMENT' },
    videos: { title: 'Video Lectures Library', category: 'MEDIA REPOSITORY' },
    documents: { title: 'PDFs, Notes & DPPs', category: 'STUDY MATERIAL' },
    tests: { title: 'Test Series & Exams', category: 'STUDENT EVALUATION' },
    enquiries: { title: 'Students & Enquiries', category: 'ADMISSION INBOX' },
    website: { title: 'Banners & Website Text', category: 'CONTENT MANAGEMENT' },
    accounts: { title: 'Admin Accounts', category: 'ACCESS CONTROL' },
    profile: { title: 'My Administrator Profile', category: 'SECURITY & SETTINGS' },
  }

  const currentInfo = tabTitles[currentTab] || {
    title: 'Dashboard',
    category: 'ADMIN CONSOLE',
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E6DFCC]/60 w-full">
      {/* Left: Back button + Large Page Title */}
      <div className="flex items-center gap-3.5">
        {currentTab !== 'dashboard' && (
          <button
            onClick={onBack}
            className="size-10 rounded-full bg-white border border-[#E6DFCC]/80 flex items-center justify-center text-[#13321F] hover:bg-[#F8F4EA] transition shadow-2xs active:scale-95 cursor-pointer shrink-0"
            title="Back to Overview"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </button>
        )}

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E8A33D] block">
            {currentInfo.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#13321F] tracking-tight mt-0.5">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: 3 Compact Stat Chips + Action Pill Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 3 Compact Stat Chips (Responsive: visible md and up) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Chip 1: Live Courses */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/80 border border-[#E6DFCC]/70 shadow-2xs">
            <div className="size-7 rounded-xl bg-[#4F7DF3]/15 text-[#4F7DF3] flex items-center justify-center shrink-0">
              <BookOpen className="size-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#6B7A70] uppercase tracking-wider block leading-none">
                Courses
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-black text-[#13321F] leading-none">
                  {stats.liveCoursesCount}
                </span>
                <span className="text-[9px] font-bold text-[#2E9E6B] bg-[#2E9E6B]/10 px-1 rounded">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Chip 2: Video Lectures */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/80 border border-[#E6DFCC]/70 shadow-2xs">
            <div className="size-7 rounded-xl bg-[#4C93A3]/15 text-[#4C93A3] flex items-center justify-center shrink-0">
              <Video className="size-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#6B7A70] uppercase tracking-wider block leading-none">
                Videos
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-black text-[#13321F] leading-none">
                  {stats.videoLecturesCount}
                </span>
                <span className="text-[9px] font-bold text-[#4C93A3] bg-[#4C93A3]/10 px-1 rounded">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {/* Chip 3: PDFs & Notes */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/80 border border-[#E6DFCC]/70 shadow-2xs">
            <div className="size-7 rounded-xl bg-[#E8A33D]/20 text-[#8A5D14] flex items-center justify-center shrink-0">
              <FileText className="size-3.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-[#6B7A70] uppercase tracking-wider block leading-none">
                PDFs
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-black text-[#13321F] leading-none">
                  {stats.pdfsNotesCount}
                </span>
                <span className="text-[9px] font-bold text-[#E8A33D] bg-[#E8A33D]/15 px-1 rounded">
                  Saved
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: View live site, Discard, Publish changes */}
        <div className="flex items-center gap-2">
          {/* View Live Site Pill */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-pill-btn h-10 px-4 rounded-full bg-white border border-[#E6DFCC] text-xs font-bold text-[#13321F] hover:bg-[#F8F4EA] transition shadow-2xs flex items-center gap-1.5"
          >
            <span>Live Site</span>
            <ExternalLink className="size-3 text-[#6B7A70]" />
          </a>

          {/* Discard Pill (Only if drafts exist) */}
          {pendingChangesCount > 0 && (
            <button
              onClick={handleRevert}
              disabled={reverting}
              className="admin-pill-btn h-10 px-3.5 rounded-full border border-rose-200 bg-rose-50 text-xs font-bold text-rose-800 hover:bg-rose-100 transition shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Discard draft changes"
            >
              <RotateCcw className={`size-3 ${reverting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Discard</span>
            </button>
          )}

          {/* Publish Changes Solid Green Pill */}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className={`admin-pill-btn h-10 px-5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-70 ${
              justPublished
                ? 'bg-[#2E9E6B] text-white'
                : 'bg-[#13321F] text-white hover:bg-[#1C4B3A]'
            }`}
          >
            {justPublished ? (
              <>
                <Check className="size-3.5 text-white" />
                <span>Live!</span>
              </>
            ) : publishing ? (
              <>
                <div className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <UploadCloud className="size-4 text-[#E8A33D]" />
                <span>Publish</span>
                {pendingChangesCount > 0 && (
                  <span className="size-5 rounded-full bg-[#E8A33D] text-[#13321F] font-black text-[10px] flex items-center justify-center shrink-0">
                    {pendingChangesCount}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
