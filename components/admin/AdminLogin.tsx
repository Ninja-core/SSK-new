'use client'

import React, { useState } from 'react'
import { authService, AdminUser } from '@/services/authService'
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!userId.trim() || !password) {
      setErrorMessage('Please enter both User ID and Password.')
      return
    }

    setLoading(true)
    try {
      const res = await authService.login({
        userId,
        password,
        rememberMe,
      })

      if (res.success && res.user) {
        onLoginSuccess(res.user)
      } else {
        setErrorMessage(res.error || 'Incorrect ID or password.')
      }
    } catch {
      setErrorMessage('An unexpected error occurred during authentication. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background soft ambient blobs */}
      <div className="fixed -top-32 -left-32 size-96 rounded-full bg-[#EAF3EC] blur-3xl opacity-80 pointer-events-none" />
      <div className="fixed top-1/2 -right-32 size-96 rounded-full bg-[#E3EEF8] blur-3xl opacity-80 pointer-events-none" />
      <div className="fixed -bottom-32 left-1/3 size-96 rounded-full bg-[#F4E04D]/15 blur-3xl opacity-60 pointer-events-none" />

      {/* Main Glass Split Container (32px radius) */}
      <div className="w-full max-w-4xl admin-glass-container rounded-[32px] p-2.5 sm:p-3 shadow-2xl relative z-10 transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
          {/* ========================================================= */}
          {/* LEFT PANEL: Pastel Gradient Showcase                      */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 rounded-[26px] bg-gradient-to-br from-[#EAF3EC] via-[#F8F4EA] to-[#E3EEF8] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-white/70 shadow-xs">
            {/* Subtle decorative circles */}
            <div className="absolute -top-12 -right-12 size-44 rounded-full bg-white/40 blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-[#E8A33D]/10 blur-xl pointer-events-none" />

            <div className="relative z-10">
              {/* Logo block */}
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-[#13321F] p-2 shadow-sm flex items-center justify-center border border-[#1F5A3A]">
                  <img src="/image14.png" alt="SSK Logo" className="size-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#13321F] tracking-tight leading-tight">
                    SSK Professional
                  </h3>
                  <span className="text-[10px] font-bold text-[#6B7A70] uppercase tracking-wider block">
                    Coaching Classes &bull; Ramgarh
                  </span>
                </div>
              </div>

              {/* Tag & Heading */}
              <div className="mt-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white text-[#13321F] text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  <ShieldCheck className="size-3 text-[#E8A33D]" />
                  Owner & Admin Access
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-[#13321F] tracking-tight mt-3 leading-tight">
                  Centralized Coaching Management
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7A70] mt-2 leading-relaxed">
                  Private management console for courses, student enquiries, lecture uploads, and live website publishing.
                </p>
              </div>

              {/* Feature Highlights Pills */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#13321F] bg-white/60 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/70">
                  <CheckCircle2 className="size-3.5 text-[#2E9E6B] shrink-0" />
                  <span>Curriculum & Lecture Notes Management</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#13321F] bg-white/60 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/70">
                  <CheckCircle2 className="size-3.5 text-[#2E9E6B] shrink-0" />
                  <span>Real-Time Student Admission Inbox</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#13321F] bg-white/60 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/70">
                  <CheckCircle2 className="size-3.5 text-[#2E9E6B] shrink-0" />
                  <span>Instant Website Content Publishing</span>
                </div>
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="mt-8 pt-4 border-t border-[#13321F]/10 flex items-center justify-between text-[11px] text-[#6B7A70] relative z-10">
              <span>Authorized Faculty Only</span>
              <span className="font-semibold text-[#13321F]">SSK Cloud Console</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: Clean White Form Card                        */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 rounded-[26px] bg-white/95 backdrop-blur-md p-6 sm:p-8 lg:p-10 flex flex-col justify-between border border-white/90 shadow-xs">
            <div>
              {/* Form Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
                    Sign In
                  </h1>
                  <p className="text-xs text-[#6B7A70] mt-0.5">
                    Enter your administrative credentials to continue
                  </p>
                </div>
                <div className="size-10 rounded-full bg-[#EAF3EC] text-[#13321F] flex items-center justify-center">
                  <Lock className="size-4 text-[#13321F]" />
                </div>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-150">
                  <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* User ID Field */}
                <div>
                  <label
                    htmlFor="admin-userid"
                    className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5"
                  >
                    User ID
                  </label>
                  <input
                    id="admin-userid"
                    type="text"
                    autoComplete="username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your user ID"
                    disabled={loading}
                    className="w-full admin-input"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-bold uppercase tracking-wider text-[#13321F]"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      disabled={loading}
                      className="w-full admin-input pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7A70] hover:text-[#13321F] p-1 transition cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-4 rounded border-[#D8DFD9] text-[#13321F] focus:ring-[#13321F] accent-[#13321F]"
                    />
                    <span className="text-xs font-semibold text-[#6B7A70] hover:text-[#13321F] transition">
                      Remember me on this device
                    </span>
                  </label>
                </div>

                {/* Primary Pill Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-2 admin-pill-btn bg-[#13321F] text-white hover:bg-[#1C4B3A] shadow-[0_8px_20px_rgba(19,50,31,0.18)] focus:outline-none focus:ring-2 focus:ring-[#E8A33D] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Verifying credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Log in</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Footer Note */}
            <div className="mt-8 pt-4 border-t border-[#E6DFCC]/50 text-center text-[11px] text-[#6B7A70]">
              SSK Coaching Classes &bull; Near Post Office, Ramgarh, J&K
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
