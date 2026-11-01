'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Lock,
  Unlock,
  FileText,
  CheckCircle2,
  Download,
  Eye,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowRight,
  X,
  CreditCard,
  Clock,
  KeyRound,
  Check,
} from 'lucide-react'
import { studyMaterials, StudyMaterial, razorpayConfig } from '@/lib/materials'

interface CourseStudyMaterialSectionProps {
  selectedCourseId: string
  onSelectCourse?: (courseId: string) => void
  hideCourseTabs?: boolean
  courseTitle?: string
}

type PaymentUiState = 'locked' | 'pending' | 'verified' | 'failed'

export function CourseStudyMaterialSection({
  selectedCourseId,
  onSelectCourse,
  hideCourseTabs = false,
  courseTitle,
}: CourseStudyMaterialSectionProps) {
  const initialMaterial =
    studyMaterials.find((m) => m.courseId === selectedCourseId) || studyMaterials[0]
  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial>(initialMaterial)

  // Payment & PDF state - strictly LOCKED by default
  const [paymentStatus, setPaymentStatus] = useState<PaymentUiState>('locked')
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null)
  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isInitiating, setIsInitiating] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [viewPdfInline, setViewPdfInline] = useState(false)

  // Owner Verification Modal state
  const [showOwnerModal, setShowOwnerModal] = useState(false)
  const [ownerPin, setOwnerPin] = useState('')
  const [ownerAuthenticated, setOwnerAuthenticated] = useState(false)
  const [ownerRequests, setOwnerRequests] = useState<any[]>([])
  const [ownerLoading, setOwnerLoading] = useState(false)
  const [ownerActionMsg, setOwnerActionMsg] = useState<string | null>(null)
  const [customPaymentId, setCustomPaymentId] = useState<Record<string, string>>({})

  // Polling ref
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 1. Clean up any legacy or fake unverified localStorage data from previous tests
  useEffect(() => {
    try {
      localStorage.removeItem('ssk_unlocked_materials')
    } catch {
      // silent
    }
  }, [])

  // 2. Check server-side status of a specific payment request
  const checkServerPaymentStatus = useCallback(
    async (requestId: string, silent = false) => {
      if (!requestId) return
      if (!silent) setIsCheckingStatus(true)

      try {
        const res = await fetch(`/api/payment/status?requestId=${encodeURIComponent(requestId)}`)
        const data = await res.json()

        if (data.status === 'verified' && data.token) {
          setIsUnlocked(true)
          setPaymentToken(data.token)
          setPaymentStatus('verified')
          setErrorMessage(null)
          // Store verified request ID in sessionStorage for page refresh persistence
          try {
            sessionStorage.setItem(`ssk_verified_req_${data.materialId}`, requestId)
            sessionStorage.setItem(`ssk_verified_token_${data.materialId}`, data.token)
          } catch {
            // silent
          }
          // Stop polling
          if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current)
            pollingTimerRef.current = null
          }
        } else if (data.status === 'failed') {
          setIsUnlocked(false)
          setPaymentStatus('failed')
          setErrorMessage(data.message || 'Payment could not be confirmed. Please try again.')
          if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current)
            pollingTimerRef.current = null
          }
        } else if (data.status === 'pending') {
          setIsUnlocked(false)
          setPaymentStatus('pending')
        } else {
          setIsUnlocked(false)
          setPaymentStatus('locked')
        }
      } catch (err: any) {
        if (!silent) {
          console.warn('Payment status check network error:', err)
        }
      } finally {
        if (!silent) setIsCheckingStatus(false)
      }
    },
    []
  )

  // 3. Initialize or sync state when activeMaterial or selectedCourseId changes
  useEffect(() => {
    const mat = studyMaterials.find((m) => m.courseId === selectedCourseId) || studyMaterials[0]
    setActiveMaterial(mat)
    setViewPdfInline(false)

    // Check if there's an active or verified request in sessionStorage or URL query
    let reqId: string | null = null
    try {
      // Check verified request first
      const savedToken = sessionStorage.getItem(`ssk_verified_token_${mat.id}`)
      const savedReq = sessionStorage.getItem(`ssk_verified_req_${mat.id}`)
      if (savedReq && savedToken) {
        setActiveRequestId(savedReq)
        checkServerPaymentStatus(savedReq, true)
        return
      }

      // Check pending request
      const pendingReq = sessionStorage.getItem(`ssk_pending_req_${mat.id}`)
      if (pendingReq) {
        reqId = pendingReq
      }
    } catch {
      // silent
    }

    if (reqId) {
      setActiveRequestId(reqId)
      checkServerPaymentStatus(reqId, true)
    } else {
      // Strictly LOCKED by default
      setIsUnlocked(false)
      setPaymentToken(null)
      setPaymentStatus('locked')
      setErrorMessage(null)
    }
  }, [selectedCourseId, checkServerPaymentStatus])

  // 4. Polling effect when payment is pending
  useEffect(() => {
    if (paymentStatus === 'pending' && activeRequestId) {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current)
      pollingTimerRef.current = setInterval(() => {
        checkServerPaymentStatus(activeRequestId, true)
      }, 5000)

      return () => {
        if (pollingTimerRef.current) {
          clearInterval(pollingTimerRef.current)
          pollingTimerRef.current = null
        }
      }
    }
  }, [paymentStatus, activeRequestId, checkServerPaymentStatus])

  // 5. Handle Student Click: "Pay ₹1 to Unlock PDF"
  async function handlePayButtonClick() {
    setIsInitiating(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: activeMaterial.id,
          courseId: selectedCourseId,
        }),
      })

      const data = await res.json()
      if (!data.success || !data.requestId) {
        throw new Error(data.error || 'Failed to initiate payment')
      }

      setActiveRequestId(data.requestId)
      setPaymentStatus('pending')
      setIsUnlocked(false)

      try {
        sessionStorage.setItem(`ssk_pending_req_${activeMaterial.id}`, data.requestId)
      } catch {
        // silent
      }

      // Direct redirection to the exact Razorpay link: https://razorpay.me/@sskcoaching
      // We open it in a new window/tab so the student's status-waiting page remains open!
      const paymentUrl = data.paymentUrl || razorpayConfig.paymentProfileUrl
      window.open(paymentUrl, '_blank', 'noopener,noreferrer')
    } catch (err: any) {
      setPaymentStatus('failed')
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.')
    } finally {
      setIsInitiating(false)
    }
  }

  // 6. Handle Reset / Retry Payment
  function handleResetPayment() {
    if (activeMaterial.id) {
      try {
        sessionStorage.removeItem(`ssk_pending_req_${activeMaterial.id}`)
        sessionStorage.removeItem(`ssk_verified_req_${activeMaterial.id}`)
        sessionStorage.removeItem(`ssk_verified_token_${activeMaterial.id}`)
      } catch {
        // silent
      }
    }
    setActiveRequestId(null)
    setPaymentToken(null)
    setIsUnlocked(false)
    setPaymentStatus('locked')
    setErrorMessage(null)
    setViewPdfInline(false)
  }

  // 7. Secure PDF Download handler
  function handleDownloadPdf() {
    if (!paymentToken) return
    window.location.href = `/api/material/download?id=${activeMaterial.id}&token=${encodeURIComponent(paymentToken)}`
  }

  // 8. Owner Authentication & Actions
  async function handleOwnerLogin(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!ownerPin.trim()) return

    setOwnerLoading(true)
    setOwnerActionMsg(null)

    try {
      const res = await fetch('/api/owner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'list',
          ownerPin: ownerPin.trim(),
        }),
      })

      const data = await res.json()
      if (data.success) {
        setOwnerAuthenticated(true)
        setOwnerRequests(data.requests || [])
      } else {
        setOwnerActionMsg(data.error || 'Invalid Owner PIN')
      }
    } catch {
      setOwnerActionMsg('Network error connecting to owner verification service')
    } finally {
      setOwnerLoading(false)
    }
  }

  async function handleOwnerApprove(requestId: string) {
    setOwnerLoading(true)
    setOwnerActionMsg(null)
    const razorpayPaymentId = customPaymentId[requestId] || ''

    try {
      const res = await fetch('/api/owner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          ownerPin: ownerPin.trim(),
          requestId,
          razorpayPaymentId,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setOwnerActionMsg(`Request ${requestId} approved successfully!`)
        // Refresh list
        handleOwnerLogin()
        // If this was the current active request on the student view, update it immediately
        if (requestId === activeRequestId) {
          checkServerPaymentStatus(requestId, false)
        }
      } else {
        setOwnerActionMsg(data.error || 'Could not approve request')
      }
    } catch {
      setOwnerActionMsg('Network error approving request')
    } finally {
      setOwnerLoading(false)
    }
  }

  async function handleOwnerReject(requestId: string) {
    setOwnerLoading(true)
    setOwnerActionMsg(null)

    try {
      const res = await fetch('/api/owner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          ownerPin: ownerPin.trim(),
          requestId,
          reason: 'Transaction not found in Razorpay records',
        }),
      })

      const data = await res.json()
      if (data.success) {
        setOwnerActionMsg(`Request ${requestId} marked as failed.`)
        handleOwnerLogin()
        if (requestId === activeRequestId) {
          checkServerPaymentStatus(requestId, false)
        }
      } else {
        setOwnerActionMsg(data.error || 'Could not reject request')
      }
    } catch {
      setOwnerActionMsg('Network error rejecting request')
    } finally {
      setOwnerLoading(false)
    }
  }

  const courseTabs = [
    { id: 'physical', label: 'Physical Chemistry' },
    { id: 'organic', label: 'Organic Chemistry' },
    { id: 'inorganic', label: 'Inorganic Chemistry' },
    { id: 'complete', label: 'Complete Course' },
  ]

  return (
    <section id="study-material" className="relative border-t border-[#DED5C5] bg-[#FAF5EC] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBE3D5] border border-[#DED5C5] px-3.5 py-1 text-xs font-bold text-[#12372A] uppercase tracking-wider shadow-xs">
            <BookOpen className="size-3.5 text-[#12372A]" />
            <span>OFFICIAL STUDY MATERIAL & NOTES</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#12372A]">
            {courseTitle ? `${courseTitle} Study Material` : 'Course Notes & Chapter PDFs'}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#68675D]">
            Access high-yield classroom notes, step-by-step derivations, and board-ready formulas. Unlock full PDFs instantly.
          </p>
        </div>

        {/* Course Filter Tabs (rendered when not on dedicated single-course page) */}
        {!hideCourseTabs && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {courseTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectCourse && onSelectCourse(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  selectedCourseId === tab.id
                    ? 'bg-[#12372A] text-[#FAF5EC] shadow-sm'
                    : 'bg-[#FFFDF8] text-[#12372A] border border-[#DED5C5] hover:bg-[#F7F2E8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Main PDF Study Material Showcase Card */}
        <div className="mt-8 rounded-3xl border border-[#DED5C5] bg-[#FFFDF8] p-6 sm:p-9 shadow-[0_12px_40px_rgba(18,55,42,0.06)]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1.3fr] lg:gap-12 items-start">
            {/* Left Column: Material Info & Details */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#E8F0FE] border border-[#C7D9FA] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2C4F9E]">
                  {activeMaterial.subject}
                </span>
                <span className="rounded-full bg-[#FDF6E2] border border-[#E8A33D]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#12372A]">
                  {activeMaterial.badge}
                </span>
              </div>

              <h3 className="mt-3 text-xl sm:text-2xl font-extrabold text-[#12372A] tracking-tight">
                {activeMaterial.title}
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                {activeMaterial.description}
              </p>

              {/* Document Meta Chips */}
              <div className="mt-5 grid grid-cols-3 gap-2.5 border-y border-[#DED5C5]/70 py-3.5 text-center text-xs">
                <div className="rounded-xl bg-[#F7F2E8] p-2">
                  <span className="text-[10px] text-[#68675D] block font-medium">Pages</span>
                  <span className="font-bold text-[#12372A]">{activeMaterial.pageCount} Pages</span>
                </div>
                <div className="rounded-xl bg-[#F7F2E8] p-2">
                  <span className="text-[10px] text-[#68675D] block font-medium">Format</span>
                  <span className="font-bold text-[#12372A]">Verified PDF</span>
                </div>
                <div className="rounded-xl bg-[#F7F2E8] p-2">
                  <span className="text-[10px] text-[#68675D] block font-medium">Demonstration</span>
                  <span className="font-bold text-[#12372A]">₹{activeMaterial.demoPrice} Only</span>
                </div>
              </div>

              {/* Topics Covered In This Chapter */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#12372A]">
                  Key Syllabus Topics Included
                </h4>
                <ul className="mt-3 space-y-2">
                  {activeMaterial.topics.slice(0, 5).map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#12372A] font-medium">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & Current Status Card */}
              <div className="mt-6 rounded-2xl border border-[#DED5C5] bg-[#F7F2E8] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#68675D] block">Current Demonstration Fee</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-[#12372A]">₹{activeMaterial.demoPrice}</span>
                      <span className="text-xs text-[#68675D] line-through">₹{activeMaterial.standardPrice}</span>
                      <span className="rounded-md bg-[#E8A33D]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#12372A]">
                        99% OFF DEMO
                      </span>
                    </div>
                  </div>

                  {/* Status Pill Badge */}
                  <div>
                    {paymentStatus === 'verified' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        <span>Unlocked</span>
                      </span>
                    )}

                    {paymentStatus === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-800">
                        <Clock className="size-3.5 text-amber-600 animate-spin" />
                        <span>Verification Pending</span>
                      </span>
                    )}

                    {(paymentStatus === 'locked' || paymentStatus === 'failed') && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700">
                        <Lock className="size-3.5 text-slate-500" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Owner Verification Link */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#68675D] px-1">
                <span>SSK Coaching Payment Protection</span>
                <button
                  onClick={() => setShowOwnerModal(true)}
                  className="inline-flex items-center gap-1 text-[#12372A] font-semibold hover:underline"
                >
                  <KeyRound className="size-3 text-[#12372A]" />
                  <span>Owner Verification Portal</span>
                </button>
              </div>
            </div>

            {/* Right Column: Professional PDF Preview & Action Area */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#DED5C5] bg-white p-5 sm:p-7 shadow-sm">
              <div>
                <div className="flex items-center justify-between border-b border-[#DED5C5]/70 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="size-5 text-[#12372A]" />
                    <span className="font-bold text-sm text-[#12372A]">{activeMaterial.fileName}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#68675D]">PDF Preview Interface</span>
                </div>

                {/* ---------------- STATE 1: LOCKED ---------------- */}
                {paymentStatus === 'locked' && (
                  <div className="mt-5 relative overflow-hidden rounded-2xl border-2 border-dashed border-[#DED5C5] bg-[#FAF5EC]/70 p-6 sm:p-8 text-center">
                    <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#12372A] text-[#FAF5EC] shadow-md">
                      <Lock className="size-8 text-[#E8A33D]" />
                    </div>

                    <h4 className="mt-4 text-lg font-bold text-[#12372A]">
                      PDF Material Locked
                    </h4>
                    <p className="mt-1.5 text-xs text-[#68675D] max-w-sm mx-auto leading-relaxed">
                      Your study material is locked. Complete the ₹1 payment to access this PDF.
                    </p>

                    {/* Preview Page Snippets */}
                    <div className="mt-5 space-y-2 text-left bg-white/80 rounded-xl p-3.5 border border-[#DED5C5]/60 text-xs">
                      {activeMaterial.previewHighlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 text-[#4A5568]">
                          <Sparkles className="size-3.5 text-[#E8A33D] shrink-0 mt-0.5" />
                          <span><strong>{hl.title}:</strong> {hl.detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Prominent Payment Button */}
                    <div className="mt-6 flex flex-col items-center gap-2">
                      <button
                        onClick={handlePayButtonClick}
                        disabled={isInitiating}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] py-3.5 px-6 text-sm font-bold uppercase tracking-wider text-[#FAF5EC] shadow-md transition-all hover:shadow-lg active:scale-98 disabled:opacity-75"
                      >
                        {isInitiating ? (
                          <>
                            <RefreshCw className="size-4 animate-spin" />
                            <span>Connecting to Razorpay...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="size-4 text-[#E8A33D]" />
                            <span>Pay ₹{activeMaterial.demoPrice} to Unlock PDF</span>
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#68675D]">
                        <ShieldCheck className="size-3.5 text-emerald-600" />
                        <span>Redirects to Razorpay: razorpay.me/@sskcoaching</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STATE 2: PAYMENT PENDING ---------------- */}
                {paymentStatus === 'pending' && (
                  <div className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-6 sm:p-7 text-center">
                    <div className="mx-auto grid size-14 place-items-center rounded-full bg-amber-500 text-white shadow-md animate-pulse">
                      <Clock className="size-7" />
                    </div>

                    <h4 className="mt-3.5 text-base sm:text-lg font-bold text-amber-900">
                      Payment initiated. Waiting for confirmation.
                    </h4>
                    <p className="mt-1 text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                      Your payment request has been recorded. Please complete the ₹1 payment on Razorpay. The website owner confirms transactions before unlocking.
                    </p>

                    {activeRequestId && (
                      <div className="mt-3 inline-block rounded-lg bg-white/80 border border-amber-200 px-3 py-1 text-[11px] font-mono text-amber-900">
                        Request ID: <strong>{activeRequestId}</strong>
                      </div>
                    )}

                    <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2">
                      <button
                        onClick={() => activeRequestId && checkServerPaymentStatus(activeRequestId, false)}
                        disabled={isCheckingStatus}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition"
                      >
                        <RefreshCw className={`size-3.5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                        <span>{isCheckingStatus ? 'Checking...' : 'Check Status'}</span>
                      </button>

                      <a
                        href={razorpayConfig.paymentProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100/50 transition"
                      >
                        <span>Re-open Razorpay Link</span>
                        <ExternalLink className="size-3" />
                      </a>

                      <button
                        onClick={handleResetPayment}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>

                    <p className="mt-3 text-[11px] text-amber-700">
                      Auto-checking every 5 seconds. You do not need to enter any payment ID.
                    </p>
                  </div>
                )}

                {/* ---------------- STATE 3: PAYMENT FAILED ---------------- */}
                {paymentStatus === 'failed' && (
                  <div className="mt-5 rounded-2xl border-2 border-rose-200 bg-rose-50/70 p-6 text-center">
                    <div className="mx-auto grid size-14 place-items-center rounded-full bg-rose-600 text-white shadow-md">
                      <AlertCircle className="size-7" />
                    </div>

                    <h4 className="mt-3.5 text-base sm:text-lg font-bold text-rose-900">
                      Payment could not be confirmed. Please try again.
                    </h4>
                    <p className="mt-1 text-xs text-rose-700 max-w-md mx-auto leading-relaxed">
                      {errorMessage || 'The payment could not be verified against the Razorpay account. Access to this study material remains locked.'}
                    </p>

                    <div className="mt-5 flex justify-center gap-3">
                      <button
                        onClick={handleResetPayment}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition"
                      >
                        <RefreshCw className="size-3.5" />
                        <span>Retry Payment (₹1)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STATE 4: PAYMENT VERIFIED & UNLOCKED ---------------- */}
                {paymentStatus === 'verified' && isUnlocked && (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-5">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-11 place-items-center rounded-xl bg-emerald-600 text-white shadow-xs">
                            <Unlock className="size-5" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-emerald-950">
                              Payment Successful! Your study material is now unlocked.
                            </p>
                            <p className="text-xs text-emerald-800 font-medium">
                              {activeMaterial.title} • Verified Complete Access
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons: View PDF & Download PDF */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => setViewPdfInline(!viewPdfInline)}
                            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-[#12372A] bg-white px-4 py-2.5 text-xs font-bold text-[#12372A] hover:bg-[#F7F2E8] transition shadow-2xs"
                          >
                            <Eye className="size-3.5" />
                            <span>{viewPdfInline ? 'Hide Viewer' : 'View PDF'}</span>
                          </button>

                          <button
                            onClick={handleDownloadPdf}
                            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] px-4 py-2.5 text-xs font-bold text-[#FAF5EC] shadow-xs transition"
                          >
                            <Download className="size-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Embedded Inline Viewer (iframe) */}
                    {viewPdfInline && paymentToken && (
                      <div className="overflow-hidden rounded-2xl border border-[#DED5C5] bg-[#FAF5EC]">
                        <div className="flex items-center justify-between bg-[#12372A] px-4 py-2.5 text-white text-xs">
                          <span className="font-semibold">Interactive Document Viewer: {activeMaterial.title}</span>
                          <button
                            onClick={() =>
                              window.open(
                                `/api/material/view?id=${activeMaterial.id}&token=${encodeURIComponent(paymentToken)}`,
                                '_blank'
                              )
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E8A33D] hover:underline"
                          >
                            <span>Open In Fullscreen</span>
                            <ExternalLink className="size-3" />
                          </button>
                        </div>
                        <iframe
                          src={`/api/material/view?id=${activeMaterial.id}&token=${encodeURIComponent(paymentToken)}#toolbar=1`}
                          title={activeMaterial.title}
                          className="h-[480px] w-full border-0 bg-white"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- OWNER VERIFICATION MODAL ---------------- */}
      {showOwnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl border border-[#DED5C5] bg-[#FFFDF8] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DED5C5] pb-3.5">
              <div className="flex items-center gap-2 text-[#12372A]">
                <KeyRound className="size-5 text-[#12372A]" />
                <h3 className="font-bold text-base text-[#12372A]">Website Owner Payment Verification Portal</h3>
              </div>
              <button
                onClick={() => {
                  setShowOwnerModal(false)
                  setOwnerActionMsg(null)
                }}
                className="rounded-full p-1 text-[#68675D] hover:bg-[#F7F2E8] hover:text-[#12372A]"
              >
                <X className="size-5" />
              </button>
            </div>

            {!ownerAuthenticated ? (
              <form onSubmit={handleOwnerLogin} className="mt-5 space-y-4">
                <p className="text-xs text-[#68675D]">
                  This area is restricted to the website owner. Enter your owner access PIN to verify real Razorpay transactions.
                </p>
                <div>
                  <label className="block text-xs font-bold text-[#12372A] mb-1">Owner Access PIN:</label>
                  <input
                    type="password"
                    placeholder="Enter owner PIN (default: ssk_admin_2026)"
                    value={ownerPin}
                    onChange={(e) => setOwnerPin(e.target.value)}
                    className="w-full rounded-xl border border-[#DED5C5] bg-white p-2.5 text-xs text-[#12372A] outline-none focus:border-[#12372A]"
                  />
                </div>
                {ownerActionMsg && (
                  <p className="text-xs text-rose-600 font-semibold">{ownerActionMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={ownerLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] px-5 py-2.5 text-xs font-bold text-white transition disabled:opacity-50"
                >
                  {ownerLoading ? <RefreshCw className="size-3.5 animate-spin" /> : <KeyRound className="size-3.5" />}
                  <span>Sign In as Owner</span>
                </button>
              </form>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12372A]">
                    Recent Student Payment Requests ({ownerRequests.length})
                  </span>
                  <button
                    onClick={() => handleOwnerLogin()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#12372A] hover:underline"
                  >
                    <RefreshCw className="size-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                {ownerActionMsg && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-medium">
                    {ownerActionMsg}
                  </div>
                )}

                {ownerRequests.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#DED5C5] p-6 text-center text-xs text-[#68675D]">
                    No payment requests recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ownerRequests.map((req) => (
                      <div
                        key={req.requestId}
                        className="rounded-2xl border border-[#DED5C5] bg-[#FAF5EC] p-4 text-xs space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono font-bold text-[#12372A]">{req.requestId}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#68675D]">
                          <span className="font-semibold text-[#12372A]">{req.materialTitle}</span> • ₹{req.amount} •{' '}
                          {new Date(req.createdAt).toLocaleString()}
                        </div>

                        {req.status === 'pending' && (
                          <div className="pt-2 border-t border-[#DED5C5]/70 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              placeholder="Razorpay Payment ID (e.g. pay_...) (Optional)"
                              value={customPaymentId[req.requestId] || ''}
                              onChange={(e) =>
                                setCustomPaymentId({
                                  ...customPaymentId,
                                  [req.requestId]: e.target.value,
                                })
                              }
                              className="flex-1 rounded-lg border border-[#DED5C5] bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#12372A]"
                            />
                            <button
                              onClick={() => handleOwnerApprove(req.requestId)}
                              disabled={ownerLoading}
                              className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 text-xs transition"
                            >
                              <Check className="size-3" />
                              <span>Approve & Unlock</span>
                            </button>
                            <button
                              onClick={() => handleOwnerReject(req.requestId)}
                              disabled={ownerLoading}
                              className="inline-flex items-center justify-center gap-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold px-3 py-1.5 text-xs transition"
                            >
                              <X className="size-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}

                        {req.status === 'verified' && (
                          <div className="text-[11px] text-emerald-700 font-medium">
                            ✓ Verified by {req.verifiedBy || 'owner'} • Ref:{' '}
                            <span className="font-mono">{req.razorpayPaymentId || 'Recorded'}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
