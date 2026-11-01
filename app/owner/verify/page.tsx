'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Check,
  X,
  ArrowLeft,
  ExternalLink,
  Lock,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { instituteConfig } from '@/lib/institute'

export default function OwnerVerifyPage() {
  const [ownerPin, setOwnerPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [paymentIds, setPaymentIds] = useState<Record<string, string>>({})

  async function fetchRequests(pinToUse?: string) {
    const pin = pinToUse || ownerPin
    if (!pin.trim()) return

    setLoading(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/owner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'list',
          ownerPin: pin.trim(),
        }),
      })

      const data = await res.json()
      if (data.success) {
        setAuthenticated(true)
        setRequests(data.requests || [])
      } else {
        setFeedback({ type: 'error', text: data.error || 'Invalid Owner PIN' })
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network connection failed' })
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(requestId: string) {
    setLoading(true)
    setFeedback(null)
    const razorpayPaymentId = paymentIds[requestId] || ''

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
        setFeedback({ type: 'success', text: `Payment request ${requestId} approved and unlocked!` })
        fetchRequests()
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to approve request' })
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error approving request' })
    } finally {
      setLoading(false)
    }
  }

  async function handleReject(requestId: string) {
    setLoading(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/owner/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          ownerPin: ownerPin.trim(),
          requestId,
          reason: 'Transaction not found or unconfirmed in Razorpay',
        }),
      })

      const data = await res.json()
      if (data.success) {
        setFeedback({ type: 'success', text: `Request ${requestId} marked as failed.` })
        fetchRequests()
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to reject request' })
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error rejecting request' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5EC] text-[#12372A] py-10 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DED5C5] pb-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#68675D] hover:text-[#12372A]">
              <ArrowLeft className="size-4" />
              <span>Back to Website</span>
            </Link>
            <span className="text-[#DED5C5]">|</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#12372A]" />
              <h1 className="text-base sm:text-lg font-extrabold text-[#12372A]">
                SSK Coaching Owner Verification Portal
              </h1>
            </div>
          </div>

          <a
            href="https://dashboard.razorpay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
          >
            <span>Open Razorpay Dashboard</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Instructions banner */}
        <div className="mt-6 rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-5 text-xs text-[#4A5568] leading-relaxed shadow-xs">
          <h2 className="font-bold text-sm text-[#12372A] mb-1">
            How to verify student payments:
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-[#68675D]">
            <li>Open your official Razorpay mobile app or web dashboard (where notifications for ₹1 payments arrive).</li>
            <li>Match the ₹1 incoming transaction with the pending request below.</li>
            <li>Click <strong>Approve &amp; Unlock</strong>. The student&apos;s PDF will immediately unlock on their screen.</li>
          </ol>
        </div>

        {/* Authentication Form */}
        {!authenticated ? (
          <div className="mt-6 max-w-md mx-auto rounded-3xl border border-[#DED5C5] bg-[#FFFDF8] p-6 sm:p-8 shadow-md">
            <div className="text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#12372A] text-white shadow-xs">
                <KeyRound className="size-6 text-[#E8A33D]" />
              </div>
              <h2 className="mt-3 text-lg font-bold text-[#12372A]">Owner Authentication</h2>
              <p className="mt-1 text-xs text-[#68675D]">
                Enter your Owner PIN to access and manage student unlock requests.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                fetchRequests()
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#12372A] mb-1">Owner PIN:</label>
                <input
                  type="password"
                  placeholder="Enter PIN (default: ssk_admin_2026)"
                  value={ownerPin}
                  onChange={(e) => setOwnerPin(e.target.value)}
                  className="w-full rounded-xl border border-[#DED5C5] bg-[#FAF5EC] p-3 text-sm text-[#12372A] outline-none focus:border-[#12372A]"
                />
              </div>

              {feedback && (
                <div
                  className={`rounded-xl p-3 text-xs font-semibold ${
                    feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#12372A] hover:bg-[#1C4B3A] py-3 text-xs sm:text-sm font-bold text-white transition disabled:opacity-50"
              >
                {loading ? <RefreshCw className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                <span>Unlock Owner Portal</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#12372A]">Student Payment Requests ({requests.length})</span>
                <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  Authenticated
                </span>
              </div>

              <button
                onClick={() => fetchRequests()}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DED5C5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#12372A] hover:bg-[#F7F2E8] transition"
              >
                <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh List</span>
              </button>
            </div>

            {feedback && (
              <div
                className={`rounded-xl p-3 text-xs font-semibold ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {feedback.text}
              </div>
            )}

            {requests.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DED5C5] bg-[#FFFDF8] p-12 text-center text-xs text-[#68675D]">
                <Clock className="mx-auto size-8 text-[#68675D]/50 mb-2" />
                <span>No student payment requests have been recorded yet. When a student clicks &quot;Pay ₹1&quot;, their request will appear here.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div
                    key={req.requestId}
                    className="rounded-2xl border border-[#DED5C5] bg-[#FFFDF8] p-5 shadow-xs transition hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DED5C5]/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs text-[#12372A] bg-[#F7F2E8] px-2 py-0.5 rounded border border-[#DED5C5]">
                          {req.requestId}
                        </span>
                        <span className="text-xs font-bold text-[#12372A]">{req.materialTitle}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#12372A]">₹{req.amount}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#68675D]">
                      <span>Initiated: {new Date(req.createdAt).toLocaleString()}</span>
                      {req.verifiedAt && (
                        <span className="text-emerald-700 font-medium">
                          Verified: {new Date(req.verifiedAt).toLocaleString()} via {req.verifiedBy}
                        </span>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="mt-4 pt-3 border-t border-[#DED5C5]/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          placeholder="Razorpay Payment ID (e.g. pay_...) (Optional)"
                          value={paymentIds[req.requestId] || ''}
                          onChange={(e) =>
                            setPaymentIds({
                              ...paymentIds,
                              [req.requestId]: e.target.value,
                            })
                          }
                          className="flex-1 rounded-xl border border-[#DED5C5] bg-[#FAF5EC] px-3 py-2 text-xs outline-none focus:border-[#12372A]"
                        />

                        <button
                          onClick={() => handleApprove(req.requestId)}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 text-xs transition shadow-xs"
                        >
                          <Check className="size-3.5" />
                          <span>Approve &amp; Unlock PDF</span>
                        </button>

                        <button
                          onClick={() => handleReject(req.requestId)}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold px-3 py-2 text-xs transition"
                        >
                          <X className="size-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {req.status === 'verified' && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 className="size-3.5" />
                        <span>PDF Access Unlocked • Razorpay Ref: {req.razorpayPaymentId || 'Recorded'}</span>
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
  )
}

