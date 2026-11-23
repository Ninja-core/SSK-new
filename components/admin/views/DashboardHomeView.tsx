'use client'

import React from 'react'
import { AdminUser } from '@/services/authService'
import { dataService } from '@/services/dataService'
import { AdminTab } from '../AdminSidebar'
import {
  TrendingUp,
  BookOpen,
  Video,
  FileText,
  Upload,
  Sliders,
  ShieldCheck,
  KeyRound,
  Users2,
  HardDrive,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  MoreHorizontal,
  Maximize2,
  UserCheck,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react'

interface DashboardHomeViewProps {
  currentUser: AdminUser
  onNavigateTab: (tab: AdminTab) => void
  onOpenUpload: (type?: 'Video' | 'PDF') => void
  onDeleteLesson?: (id: string) => void
}

export function DashboardHomeView({
  currentUser,
  onNavigateTab,
  onOpenUpload,
}: DashboardHomeViewProps) {
  const stats = dataService.getDashboardStats()

  // Storage ring calculations (radius = 36)
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * stats.storagePercent) / 100

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 w-full">
      {/* ============================================================= */}
      {/* BENTO GRID ROW 1: Overview Card (8 cols) + Owner Profile (4) */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
        {/* 1. Overview Card: Wide Clean Card with Smooth Gold Chart */}
        <div className="lg:col-span-8 admin-glass-card rounded-[28px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-[#E6DFCC]/70 shadow-sm">
          {/* Card Top Header with Title and 2 Tiny Round Icon Buttons */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DFCC]/50">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#E8A33D]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#6B7A70]">
                THIS MONTH AT A GLANCE
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                className="size-7 rounded-full bg-white border border-[#E6DFCC] flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] transition shadow-2xs"
                title="Options"
                aria-label="Options"
              >
                <MoreHorizontal className="size-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('enquiries')}
                className="size-7 rounded-full bg-white border border-[#E6DFCC] flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] transition shadow-2xs"
                title="Expand Enquiries"
                aria-label="Expand"
              >
                <Maximize2 className="size-3" />
              </button>
            </div>
          </div>

          {/* Metrics & Big Numbers */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-[#13321F] tracking-tight">
                  {stats.thisMonthEnquiries}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2E9E6B] bg-[#2E9E6B]/10 px-2.5 py-1 rounded-full border border-[#2E9E6B]/20">
                  <TrendingUp className="size-3.5" />
                  <span>+{stats.enquiriesGrowthPercent}% vs last month</span>
                </span>
              </div>
              <p className="text-xs text-[#6B7A70] mt-1.5 leading-relaxed">
                New student enquiries and demo admission requests in Ramgarh
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('enquiries')}
              className="admin-pill-btn h-9 px-4 rounded-full bg-white border border-[#E6DFCC] text-xs font-bold text-[#13321F] hover:bg-[#F8F4EA] transition shadow-2xs self-start sm:self-center shrink-0 flex items-center gap-1.5"
            >
              <span>View Inbox</span>
              <ChevronRight className="size-3.5 text-[#6B7A70]" />
            </button>
          </div>

          {/* Smooth Gold SVG Chart Line (Responsive full-width stretch) */}
          <div className="my-6 h-18 sm:h-22 w-full">
            <svg viewBox="0 0 600 48" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="softGoldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8A33D" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#E8A33D" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,38 Q60,34 120,36 T240,24 T360,26 T480,12 T600,6 L600,48 L0,48 Z"
                fill="url(#softGoldGrad)"
              />
              <path
                d="M0,38 Q60,34 120,36 T240,24 T360,26 T480,12 T600,6"
                fill="none"
                stroke="#E8A33D"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="600" cy="6" r="4" fill="#E8A33D" />
            </svg>
          </div>

          {/* Divided Stat Row (Clean 3 blocks) */}
          <div className="grid grid-cols-3 divide-x divide-[#E6DFCC]/60 pt-4 border-t border-[#E6DFCC]/60 text-center">
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-black text-[#13321F]">
                {stats.liveCoursesCount}
              </span>
              <span className="block text-[11px] font-bold text-[#6B7A70] uppercase tracking-wider mt-0.5">
                Live Courses
              </span>
            </div>
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-black text-[#13321F]">
                {stats.videoLecturesCount}
              </span>
              <span className="block text-[11px] font-bold text-[#6B7A70] uppercase tracking-wider mt-0.5">
                Video Lectures
              </span>
            </div>
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-black text-[#13321F]">
                {stats.pdfsNotesCount}
              </span>
              <span className="block text-[11px] font-bold text-[#6B7A70] uppercase tracking-wider mt-0.5">
                PDFs & DPPs
              </span>
            </div>
          </div>
        </div>

        {/* 2. Owner Profile Bento Card: Tall Elegant Card */}
        <div className="lg:col-span-4 admin-glass-card rounded-[28px] p-6 sm:p-7 flex flex-col justify-between border border-[#E6DFCC]/70 shadow-sm">
          <div>
            {/* Header with Title + 2 Tiny Round Icon Buttons */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E6DFCC]/50">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#6B7A70]">
                OWNER PROFILE
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="size-7 rounded-full bg-white border border-[#E6DFCC] flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] transition shadow-2xs"
                  title="Edit Profile"
                  aria-label="Edit"
                >
                  <MoreHorizontal className="size-3.5" />
                </button>
                <button
                  onClick={() => onNavigateTab('profile')}
                  className="size-7 rounded-full bg-white border border-[#E6DFCC] flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] transition shadow-2xs"
                  title="Expand Profile"
                  aria-label="Expand"
                >
                  <Maximize2 className="size-3" />
                </button>
              </div>
            </div>

            {/* Large Round Avatar + Name + Role */}
            <div className="mt-5 flex flex-col items-center text-center">
              <div className="relative size-20 rounded-full bg-[#13321F] text-[#E8A33D] font-extrabold text-2xl flex items-center justify-center border-3 border-[#E8A33D] shadow-md overflow-hidden">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="size-full object-cover" />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>

              <h4 className="text-base font-black text-[#13321F] mt-3">
                {currentUser.name}
              </h4>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#13321F] text-[#E8A33D] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                {currentUser.role}
              </span>
            </div>

            {/* Detailed Information List */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#F8F4EA]/80 border border-[#E6DFCC]/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7A70] font-semibold">User ID:</span>
                <span className="font-mono font-bold text-[#13321F]">{currentUser.userId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7A70] font-semibold">Security State:</span>
                <span className="font-bold text-[#2E9E6B]">Verified Session</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#6B7A70] font-semibold">Last Login:</span>
                <span className="text-[#13321F] font-medium">
                  {currentUser.lastLogin
                    ? new Date(currentUser.lastLogin).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })
                    : 'Today'}
                </span>
              </div>
            </div>
          </div>

          {/* Action pill button */}
          <div className="mt-5 pt-3 border-t border-[#E6DFCC]/50">
            <button
              onClick={() => onNavigateTab('profile')}
              className="w-full admin-pill-btn h-10 rounded-full bg-white border border-[#E6DFCC] text-[#13321F] text-xs font-bold hover:bg-[#F8F4EA] transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="size-3.5 text-[#E8A33D]" />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* BENTO GRID ROW 2: Balanced 3-Card SaaS Grid                   */}
      {/* Quick Actions (1) + Media Upload (1) + Website Editor (1)     */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full">
        {/* Card 1: Quick Actions & Storage Ring Card */}
        <div className="admin-glass-card rounded-[28px] p-6 shadow-sm border border-[#E6DFCC]/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E6DFCC]/50">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#6B7A70]">
                QUICK ACTIONS
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  className="size-7 rounded-full bg-white border border-[#E6DFCC] flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] transition shadow-2xs"
                  aria-label="Options"
                >
                  <MoreHorizontal className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => onOpenUpload('Video')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E6DFCC]/70 hover:bg-[#F8F4EA] text-[#13321F] text-xs font-bold transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-[#4F7DF3]/15 text-[#4F7DF3] flex items-center justify-center">
                    <Video className="size-4" />
                  </div>
                  <span>+ Upload Video Lecture</span>
                </div>
                <ArrowUpRight className="size-4 text-[#6B7A70] group-hover:text-[#13321F] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={() => onOpenUpload('PDF')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E6DFCC]/70 hover:bg-[#F8F4EA] text-[#13321F] text-xs font-bold transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-[#2E9E6B]/15 text-[#2E9E6B] flex items-center justify-center">
                    <FileText className="size-4" />
                  </div>
                  <span>+ Upload PDF / Notes</span>
                </div>
                <ArrowUpRight className="size-4 text-[#6B7A70] group-hover:text-[#13321F] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={() => onNavigateTab('website')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E6DFCC]/70 hover:bg-[#F8F4EA] text-[#13321F] text-xs font-bold transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-[#E8A33D]/20 text-[#8A5D14] flex items-center justify-center">
                    <Sliders className="size-4" />
                  </div>
                  <span>+ Add Hero Banner</span>
                </div>
                <ArrowUpRight className="size-4 text-[#6B7A70] group-hover:text-[#13321F] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Storage Capacity Ring */}
          <div className="mt-5 pt-4 border-t border-[#E6DFCC]/50 flex items-center gap-3.5 bg-[#F8F4EA]/80 rounded-2xl p-3 border border-[#E6DFCC]/60">
            <div className="relative size-14 shrink-0 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r={radius} className="stroke-[#DED5C5]" strokeWidth="6" fill="none" />
                <circle
                  cx="44"
                  cy="44"
                  r={radius}
                  className="stroke-[#E8A33D] transition-all duration-500"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute text-[10px] font-black text-[#13321F]">
                {stats.storagePercent}%
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-[#13321F] block">
                Storage Capacity
              </span>
              <span className="text-[11px] text-[#6B7A70] block">
                4.2 GB of 50 GB allocated
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Highlight Card 1 - Vibrant Blue (#4F7DF3) - Media Uploader */}
        <div className="rounded-[28px] p-6 sm:p-7 text-white shadow-lg flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-br from-[#4F7DF3] to-[#3B66D6]">
          {/* Card Header with 2 Tiny Round Icon Buttons */}
          <div className="flex items-center justify-between pb-3 border-b border-white/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
              MEDIA UPLOADER
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenUpload('PDF')}
                className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
                title="Upload"
                aria-label="Upload"
              >
                <Upload className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="my-5">
            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
              <Upload className="size-6 text-white" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">
              Upload New Lesson or Notes
            </h3>
            <p className="text-xs text-white/85 mt-1 leading-relaxed">
              Add whiteboard recordings, chapter derivations, and Daily Practice Problems directly to your courses.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-[11px] font-bold text-white/80">
              Supports MP4, MOV & PDF
            </span>
            <button
              onClick={() => onOpenUpload('PDF')}
              className="size-10 rounded-full bg-white text-[#4F7DF3] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
              title="Open upload modal"
              aria-label="Upload"
            >
              <ArrowRight className="size-4.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Highlight Card 2 - Vibrant Teal (#4C93A3) - Website Editor */}
        <div className="rounded-[28px] p-6 sm:p-7 text-white shadow-lg flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-br from-[#4C93A3] to-[#357482]">
          {/* Card Header with 2 Tiny Round Icon Buttons */}
          <div className="flex items-center justify-between pb-3 border-b border-white/20">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
              WEBSITE EDITOR
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigateTab('website')}
                className="size-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition cursor-pointer"
                title="Open Website Editor"
                aria-label="Edit"
              >
                <Sliders className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="my-5">
            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3">
              <Sliders className="size-6 text-white" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">
              Edit Website Content & Banners
            </h3>
            <p className="text-xs text-white/85 mt-1 leading-relaxed">
              Update hero headlines, rotating announcement banners, course fees, and Ramgarh contact info with live preview.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-[11px] font-bold text-white/80">
              Live Preview & Instant Publish
            </span>
            <button
              onClick={() => onNavigateTab('website')}
              className="size-10 rounded-full bg-white text-[#4C93A3] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
              title="Go to website editor"
              aria-label="Edit Website"
            >
              <ArrowRight className="size-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
