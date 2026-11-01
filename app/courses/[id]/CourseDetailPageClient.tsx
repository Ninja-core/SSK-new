'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Menu,
  Phone,
  Play,
  Sparkles,
  Video,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { Course } from '@/lib/courses'
import { CourseStudyMaterialSection } from '@/components/CourseStudyMaterialSection'
import { instituteConfig } from '@/lib/institute'

interface CourseDetailPageClientProps {
  course: Course
}

export function CourseDetailPageClient({ course }: CourseDetailPageClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#12372A]">
      {/* ---------------- 1. FLOATING NAVBAR ---------------- */}
      <header className="sticky top-3 sm:top-5 z-50 mx-auto w-full max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between rounded-full border border-[#DED5C5] bg-[#FFFDF8]/95 px-4 sm:px-6 shadow-[0_8px_30px_rgba(18,55,42,0.06)] backdrop-blur-md">
          {/* Logo & Institute Branding */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-left transition-transform"
            aria-label="SSK Professional Coaching Classes Home"
          >
            <img
              src="/image14.png"
              alt="SSK Professional Logo"
              className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="leading-tight">
              <span className="block text-sm sm:text-[15px] font-extrabold tracking-tight text-[#12372A]">
                {instituteConfig.brandHeader}
              </span>
              <span className="block text-[9px] uppercase tracking-wider font-semibold text-[#12372A]/70">
                {instituteConfig.brandSub}
              </span>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Course page navigation">
            <button
              onClick={() => scrollToSection('study-material')}
              className="text-xs sm:text-[13px] font-semibold text-[#68675D] transition-colors hover:text-[#12372A]"
            >
              Study Notes (PDF)
            </button>
            <button
              onClick={() => scrollToSection('playlist')}
              className="text-xs sm:text-[13px] font-semibold text-[#68675D] transition-colors hover:text-[#12372A]"
            >
              Playlist
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${instituteConfig.contactNumbers[0].tel}`}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-[#DED5C5] bg-[#F7F2E8] px-3 py-1.5 text-xs font-bold text-[#12372A] hover:bg-[#EBE3D5] transition"
              title="Call Institute"
            >
              <Phone className="size-3 text-[#12372A]" />
              <span>{instituteConfig.contactNumbers[0].label}</span>
            </a>

            <Link
              href="/#enquire"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#12372A] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-[#FAF5EC] shadow-[0_4px_14px_rgba(18,55,42,0.25)] transition hover:bg-[#1C4B3A] hover:shadow-md active:scale-95"
            >
              <span>Enquire Now</span>
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>

            <button
              className="grid size-9 place-items-center rounded-full text-[#12372A] hover:bg-[#F7F2E8] md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <nav
            className="mt-2 flex flex-col gap-2 rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-4 shadow-xl md:hidden"
            aria-label="Mobile navigation"
          >
            <Link
              href="/#courses"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#12372A] hover:bg-[#F7F2E8]"
              onClick={() => setMenuOpen(false)}
            >
              <ArrowLeft className="size-4" />
              <span>← Back to All Courses</span>
            </Link>
            <button
              onClick={() => {
                scrollToSection('study-material')
                setMenuOpen(false)
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#12372A] hover:bg-[#F7F2E8]"
            >
              Study Notes (PDF)
            </button>
            <button
              onClick={() => {
                scrollToSection('playlist')
                setMenuOpen(false)
              }}
              className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#12372A] hover:bg-[#F7F2E8]"
            >
              Course Playlist
            </button>
            <Link
              href="/#enquire"
              className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#12372A] hover:bg-[#F7F2E8]"
              onClick={() => setMenuOpen(false)}
            >
              Admission Enquiry
            </Link>
          </nav>
        )}
      </header>

      {/* ---------------- 2. BACK TO ALL COURSES BUTTON (BLUE BOX) ---------------- */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <Link
          href="/#courses"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5277C3] hover:bg-[#4163AC] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition hover:shadow-sm active:scale-98"
        >
          <ArrowLeft className="size-4" />
          <span>Back to All Courses</span>
        </Link>
      </div>

      {/* ---------------- 3. COURSE HERO BANNER ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-4 sm:pt-6 pb-12">
        <div
          className="relative overflow-hidden rounded-3xl border p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(18,55,42,0.06)]"
          style={{
            backgroundColor: course.cardBg,
            borderColor: course.borderColor,
          }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12 items-center">
            {/* Left Column: Details */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-2xs"
                  style={{
                    backgroundColor: course.pillBg,
                    color: course.pillText,
                    border: `1px solid ${course.borderColor}`,
                  }}
                >
                  {course.eyebrow}
                </span>
                <span
                  className="rounded-full bg-white/80 border px-3 py-1 text-xs font-bold tracking-wide uppercase"
                  style={{ color: course.accentColor, borderColor: course.borderColor }}
                >
                  {course.tag}
                </span>
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#12372A]">
                {course.name}
              </h1>

              {/* Schedule and Doubt resolving tags */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#4A5568]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Calendar className="size-3.5 text-[#12372A]" />
                  {course.schedulePill}
                </span>
                <span>•</span>
                <span
                  className="inline-flex items-center gap-1.5 font-semibold"
                  style={{ color: course.accentColor }}
                >
                  <Clock className="size-3.5" />
                  {course.doubtPill}
                </span>
              </div>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#334155] max-w-2xl">
                {course.description}
              </p>

              {/* Highlights List */}
              <ul className="mt-6 space-y-2.5">
                {course.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-[#12372A]">
                    <span
                      className="mt-0.5 grid size-5 place-items-center rounded-full text-white shrink-0"
                      style={{ backgroundColor: course.accentColor }}
                    >
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => scrollToSection('study-material')}
                  className="inline-flex items-center gap-2 rounded-xl py-3 px-5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-98"
                  style={{ backgroundColor: course.buttonBg }}
                >
                  <FileText className="size-4" />
                  <span>Unlock Study Notes & PDF (₹1)</span>
                </button>

                <button
                  onClick={() => scrollToSection('playlist')}
                  className="inline-flex items-center gap-2 rounded-xl bg-white border py-3 px-5 text-xs sm:text-sm font-bold text-[#12372A] hover:bg-[#F7F2E8] transition shadow-xs"
                  style={{ borderColor: course.borderColor }}
                >
                  <Play className="size-4" style={{ color: course.accentColor }} />
                  <span>Watch Playlist</span>
                </button>

                <Link
                  href="/#enquire"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#12372A] py-3 px-5 text-xs sm:text-sm font-bold text-white hover:bg-[#1C4B3A] transition shadow-xs"
                >
                  <span>Enroll / Demo Class</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Pricing & Quick Summary Card */}
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-2xl border bg-white shadow-md" style={{ borderColor: course.borderColor }}>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold shadow-md"
                      style={{
                        backgroundColor: course.pillBg,
                        color: course.pillText,
                        border: `1px solid ${course.borderColor}`,
                      }}
                    >
                      {course.discount}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: `${course.borderColor}70` }}>
                    <div>
                      <span className="text-[11px] font-semibold text-[#68675D] uppercase tracking-wider block">
                        Full Course Fee
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-extrabold text-[#12372A]">{course.formattedPrice}</span>
                        <span className="text-xs text-[#68675D] line-through">{course.originalPrice}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#12372A] bg-[#F7F2E8] px-2.5 py-1 rounded-md border border-[#DED5C5]">
                      Complete Batch Access
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-[#4A5568]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Class Eligibility:</span>
                      <span className="font-bold text-[#12372A]">Class 11th & 12th</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Stream:</span>
                      <span className="font-bold text-[#12372A]">Medical & Non-Medical</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Doubt Clearing:</span>
                      <span className="font-bold text-[#12372A]">1:1 Every Sunday</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Curriculum:</span>
                      <span className="font-bold text-[#12372A]">Board + NEET + JEE</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t" style={{ borderColor: `${course.borderColor}70` }}>
                    <Link
                      href="/#enquire"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold text-white shadow-sm transition hover:brightness-105 active:scale-98"
                      style={{ backgroundColor: course.buttonBg }}
                    >
                      <span>Reserve Your Seat</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. DEDICATED STUDY MATERIAL & PDF UNLOCK SECTION ---------------- */}
      <CourseStudyMaterialSection
        selectedCourseId={course.id}
        hideCourseTabs={true}
        courseTitle={course.name}
      />

      {/* ---------------- 6. COURSE PLAYLIST & LECTURE VIDEOS ---------------- */}
      <section id="playlist" className="border-t border-[#DED5C5] bg-[#FFFDF8] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBE3D5] border border-[#DED5C5] px-3.5 py-1 text-xs font-bold text-[#12372A] uppercase tracking-wider shadow-xs">
              <Video className="size-3.5 text-[#12372A]" />
              <span>OFFICIAL VIDEO LECTURES & PLAYLIST</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#12372A]">
              {course.name} Video Playlist
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#68675D]">
              Stream chapter lectures, problem derivation walkthroughs, and recorded 1:1 faculty doubt sessions anytime.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#DED5C5] bg-[#FAF5EC] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#68675D]">
                <span className="font-bold text-[#12372A]">Module 01</span>
                <span>45 Mins</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-[#12372A]">
                Foundational Principles &amp; Conceptual Theory
              </h3>
              <p className="mt-1 text-xs text-[#4A5568] leading-relaxed">
                Step-by-step introduction to core laws, physical representations, and intuitive mental models.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#12372A]">
                <Play className="size-3.5 text-emerald-700" />
                <span>Free Classroom Preview</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#DED5C5] bg-[#FAF5EC] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#68675D]">
                <span className="font-bold text-[#12372A]">Module 02</span>
                <span>60 Mins</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-[#12372A]">
                NCERT Line-by-Line &amp; High-Yield Board Derivations
              </h3>
              <p className="mt-1 text-xs text-[#4A5568] leading-relaxed">
                Exam-oriented problem sets, common scoring pitfalls, and step-marking formats explained by faculty.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#12372A]">
                <Play className="size-3.5 text-emerald-700" />
                <span>Enrolled Students Access</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#DED5C5] bg-[#FAF5EC] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-[#68675D]">
                <span className="font-bold text-[#12372A]">Module 03</span>
                <span>50 Mins</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-[#12372A]">
                Sunday 1:1 Faculty Doubt Solving &amp; PYQs
              </h3>
              <p className="mt-1 text-xs text-[#4A5568] leading-relaxed">
                Curated solutions to student roadblocks, tricky entrance shortcuts, and formula retention techniques.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#12372A]">
                <Play className="size-3.5 text-emerald-700" />
                <span>Live Interactive Slot</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href={course.youtubePlaylistUrl || instituteConfig.youtube.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#12372A] px-6 py-3 text-xs sm:text-sm font-bold text-[#FAF5EC] shadow-md transition hover:bg-[#1C4B3A]"
            >
              <Play className="size-4" />
              <span>Open Official YouTube Playlist</span>
              <ExternalLink className="size-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- 7. FOOTER ---------------- */}
      <footer className="border-t border-[#DED5C5] bg-[#FFFDF8] py-10">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#68675D]">
          <div className="flex items-center gap-2">
            <img src="/image14.png" alt="SSK Logo" className="h-8 w-auto object-contain" />
            <span className="font-bold text-[#12372A]">{instituteConfig.name}</span>
          </div>
          <p>© {new Date().getFullYear()} SSK Coaching Classes, Near Post Office, Ramgarh. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#12372A] font-semibold">
              Home
            </Link>
            <Link href="/#courses" className="hover:text-[#12372A] font-semibold">
              All Courses
            </Link>
            <Link href="/owner/verify" className="hover:text-[#12372A] text-[11px] text-[#68675D]/80">
              Owner Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

