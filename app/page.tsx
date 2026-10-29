'use client'

import { FormEvent, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Calendar,
  Flame,
  FlaskConical,
  GraduationCap,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Send,
  Sparkles,
  Video,
  X,
  Calculator,
  Cpu,
  Microscope,
  Target,
} from 'lucide-react'
import { HeroBannerCard } from '@/components/HeroBannerCard'
import { instituteConfig } from '@/lib/institute'

function InstagramIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

// Centralized course details with ₹4,999 pricing and syllabus pathways
export const courses = [
  {
    id: 'physical',
    number: '01',
    name: 'Physical Chemistry',
    eyebrow: 'CLASS 11th & 12th',
    tag: 'Numericals & Conceptual Derivations',
    image: '/image4.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹8,999',
    discount: '44% OFF',
    cardBg: '#E8F0FE',
    accentColor: '#5277C3',
    borderColor: '#C7D9FA',
    pillBg: '#D6E4FC',
    pillText: '#2C4F9E',
    buttonBg: '#5277C3',
    buttonHoverBg: '#4163AC',
    schedulePill: 'Target Boards & Entrances',
    doubtPill: '1:1 Doubt Solving',
    description: 'Make equations intuitive through clear concepts, worked examples, and step-by-step problem derivations.',
    highlights: [
      'Chapter-wise Board PYQs & Daily Practice Problems',
      'Sunday 1:1 dedicated doubt resolution',
    ],
    topics: ['Mole Concept', 'Thermodynamics', 'Equilibrium', 'Chemical Kinetics', 'Electrochemistry'],
    youtubePlaylistUrl: '', // Add YouTube playlist link when ready
  },
  {
    id: 'organic',
    number: '02',
    name: 'Organic Chemistry',
    eyebrow: 'CLASS 11th & 12th',
    tag: 'Mechanisms & Synthesis Mastery',
    image: '/image5.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹8,999',
    discount: '44% OFF',
    cardBg: '#F1EAFE',
    accentColor: '#8B72C9',
    borderColor: '#DDD0FA',
    pillBg: '#E5D8FC',
    pillText: '#5E449D',
    buttonBg: '#8B72C9',
    buttonHoverBg: '#765DB5',
    schedulePill: 'NCERT Line-by-Line',
    doubtPill: '1:1 Doubt Solving',
    description: 'Understand reactions as connected stories instead of isolated facts to memorise.',
    highlights: [
      'General Organic Chemistry (GOC) & intermediates',
      'Sunday 1:1 dedicated doubt resolution',
    ],
    topics: ['GOC & Isomerism', 'Hydrocarbons', 'Haloalkanes', 'Carbonyl Compounds', 'Biomolecules'],
    youtubePlaylistUrl: '', // Add YouTube playlist link when ready
  },
  {
    id: 'inorganic',
    number: '03',
    name: 'Inorganic Chemistry',
    eyebrow: 'CLASS 11th & 12th',
    tag: 'Periodic Trends & NCERT Mastery',
    image: '/image6.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹8,999',
    discount: '44% OFF',
    cardBg: '#E4F5EC',
    accentColor: '#398568',
    borderColor: '#C0E6D2',
    pillBg: '#D0EEDD',
    pillText: '#235D47',
    buttonBg: '#398568',
    buttonHoverBg: '#2D6F55',
    schedulePill: 'High-Yield Memory Maps',
    doubtPill: '1:1 Doubt Solving',
    description: 'Turn periodic trends, bonding, and coordination chemistry into a system you can rely on.',
    highlights: [
      'NCERT exemplar decoding with quick revision guides',
      'Sunday 1:1 dedicated doubt resolution',
    ],
    topics: ['Periodic Table', 'Chemical Bonding', 'Coordination Chemistry', 'p-Block Elements', 'd & f-Block'],
    youtubePlaylistUrl: '', // Add YouTube playlist link when ready
  },
  {
    id: 'complete',
    number: '04',
    name: 'Complete Chemistry Course',
    eyebrow: 'COMPREHENSIVE BATCH',
    tag: 'Physical + Organic + Inorganic All-in-One',
    image: '/image7.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹9,999',
    discount: '50% OFF',
    cardBg: '#F8EBDD',
    accentColor: '#B68A42',
    borderColor: '#E8D4BE',
    pillBg: '#F2DFCB',
    pillText: '#865E1E',
    buttonBg: '#B68A42',
    buttonHoverBg: '#9F7430',
    schedulePill: 'Full Syllabus Coverage',
    doubtPill: 'Sunday 1:1 Mentorship',
    description: 'A structured route through all three branches, designed for consistent revision and top scores.',
    highlights: [
      'Full-length test series with personal performance review',
      'Sunday 1:1 dedicated doubt resolution',
    ],
    topics: ['Complete Class 11th & 12th Syllabus', 'Board PYQ Bank', 'Formula Sheets', 'Mock Tests'],
    youtubePlaylistUrl: '', // Add YouTube playlist link when ready
  },
]

const reasons = [
  {
    num: '01',
    title: 'Concept Building',
    desc: 'Start with the why, then make the how feel natural so problem-solving becomes second nature.',
  },
  {
    num: '02',
    title: 'Structured Learning',
    desc: 'A clear chapter sequence keeps every derivation, reaction mechanism, and formula connected.',
  },
  {
    num: '03',
    title: 'Topic-Wise Lessons',
    desc: 'Break large syllabi into focused topics. Find exactly what you need without losing your place.',
  },
  {
    num: '04',
    title: 'Flexible Revision',
    desc: 'Return to difficult ideas with focused, practical review and dedicated 1:1 doubt support.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Choose a Course',
    desc: 'Select the specific Chemistry branch or complete pathway that aligns with your Class 11th or 12th academic goals.',
  },
  {
    num: '02',
    title: 'Follow Structured Lessons',
    desc: 'Engage with concept-first lectures, step-by-step problem derivations, and high-yield NCERT explanations.',
  },
  {
    num: '03',
    title: 'Strengthen Concepts',
    desc: 'Consolidate understanding through Daily Practice Problems (DPP), Board PYQs, and 1:1 Sunday doubt clearing.',
  },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('Complete Chemistry Course')
  const [studentName, setStudentName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [playlistNotice, setPlaylistNotice] = useState<string | null>(null)

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleCourseSelect(courseName?: string) {
    if (courseName) {
      setSelectedCourse(courseName)
    }
    scrollTo('enquire')
  }

  function handlePlaylistClick(course: typeof courses[0]) {
    if (course.youtubePlaylistUrl) {
      window.open(course.youtubePlaylistUrl, '_blank', 'noopener,noreferrer')
    } else {
      setPlaylistNotice(course.name)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!studentName.trim()) {
      setFormFeedback({ type: 'error', text: 'Please enter the student full name.' })
      return
    }

    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '')
    if (cleanPhone.length < 10) {
      setFormFeedback({ type: 'error', text: 'Please enter a valid 10-digit phone number.' })
      return
    }

    setFormFeedback({
      type: 'success',
      text: `Thank you, ${studentName}! Your admission enquiry for "${selectedCourse}" has been recorded. Our coordinator will contact you at ${phoneNumber}.`,
    })

    setStudentName('')
    setPhoneNumber('')
    setMessage('')
  }

  const navItems = [
    ['Courses', 'courses'],
    ['About Us', 'about'],
    ['Faculty', 'faculty'],
    ['Why Us', 'why-us'],
    ['Resources', 'resources'],
    ['Contact', 'contact'],
  ]

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#12372A]">
      {/* ---------------- 1. FLOATING NAVBAR ---------------- */}
      <header className="sticky top-3 sm:top-5 z-50 mx-auto w-full max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between rounded-full border border-[#DED5C5] bg-[#FFFDF8]/95 px-4 sm:px-6 shadow-[0_8px_30px_rgba(18,55,42,0.06)] backdrop-blur-md">
          {/* Logo & Institute Branding */}
          <button
            onClick={() => scrollTo('home')}
            className="group flex items-center gap-2.5 text-left transition-transform"
            aria-label="SSK Professional Coaching Classes Home"
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#12372A] text-[#FAF5EC] shadow-sm transition-transform group-hover:scale-105">
              <Atom aria-hidden="true" className="size-5" />
            </span>
            <div className="leading-tight">
              <span className="block text-sm sm:text-[15px] font-extrabold tracking-tight text-[#12372A]">
                {instituteConfig.brandHeader}
              </span>
              <span className="block text-[9px] uppercase tracking-wider font-semibold text-[#12372A]/70">
                {instituteConfig.brandSub}
              </span>
            </div>
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            {navItems.map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-xs sm:text-[13px] font-semibold text-[#68675D] transition-colors hover:text-[#12372A]"
              >
                {label}
              </button>
            ))}
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

            <button
              onClick={() => scrollTo('enquire')}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#12372A] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-[#FAF5EC] shadow-[0_4px_14px_rgba(18,55,42,0.25)] transition hover:bg-[#1C4B3A] hover:shadow-md active:scale-95"
            >
              <span>Enquire Now</span>
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </button>

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
            className="mt-2 flex flex-col gap-3 rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-5 shadow-xl md:hidden"
            aria-label="Mobile navigation"
          >
            {navItems.map(([label, id]) => (
              <button
                key={id}
                onClick={() => {
                  scrollTo(id)
                  setMenuOpen(false)
                }}
                className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#12372A] hover:bg-[#F7F2E8]"
              >
                {label}
              </button>
            ))}
            <div className="border-t border-[#DED5C5] pt-3 space-y-2">
              <a
                href={`tel:${instituteConfig.contactNumbers[0].tel}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#DED5C5] bg-[#F7F2E8] py-2.5 text-xs font-bold text-[#12372A]"
              >
                <Phone className="size-3.5 text-[#12372A]" />
                <span>Call {instituteConfig.contactNumbers[0].label}</span>
              </a>
              <button
                onClick={() => {
                  scrollTo('enquire')
                  setMenuOpen(false)
                }}
                className="w-full rounded-xl bg-[#12372A] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#FAF5EC] shadow-sm hover:bg-[#1C4B3A]"
              >
                Enquire for Admission
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* ---------------- 2. HERO SECTION ---------------- */}
      <section
        id="home"
        className="relative mx-auto max-w-6xl px-4 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-22"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* LEFT SIDE: Headings, Badge, CTAs, Features */}
          <div>
            {/* Admissions Open Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DED5C5] bg-[#F7F2E8] px-3.5 py-1.5 text-xs font-semibold text-[#12372A] shadow-xs">
              <span className="size-2 rounded-full bg-[#12372A] animate-pulse" />
              <span>{instituteConfig.admissions.toUpperCase()} | {instituteConfig.classes.toUpperCase()}</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold tracking-tight text-[#12372A] leading-[1.18]">
              Master Chemistry.{' '}
              <span className="text-[#12372A] underline decoration-[#E8A33D] decoration-4 underline-offset-8">
                Build Your Future.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-4 text-base sm:text-lg text-[#68675D] leading-relaxed max-w-xl">
              Build strong Chemistry concepts with structured lessons, focused explanations,
              and a learning approach designed for {instituteConfig.classes} students across {instituteConfig.streams} streams.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                onClick={() => scrollTo('courses')}
                className="inline-flex items-center gap-2 rounded-full bg-[#12372A] px-6 py-3.5 text-sm font-bold text-[#FAF5EC] shadow-[0_6px_20px_rgba(18,55,42,0.25)] transition hover:bg-[#1C4B3A] hover:shadow-lg active:scale-95"
              >
                <span>Explore Chemistry Courses</span>
                <ArrowRight className="size-4" />
              </button>

              <button
                onClick={() => scrollTo('enquire')}
                className="inline-flex items-center gap-2 rounded-full border border-[#DED5C5] bg-[#FFFDF8] px-6 py-3.5 text-sm font-bold text-[#12372A] shadow-xs transition hover:bg-[#F7F2E8] hover:border-[#12372A]/40 active:scale-95"
              >
                <span>Enquire for Admission</span>
              </button>
            </div>

            {/* Academic Features Checkmark Row */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#DED5C5] pt-5 text-xs sm:text-sm font-medium text-[#12372A]">
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-[#12372A]" />
                <span>{instituteConfig.classes}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-[#12372A]" />
                <span>{instituteConfig.streams}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-[#12372A]" />
                <span>{instituteConfig.address}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Promotional Institute Banner Card */}
          <div className="flex justify-center">
            <HeroBannerCard onEnquireClick={handleCourseSelect} />
          </div>
        </div>
      </section>

      {/* ---------------- 3. COURSES SECTION ---------------- */}
      <section id="courses" className="relative border-y border-[#DED5C5] bg-[#F7F2E8] py-14 sm:py-16 overflow-hidden">
        {/* Subtle background image 6 (Chemistry laboratory setup) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] bg-cover bg-center"
          style={{ backgroundImage: "url('/image6.jpg')" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-4">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">OUR SPECIALIZED CURRICULUM</p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#12372A]">
              Explore Our Chemistry Courses
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#68675D]">
              Choose your subject and start building a stronger understanding of Chemistry. All courses available at just ₹4,999.
            </p>
          </div>

          {/* 4 Image-Based Course Cards in Deep Forest Green theme */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => {
              return (
                <article
                  key={course.id}
                  className="group flex flex-col justify-between rounded-2xl border border-[#DED5C5]/30 bg-[#12372A] text-[#FAF5EC] overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#E8A33D] hover:shadow-2xl"
                >
                  {/* Top Image Banner */}
                  <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-[#0D281E]">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12372A] via-[#12372A]/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5">
                      <span className="rounded-full bg-[#0D281E]/90 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E8A33D] border border-white/10">
                        {course.eyebrow}
                      </span>
                      <span className="rounded-full bg-[#E8A33D] px-2 py-0.5 text-[10px] font-extrabold text-[#12372A] shadow-xs">
                        {course.formattedPrice}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-1 justify-between p-4 sm:p-4.5">
                    <div>
                      {/* Feature Tag */}
                      <span className="text-[10px] font-semibold text-[#E8A33D] tracking-wide block">
                        {course.tag}
                      </span>

                      {/* Course Title */}
                      <h3 className="mt-1 text-base sm:text-lg font-bold tracking-tight text-[#FAF5EC] group-hover:text-[#E8A33D] transition-colors">
                        {course.name}
                      </h3>

                      {/* Subtitle / Schedule pill */}
                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#FAF5EC]/70">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="size-3 text-[#FAF5EC]/60" />
                          {course.schedulePill}
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-[#E8A33D] font-medium">
                          <Clock className="size-3" />
                          {course.doubtPill}
                        </span>
                      </div>

                      {/* Short Description */}
                      <p className="mt-2 text-xs leading-relaxed text-[#FAF5EC]/80 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Compact Checkmark Highlights */}
                      <ul className="mt-3 space-y-1.5 border-t border-white/10 pt-2.5">
                        {course.highlights.slice(0, 3).map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#FAF5EC]/85">
                            <Check className="mt-0.5 size-3 shrink-0 text-[#E8A33D]" />
                            <span className="line-clamp-1">{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Compact Pricing Block */}
                      <div className="mt-3 flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold text-[#FAF5EC]">{course.formattedPrice}</span>
                          <span className="text-[10px] text-[#FAF5EC]/60 line-through">{course.originalPrice}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#E8A33D] bg-[#E8A33D]/15 px-1.5 py-0.5 rounded border border-[#E8A33D]/30">
                          {course.discount}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="mt-3.5 pt-2.5 border-t border-white/10 flex flex-col gap-1.5">
                      <button
                        onClick={() => handleCourseSelect(course.name)}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#FAF5EC] py-2 px-3 text-xs font-bold text-[#12372A] shadow-xs transition hover:bg-[#EBE3D5] active:scale-98"
                      >
                        <span>Enroll for {course.formattedPrice}</span>
                        <ArrowRight className="size-3.5" />
                      </button>

                      <button
                        onClick={() => handlePlaylistClick(course)}
                        className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-white/15 py-1.5 px-2.5 text-[10px] font-semibold text-[#FAF5EC]/80 hover:bg-white/10 transition"
                      >
                        <Play className="size-2.5 text-[#E8A33D]" />
                        <span>{course.youtubePlaylistUrl ? 'Watch Playlist' : 'View Playlist'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------- 4. ABOUT OUR INSTITUTE SECTION ---------------- */}
      <section id="about" className="border-t border-[#DED5C5] bg-[#FAF5EC] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4">
          {/* Section Header */}
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-[#EBE3D5] border border-[#DED5C5] px-3.5 py-1 text-xs font-bold text-[#12372A] uppercase tracking-wider">
              ABOUT OUR INSTITUTE
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#12372A]">
              Meet SSK Professional Coaching Classes
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#68675D] leading-relaxed">
              SSK Professional Coaching Classes provides tuition for Class 11th and 12th students across Medical
              and Non-Medical streams. Our faculty covers Chemistry, Mathematics, Electronics, and Zoology.
            </p>
          </div>

          {/* Clear Information Panel + Working Contact Action Buttons */}
          <div className="mt-10 rounded-2xl sm:rounded-3xl border border-[#DED5C5] bg-[#FFFDF8] p-6 sm:p-8 shadow-[0_8px_30px_rgba(18,55,42,0.05)]">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              {/* Information Grid */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#12372A]">
                  INSTITUTE SUMMARY
                </p>
                <h3 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#12372A]">
                  {instituteConfig.name}
                </h3>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#DED5C5] bg-[#F7F2E8] p-3.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#12372A]/70 block">Status</span>
                    <p className="mt-1 text-sm font-extrabold text-[#12372A] flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#12372A] animate-pulse" />
                      {instituteConfig.admissions}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#DED5C5] bg-[#F7F2E8] p-3.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#12372A]/70 block">Classes</span>
                    <p className="mt-1 text-sm font-bold text-[#12372A]">
                      {instituteConfig.classes}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#DED5C5] bg-[#F7F2E8] p-3.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#12372A]/70 block">Streams</span>
                    <p className="mt-1 text-sm font-bold text-[#12372A]">
                      {instituteConfig.streams}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#DED5C5] bg-[#F7F2E8] p-3.5 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#12372A]/70 block">Campus Address</span>
                    <p className="mt-1 text-sm font-bold text-[#12372A] flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#12372A] shrink-0" />
                      <span>{instituteConfig.address}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Contact Buttons Panel */}
              <div className="flex flex-col gap-3 rounded-2xl border border-[#DED5C5] bg-[#F7F2E8] p-5 sm:p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-[#12372A]">
                  Direct Contact & Admissions
                </p>
                <p className="text-xs text-[#68675D]">
                  Call our institute directly or connect on Instagram for admissions and batch schedules.
                </p>

                <div className="mt-2 flex flex-col gap-2.5">
                  {/* Working Call Button 1 */}
                  <a
                    href={`tel:${instituteConfig.contactNumbers[0].tel}`}
                    className="inline-flex items-center justify-between rounded-xl bg-[#FFFDF8] border border-[#DED5C5] px-4 py-3 text-xs font-bold text-[#12372A] shadow-xs hover:border-[#12372A] transition"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Phone className="size-4 text-[#12372A]" />
                      <span>Call {instituteConfig.contactNumbers[0].label}</span>
                    </span>
                    <span className="rounded-full bg-[#EBE3D5] px-2 py-0.5 text-[10px] text-[#12372A] font-semibold">Primary</span>
                  </a>

                  {/* Working Call Button 2 */}
                  <a
                    href={`tel:${instituteConfig.contactNumbers[1].tel}`}
                    className="inline-flex items-center justify-between rounded-xl bg-[#FFFDF8] border border-[#DED5C5] px-4 py-3 text-xs font-bold text-[#12372A] shadow-xs hover:border-[#12372A] transition"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Phone className="size-4 text-[#12372A]" />
                      <span>Call {instituteConfig.contactNumbers[1].label}</span>
                    </span>
                    <span className="rounded-full bg-[#EBE3D5] px-2 py-0.5 text-[10px] text-[#68675D] font-semibold">Alternative</span>
                  </a>

                  {/* Working Instagram Link */}
                  <a
                    href={instituteConfig.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-xl bg-[#FFFDF8] border border-[#DED5C5] px-4 py-3 text-xs font-bold text-[#12372A] shadow-xs hover:border-[#12372A] transition"
                  >
                    <span className="inline-flex items-center gap-2">
                      <InstagramIcon className="size-4 text-[#D9573B]" />
                      <span>Instagram: {instituteConfig.instagram.handle}</span>
                    </span>
                    <ArrowUpRight className="size-3.5 text-[#12372A]" />
                  </a>

                  {/* Enquire Now Button */}
                  <button
                    onClick={() => scrollTo('enquire')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#FAF5EC] shadow-md shadow-[#12372A]/25 transition"
                  >
                    <span>Enquire Now for Admissions</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. EXPLORE YOUR LEARNING PATH SECTION (PROGRAM PATHWAYS) ---------------- */}
      <section id="why-us" className="border-t border-[#DED5C5] bg-[#F7F2E8] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-[#EBE3D5] border border-[#DED5C5] px-4 py-1 text-xs font-bold text-[#12372A] uppercase tracking-wider shadow-xs">
              PROGRAM PATHWAYS
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#12372A]">
              Explore Your Learning Path
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#68675D]">
              Build strong concepts and prepare confidently for your academic goals.
            </p>
          </div>

          {/* 2-Column Balanced Layout: Prominent Educational Illustration on Left, SSK Chemistry Learning on Right */}
          <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left Side: Prominent, Natural Educational Illustration */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full flex items-center justify-center">
                {/* Subtle soft ambient glow behind the artwork */}
                <div className="absolute inset-0 -m-6 rounded-full bg-[#EBE3D5]/50 blur-3xl pointer-events-none" />

                <img
                  src="/image8.jpg"
                  alt="Students learning with academic guidance and roadmap at SSK Coaching Classes"
                  className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto object-contain transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>

              {/* Floating Colorful Feature Pills below image */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDF8] border border-[#DED5C5] px-3.5 py-1 text-xs font-bold text-[#12372A] shadow-xs">
                  <Sparkles className="size-3.5 text-[#E8A33D]" />
                  <span>Concept-First Pedagogy</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDF8] border border-[#DED5C5] px-3.5 py-1 text-xs font-bold text-[#12372A] shadow-xs">
                  <Check className="size-3.5 text-[#12372A]" />
                  <span>1:1 Doubt Solving</span>
                </span>
              </div>
            </div>

            {/* Right Side: SSK Chemistry Learning Card */}
            <div>
              <div className="relative overflow-hidden rounded-3xl border border-[#DED5C5] bg-[#FFFDF8] p-7 sm:p-9 shadow-[0_16px_50px_rgba(18,55,42,0.08)]">
                {/* Top Accent Gradient Line */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#12372A] via-[#6B8E78] to-[#E8A33D]" />

                {/* Card Header with Icon, Title, and Vivid Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#12372A] text-[#FAF5EC] shadow-md shadow-[#12372A]/20">
                    <GraduationCap className="size-7" />
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#12372A] tracking-tight">
                      SSK Chemistry Learning
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#EBE3D5] border border-[#DED5C5] px-3 py-0.5 text-xs font-bold text-[#12372A]">
                        Classes 11th & 12th
                      </span>
                      <span className="rounded-full bg-[#D1E2D7] border border-[#6B8E78]/30 px-3 py-0.5 text-xs font-bold text-[#12372A]">
                        Medical & Non-Medical
                      </span>
                      <span className="rounded-full bg-[#FBE8A6] border border-[#E8A33D]/30 px-3 py-0.5 text-xs font-bold text-[#12372A]">
                        Board • NEET • JEE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supporting Description */}
                <p className="mt-5 text-sm sm:text-[15px] text-[#68675D] leading-relaxed">
                </p>

                {/* Checkmark Feature Highlights */}
                <ul className="mt-6 space-y-3 border-t border-[#DED5C5]/60 pt-5">
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#12372A] font-medium">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#12372A] text-[#FAF5EC] shadow-xs">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span>Comprehensive Board, NEET & JEE Chemistry preparation across all chapters</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#12372A] font-medium">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#12372A] text-[#FAF5EC] shadow-xs">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span>Step-by-step reaction mechanisms & numerical problem algorithms</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-[#12372A] font-medium">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#12372A] text-[#FAF5EC] shadow-xs">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span>Daily Practice Problem (DPP) sheets, memory maps & high-yield NCERT decoding</span>
                  </li>
                  
                 
                </ul>

                {/* 3 Stat Metrics */}
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#DED5C5]/60 pt-5">
                  <div className="rounded-xl border border-[#DED5C5] bg-[#F7F2E8] p-3 text-center">
                    <span className="text-lg sm:text-xl font-extrabold text-[#12372A] block">100%</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#68675D] block mt-0.5">Concept Clarity</span>
                  </div>
                  <div className="rounded-xl border border-[#DED5C5] bg-[#F7F2E8] p-3 text-center">
                    <span className="text-lg sm:text-xl font-extrabold text-[#12372A] block">11th & 12th</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#68675D] block mt-0.5">Medical / Non-Med</span>
                  </div>
                  <div className="rounded-xl border border-[#DED5C5] bg-[#F7F2E8] p-3 text-center">
                    <span className="text-lg sm:text-xl font-extrabold text-[#12372A] block">Sunday 1:1</span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#68675D] block mt-0.5">Doubt Solving</span>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="mt-7 flex flex-col sm:flex-row items-center gap-3.5 border-t border-[#DED5C5]/60 pt-5">
                  <button
                    onClick={() => scrollTo('courses')}
                    className="inline-flex w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FAF5EC] shadow-md shadow-[#12372A]/25 transition-all hover:shadow-lg active:scale-98"
                  >
                    <span>Explore Chemistry Courses</span>
                    <ArrowRight className="size-4" />
                  </button>

                  <button
                    onClick={() => scrollTo('enquire')}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#DED5C5] bg-[#FFFDF8] hover:bg-[#F7F2E8] hover:border-[#12372A]/40 py-3.5 px-6 text-xs sm:text-sm font-bold text-[#12372A] shadow-2xs transition-all active:scale-98"
                  >
                    <span>Enquire for Admission</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. MEET OUR QUALIFIED EDUCATORS SECTION ---------------- */}
      <section
        id="faculty"
        className="relative border-t border-[#EBE3D5] bg-[#FAF5EC] py-20 sm:py-24 lg:py-28 overflow-hidden"
      >
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#12372A]">
              OUR EXPERT FACULTY
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#12372A] leading-tight">
              Meet Our Qualified Educators
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#12372A]/75 leading-relaxed">
              Learn from experienced post-graduate faculty dedicated to conceptual clarity in Medical and Non-Medical streams.
            </p>
          </div>

          {/* 4 Staggered Teacher Cards matching the reference */}
          <div className="mt-14 sm:mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 items-start">
            {instituteConfig.faculty.map((member, idx) => (
              <div
                key={idx}
                className={`group relative transition-all duration-300 ${member.staggerClass}`}
              >
                {/* Featured Card 1 layered offset backing (as seen in screenshot) */}
                {member.featured && (
                  <div
                    className="absolute inset-0 -top-2.5 -left-2.5 rounded-3xl bg-[#EBE3D5] -z-10 shadow-xs"
                    aria-hidden="true"
                  />
                )}

                {/* Card Container */}
                <div className="relative overflow-hidden rounded-3xl border border-[#12372A]/25 bg-[#FAF5EC] p-5 sm:p-6 shadow-[0_8px_30px_rgba(18,55,42,0.06)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_16px_40px_rgba(18,55,42,0.14)]">
                  {/* Large Faded Watermark Number in Background */}
                  <span
                    className="absolute top-2 right-4 text-7xl sm:text-8xl font-serif font-black text-[#12372A]/[0.08] select-none pointer-events-none leading-none z-0"
                    aria-hidden="true"
                  >
                    {member.number}
                  </span>

                  {/* Arched Photo Area with Dedicated Subject Background Color */}
                  <div
                    className="relative z-10 mx-auto w-full aspect-[4/4.2] overflow-hidden rounded-t-[75px] rounded-b-xl flex items-end justify-center shadow-xs"
                    style={{ backgroundColor: member.archColor }}
                  >
                    <img
                      src={member.image}
                      alt={`${member.name} - ${member.qualification}`}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Subject Tag Pill(s) */}
                  <div className="relative z-10 mt-4 flex flex-wrap items-center gap-1.5">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase shadow-2xs"
                      style={{
                        backgroundColor: member.tagBg,
                        color: member.tagText,
                      }}
                    >
                      {member.subject}
                    </span>

                    {member.extra && (
                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wider uppercase border border-[#12372A]/15 shadow-2xs"
                        style={{
                          backgroundColor: member.extraTagBg,
                          color: member.extraTagText,
                        }}
                      >
                        {member.extra}
                      </span>
                    )}
                  </div>

                  {/* Educator Name & Qualification */}
                  <div className="relative z-10 mt-3.5">
                    <h3 className="font-serif text-xl sm:text-[22px] font-bold text-[#12372A] tracking-tight leading-snug">
                      {member.name}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-[13px] font-medium text-[#12372A]/75">
                      {member.qualification}
                    </p>
                  </div>

                  {/* Editorial Quote */}
                  <p className="relative z-10 mt-3 text-xs sm:text-[13px] font-serif italic text-[#12372A]/90 leading-snug">
                    “{member.quote}”
                  </p>

                  {/* 2 Stats with Divider */}
                  <div className="relative z-10 mt-4 flex items-center justify-between border-t border-[#12372A]/15 pt-3">
                    <div>
                      <span className="block text-sm sm:text-base font-bold text-[#12372A]">
                        {member.stats.exp}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#12372A]/60 font-medium">
                        Yrs Exp.
                      </span>
                    </div>

                    <div className="h-6 w-px bg-[#12372A]/15" />

                    <div>
                      <span className="block text-sm sm:text-base font-bold text-[#12372A]">
                        {member.stats.students}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#12372A]/60 font-medium">
                        Students
                      </span>
                    </div>
                  </div>

                  {/* "Book a Demo Class →" Button (Matching the Reference) */}
                  <div className="relative z-10 mt-4">
                    <button
                      onClick={() => scrollTo('enquire')}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] py-2.5 px-4 text-xs font-bold text-[#FAF5EC] shadow-sm transition-all active:scale-98"
                    >
                      <span>Book a Demo Class</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
        
      {/* ---------------- 7. RESOURCES & PLAYLISTS SECTION ---------------- */}
      <section id="resources" className="relative border-t border-[#DED5C5] bg-[#FAF5EC] py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Subtle background image 4 (Online video study session) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] bg-cover bg-center"
          style={{ backgroundImage: "url('/image4.jpg')" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
            <div>
              <p className="eyebrow">LEARNING RESOURCES</p>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#12372A]">
                Your Next Lesson Is{' '}
                <span className="text-[#12372A] underline decoration-[#E8A33D] decoration-4 underline-offset-8">One Click Away.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#68675D]">
                A practical hub for YouTube lessons, syllabus notes, formula summaries, and revision queues.
                Students can revisit challenging mechanisms and calculations anytime.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#12372A] font-medium">
                  <CheckCircle2 className="size-4 text-[#12372A] shrink-0" />
                  <span>Chapter-wise recorded video lessons & worked derivations</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#12372A] font-medium">
                  <CheckCircle2 className="size-4 text-[#12372A] shrink-0" />
                  <span>Formula summary sheets and reaction mechanism roadmaps</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#12372A] font-medium">
                  <CheckCircle2 className="size-4 text-[#12372A] shrink-0" />
                  <span>Board examination previous 10-year question breakdown</span>
                </div>
              </div>

              {/* YouTube Link */}
              <div className="mt-6">
                <a
                  href={instituteConfig.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#D9573B] hover:underline"
                >
                  <Video className="size-4" />
                  <span>Visit YouTube: {instituteConfig.youtube.handle}</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Clean Coming Soon / Playlist Card */}
            <div className="rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#DED5C5] pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#EBE3D5] text-[#12372A]">
                    <Video className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#12372A]">SSK Digital Lecture Library</p>
                    <p className="text-xs text-[#68675D]">Official Playlist Index • {instituteConfig.classes}</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#EBE3D5] px-3 py-1 text-[11px] font-bold text-[#12372A]">
                  Coming Soon
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="grid size-14 place-items-center rounded-full border-2 border-dashed border-[#DED5C5] bg-[#F7F2E8] text-[#12372A]">
                  <Play className="size-6 ml-0.5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-[#12372A]">
                  Lessons Are Being Prepared
                </h3>
                <p className="mt-1.5 max-w-sm text-xs text-[#68675D] leading-relaxed">
                  YouTube playlists, syllabus lecture notes, and chapter revision videos will be linked directly here.
                  You can enrol today to reserve your seat in the classroom batch.
                </p>

                <button
                  onClick={() => scrollTo('enquire')}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#12372A] px-5 py-2.5 text-xs font-bold text-[#FAF5EC] shadow-xs hover:bg-[#1C4B3A] transition"
                >
                  <span>Enquire About Batches</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* ---------------- 8. TESTIMONIALS SECTION ---------------- */}
      <section className="relative border-t border-[#DED5C5] bg-[#F7F2E8] py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Subtle background image 5 (Student writing notes on study desk) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] bg-cover bg-center"
          style={{ backgroundImage: "url('/image5.jpg')" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">STUDENT SUCCESS STORIES</p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#12372A]">
              What Our Students Say
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#68675D]">
              Real words from students who built strong Chemistry concepts with SSK.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                quote:
                  "Reaction mechanisms finally made sense. The concept-first lectures helped me stop memorising and start understanding.",
                name: "Aarav Sharma",
                detail: "Class 12 • NEET Aspirant",
              },
              {
                quote:
                  "The daily practice sheets and Sunday doubt sessions boosted my confidence before the board exams.",
                name: "Simran Kaur",
                detail: "Class 12 • Board Exams",
              },
              {
                quote:
                  "Numerical problems used to scare me. Step-by-step methods made Physical Chemistry feel easy.",
                name: "Rohan Verma",
                detail: "Class 11 • JEE Aspirant",
              },
            ].map((t) => (
              <figure
                key={t.name}
                className="relative flex flex-col rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-7 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex gap-0.5 text-[#E8A33D]"
                    role="img"
                    aria-label="5 out of 5 stars"
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        className="size-4 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    className="font-serif text-6xl leading-none text-[#E8A33D]/30 select-none"
                    aria-hidden="true"
                  >
                    “
                  </span>
                </div>

                <blockquote className="mt-2 flex-1 text-sm sm:text-[15px] leading-relaxed text-[#12372A]">
                  “{t.quote}”
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-[#DED5C5] pt-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#EBE3D5] text-sm font-bold text-[#12372A]">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#12372A]">
                      {t.name}
                    </span>
                    <span className="block text-xs text-[#68675D]">
                      {t.detail}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 9. ADMISSION ENQUIRY SECTION ---------------- */}
      <section id="enquire" className="border-t border-[#DED5C5] bg-[#FAF5EC] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
            <div>
              <p className="eyebrow">ADMISSIONS & ENQUIRIES</p>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#12372A]">
                Let&apos;s Plan Your{' '}
                <span className="text-[#12372A] underline decoration-[#E8A33D] decoration-4 underline-offset-8">Academic Success.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#68675D]">
                Share a few details and we will help you find the right coaching pathway.
                Whether you are entering {instituteConfig.classes} for Medical or Non-Medical streams,
                our faculty at {instituteConfig.address} provides focused guidance.
              </p>

              {/* Quick Contact & WhatsApp Integration */}
              <div className="mt-8 space-y-4 rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-6 shadow-xs">
                <h3 className="text-sm font-bold text-[#12372A]">Official Contact Information</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#12372A]">
                    <MapPin className="size-4 text-[#12372A] shrink-0" />
                    <span><strong>Address:</strong> {instituteConfig.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#12372A]">
                    <Phone className="size-4 text-[#12372A] shrink-0" />
                    <span>
                      <strong>Call:</strong>{' '}
                      <a href={`tel:${instituteConfig.contactNumbers[0].tel}`} className="text-[#12372A] font-semibold hover:underline">
                        {instituteConfig.contactNumbers[0].label}
                      </a>
                      {', '}
                      <a href={`tel:${instituteConfig.contactNumbers[1].tel}`} className="text-[#12372A] font-semibold hover:underline">
                        {instituteConfig.contactNumbers[1].label}
                      </a>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[#12372A]">
                    <InstagramIcon className="size-4 text-[#D9573B] shrink-0" />
                    <span>
                      <strong>Instagram:</strong>{' '}
                      <a href={instituteConfig.instagram.url} target="_blank" rel="noopener noreferrer" className="text-[#12372A] font-semibold hover:underline">
                        {instituteConfig.instagram.handle}
                      </a>
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${instituteConfig.whatsappNumber}?text=${encodeURIComponent(
                    `Hello SSK Professional Coaching Classes, I would like to enquire about ${selectedCourse}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] px-4 py-3 text-xs font-bold text-[#FAF5EC] shadow-xs transition"
                >
                  <MessageCircle className="size-4 text-[#E8A33D]" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Admission Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-6 sm:p-9 shadow-sm"
            >
              <h3 className="text-lg font-bold text-[#12372A]">
                Student Admission Enquiry Form
              </h3>
              <p className="mt-1 text-xs text-[#68675D]">
                Fill out the form below and an academic coordinator will contact you directly.
              </p>

              {/* Feedback notification */}
              {formFeedback && (
                <div
                  className={`mt-4 rounded-xl p-3.5 text-xs font-medium leading-relaxed ${
                    formFeedback.type === 'success'
                      ? 'border border-[#DED5C5] bg-[#F7F2E8] text-[#12372A]'
                      : 'border border-rose-200 bg-rose-50 text-rose-800'
                  }`}
                >
                  {formFeedback.text}
                </div>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="field">
                  <span>Student Full Name *</span>
                  <input
                    name="name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    placeholder="Enter Your Full Name "
                  />
                </label>

                <label className="field">
                  <span>Contact Phone Number *</span>
                  <input
                    name="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    type="tel"
                    placeholder="Phone number"
                  />
                </label>

                <label className="field sm:col-span-2">
                  <span>Course of Interest</span>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    name="course"
                  >
                    <option value="Complete Chemistry Course">Complete Chemistry Course (Class 11 & 12) — ₹4,999</option>
                    <option value="Physical Chemistry">Physical Chemistry (Numericals & Formulas) — ₹4,999</option>
                    <option value="Organic Chemistry">Organic Chemistry (Mechanisms & GOC) — ₹4,999</option>
                    <option value="Inorganic Chemistry">Inorganic Chemistry (NCERT & Periodic Trends) — ₹4,999</option>
                  </select>
                </label>

                <label className="field sm:col-span-2">
                  <span>Message or Academic Goals <small>(Optional)</small></span>
                  <textarea
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Tell us about your current class (11th or 12th), stream (Medical or Non-Medical), or specific topics you need help with..."
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-col gap-4 border-t border-[#DED5C5] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-[#68675D]">
                  Submissions are received directly by the institute coordinator.
                </p>

                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#12372A] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FAF5EC] shadow-xs transition hover:bg-[#1C4B3A] active:scale-95"
                >
                  <span>Send Enquiry</span>
                  <Send className="size-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ---------------- 10. FOOTER ---------------- */}
      <footer id="contact" className="border-t border-[#12372A] bg-[#0E2A20] px-4 py-12 text-[#FAF5EC]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-10 md:flex-row">
            {/* Institute Identity */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-full bg-[#1C4B3A] text-[#FAF5EC]">
                  <Atom className="size-5" />
                </span>
                <div>
                  <span className="block text-sm font-extrabold tracking-tight text-[#FAF5EC]">
                    {instituteConfig.name}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider font-semibold text-[#E8A33D]">
                    {instituteConfig.address}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#FAF5EC]/70">
                Tuition available for {instituteConfig.classes} across {instituteConfig.streams} streams.
                Expert faculty for Chemistry, Mathematics, Electronics, and Zoology.
              </p>

              <div className="mt-4 flex flex-col gap-1.5 text-xs text-[#FAF5EC]/80">
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-[#E8A33D]" />
                  <span>{instituteConfig.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-[#E8A33D]" />
                  <span>
                    <a href={`tel:${instituteConfig.contactNumbers[0].tel}`} className="hover:text-white">
                      {instituteConfig.contactNumbers[0].label}
                    </a>
                    {', '}
                    <a href={`tel:${instituteConfig.contactNumbers[1].tel}`} className="hover:text-white">
                      {instituteConfig.contactNumbers[1].label}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
              <div>
                <p className="font-bold uppercase tracking-wider text-[#FAF5EC]">Navigation</p>
                <div className="mt-3 flex flex-col gap-2 text-[#FAF5EC]/70">
                  <button onClick={() => scrollTo('courses')} className="text-left hover:text-[#FAF5EC] transition">Courses</button>
                  <button onClick={() => scrollTo('about')} className="text-left hover:text-[#FAF5EC] transition">About Us</button>
                  <button onClick={() => scrollTo('faculty')} className="text-left hover:text-[#FAF5EC] transition">Faculty</button>
                  <button onClick={() => scrollTo('why-us')} className="text-left hover:text-[#FAF5EC] transition">Why Us</button>
                  <button onClick={() => scrollTo('resources')} className="text-left hover:text-[#FAF5EC] transition">Resources</button>
                  <button onClick={() => scrollTo('enquire')} className="text-left hover:text-[#FAF5EC] transition">Enquire</button>
                </div>
              </div>

              <div>
                <p className="font-bold uppercase tracking-wider text-[#FAF5EC]">Chemistry Batches</p>
                <div className="mt-3 flex flex-col gap-2 text-[#FAF5EC]/70">
                  <button onClick={() => handleCourseSelect('Physical Chemistry')} className="text-left hover:text-[#FAF5EC] transition">Physical Chemistry (₹4,999)</button>
                  <button onClick={() => handleCourseSelect('Organic Chemistry')} className="text-left hover:text-[#FAF5EC] transition">Organic Chemistry (₹4,999)</button>
                  <button onClick={() => handleCourseSelect('Inorganic Chemistry')} className="text-left hover:text-[#FAF5EC] transition">Inorganic Chemistry (₹4,999)</button>
                  <button onClick={() => handleCourseSelect('Complete Chemistry Course')} className="text-left hover:text-[#FAF5EC] transition">Complete Batch (₹4,999)</button>
                </div>
              </div>

              <div>
                <p className="font-bold uppercase tracking-wider text-[#FAF5EC]">Faculty & Social</p>
                <div className="mt-3 flex flex-col gap-2 text-[#FAF5EC]/70">
                  <span>Dalip Mangotra (Chemistry)</span>
                  <span>Udhay Slathia (Mathematics)</span>
                  <span>Rohit Gupta (Electronics)</span>
                  <span>Rakesh Kumar (Zoology)</span>
                  <a href={instituteConfig.instagram.url} target="_blank" rel="noopener noreferrer" className="text-[#E8A33D] hover:underline pt-2 flex items-center gap-1">
                    <InstagramIcon className="size-3" />
                    <span>{instituteConfig.instagram.handle}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col justify-between gap-4 pt-6 text-[11px] text-[#FAF5EC]/60 sm:flex-row">
            <span>© {new Date().getFullYear()} {instituteConfig.name}. All rights reserved.</span>
            <span>Near Post Office, Ramgarh • Concept-First Education.</span>
          </div>
        </div>
      </footer>

      {/* ---------------- PLAYLIST NOTICE MODAL ---------------- */}
      {playlistNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#DED5C5] pb-3">
              <div className="flex items-center gap-2 text-[#12372A]">
                <Video className="size-5" />
                <h3 className="font-bold text-[#12372A]">Course Playlist Update</h3>
              </div>
              <button
                onClick={() => setPlaylistNotice(null)}
                className="rounded-full p-1 text-[#68675D] hover:bg-[#F7F2E8] hover:text-[#12372A]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 text-xs sm:text-sm text-[#68675D] leading-relaxed">
              <p>
                The digital video lectures and YouTube playlist for{' '}
                <strong className="text-[#12372A]">{playlistNotice}</strong> (Batch Fee: ₹4,999) are currently being recorded
                and organized.
              </p>
              <p className="mt-2">
                In-person coaching and batch admissions at our Ramgarh campus are active. You can register for the classroom batch
                or request batch timings below.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setPlaylistNotice(null)}
                className="rounded-xl border border-[#DED5C5] px-4 py-2 text-xs font-semibold text-[#12372A] hover:bg-[#F7F2E8]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPlaylistNotice(null)
                  handleCourseSelect(playlistNotice)
                }}
                className="rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] px-4 py-2 text-xs font-bold text-[#FAF5EC]"
              >
                Enquire for This Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
