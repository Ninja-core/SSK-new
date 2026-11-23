'use client'

import React, { useState } from 'react'
import { authService, AdminUser } from '@/services/authService'
import { useToast } from '../ToastContext'
import {
  UserCheck,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Camera,
  Lock,
} from 'lucide-react'

interface MyProfileViewProps {
  currentUser: AdminUser
  onProfileUpdated: (updatedUser: AdminUser) => void
}

export function MyProfileView({ currentUser, onProfileUpdated }: MyProfileViewProps) {
  const { success, error } = useToast()

  // Profile details state
  const [name, setName] = useState(currentUser.name)
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '')
  const [savingProfile, setSavingProfile] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      error('Name required', 'Please enter your full name.')
      return
    }

    setSavingProfile(true)
    try {
      const res = await authService.updateProfile(currentUser.userId, {
        name: name.trim(),
        avatar: avatarUrl,
      })

      if (res.success && res.user) {
        success('Profile updated', 'Your account details have been saved.')
        onProfileUpdated(res.user)
      } else {
        error('Update failed', res.error)
      }
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill all password fields.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }

    setSavingPassword(true)
    try {
      const res = await authService.changePassword(currentUser.userId, currentPassword, newPassword)

      if (res.success) {
        setPasswordSuccess('Password successfully changed! Your account is now secured.')
        success('Password changed', 'Your new password is now active.')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')

        // Fetch refreshed user object to clear isDefaultPassword flag
        const refreshed = authService.getCurrentUser()
        if (refreshed) {
          onProfileUpdated(refreshed)
        }
      } else {
        setPasswordError(res.error || 'Failed to change password.')
      }
    } finally {
      setSavingPassword(false)
    }
  }

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ]

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
          My Administrator Profile
        </h2>
        <p className="text-xs sm:text-sm text-[#6B7A70] mt-0.5">
          Manage your personal faculty display name, avatar, and account authentication credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* =========================================================== */}
        {/* CARD 1: PROFILE DETAILS                                     */}
        {/* =========================================================== */}
        <div className="admin-glass-card rounded-[28px] p-6 shadow-sm border border-white/80">
          <div className="flex items-center gap-2 pb-3.5 border-b border-[#E6DFCC]/60">
            <UserCheck className="size-5 text-[#E8A33D]" />
            <h3 className="text-sm font-black text-[#13321F] tracking-tight uppercase">
              Personal Information
            </h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
            {/* Avatar picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-2">
                Profile Avatar
              </label>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-[#13321F] text-[#E8A33D] font-bold text-xl flex items-center justify-center overflow-hidden border-2 border-[#E8A33D] shadow-md">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="size-full object-cover" />
                  ) : (
                    name.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#6B7A70] block">
                    Choose an avatar preset:
                  </span>
                  <div className="flex items-center gap-2">
                    {avatarPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        className={`size-8 rounded-full overflow-hidden border-2 transition ${
                          avatarUrl === preset ? 'border-[#13321F] scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`Preset ${idx + 1}`} className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Display Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-xs font-bold text-[#13321F]"
                required
              />
            </div>

            {/* User ID (read-only) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Admin User ID (Permanent)
              </label>
              <input
                type="text"
                value={currentUser.userId}
                disabled
                className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-[#F8F4EA]/80 font-mono text-xs font-bold text-[#6B7A70] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#6B7A70] mt-1 block font-medium">
                User IDs are permanent identifiers across audit logs.
              </span>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                Privilege Role
              </label>
              <div className="h-12 px-4 rounded-2xl bg-[#F8F4EA]/70 border border-[#E6DFCC]/80 flex items-center justify-between text-xs font-bold text-[#13321F]">
                <span>{currentUser.role}</span>
                <span className="text-[10px] uppercase tracking-wider font-black text-[#E8A33D] bg-[#13321F] px-2.5 py-1 rounded-full">
                  Full Access
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="admin-pill-btn px-6 py-2.5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] transition cursor-pointer disabled:opacity-50 shadow-md"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================== */}
        {/* CARD 2: CHANGE PASSWORD                                     */}
        {/* =========================================================== */}
        <div className="admin-glass-card rounded-[28px] p-6 shadow-sm border border-white/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E6DFCC]/60">
              <KeyRound className="size-5 text-[#E8A33D]" />
              <h3 className="text-sm font-black text-[#13321F] tracking-tight uppercase">
                Change Account Password
              </h3>
            </div>

            {/* Feedback messages */}
            {passwordError && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-2xl bg-[#EAF3EC] border border-emerald-200 text-[#1F5A3A] text-xs font-semibold">
                <CheckCircle2 className="size-4 shrink-0 text-[#2E9E6B]" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="admin-input w-full h-12 pl-4 pr-11 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7A70] hover:text-[#13321F] p-1"
                  >
                    {showCurrentPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  New Password (Min 6 chars)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="admin-input w-full h-12 pl-4 pr-11 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7A70] hover:text-[#13321F] p-1"
                  >
                    {showNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F]"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="admin-pill-btn w-full h-12 inline-flex items-center justify-center gap-2 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] transition cursor-pointer disabled:opacity-50 shadow-md"
                >
                  <Lock className="size-3.5 text-[#E8A33D]" />
                  <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="mt-5 p-3.5 rounded-2xl bg-[#FEF8EA] border border-[#F6E0B3] text-[11px] text-[#8A5D14] leading-relaxed">
            💡 <strong>Security Tip:</strong> Changing your default password immediately clears the warning banner across the dashboard.
          </div>
        </div>
      </div>
    </div>
  )
}
