'use client'

import React, { useState, useEffect } from 'react'
import { authService, AdminUser } from '@/services/authService'
import { useToast } from '../ToastContext'
import {
  ShieldAlert,
  UserPlus,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Calendar,
  X,
  AlertCircle,
  Clock,
  Shield,
} from 'lucide-react'

interface AdminAccountsViewProps {
  currentUser: AdminUser
}

export function AdminAccountsView({ currentUser }: AdminAccountsViewProps) {
  const { success, error } = useToast()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  // Create form state
  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loadAdmins = async () => {
    const list = await authService.listAdmins()
    setAdmins(list)
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim() || !userId.trim() || !password) {
      setFormError('All fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify.')
      return
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }

    setCreating(true)
    try {
      const res = await authService.createAdmin({
        name: name.trim(),
        userId: userId.trim(),
        password,
      })

      if (res.success && res.user) {
        success('Account created', `Admin account "${res.user.userId}" has been created.`)
        setName('')
        setUserId('')
        setPassword('')
        setConfirmPassword('')
        setModalOpen(false)
        await loadAdmins()
      } else {
        setFormError(res.error || 'Failed to create account.')
      }
    } catch {
      setFormError('An error occurred during account creation.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (targetUser: AdminUser) => {
    if (targetUser.role === 'Owner' || targetUser.userId.toLowerCase() === 'sskadmin') {
      error('Action Prohibited', 'The primary Owner account cannot be deleted.')
      return
    }

    if (targetUser.userId.toLowerCase() === currentUser.userId.toLowerCase()) {
      error('Action Prohibited', 'You cannot delete your own logged-in account.')
      return
    }

    if (confirm(`Permanently remove admin access for "${targetUser.name}" (${targetUser.userId})?`)) {
      const res = await authService.deleteAdmin(targetUser.userId)
      if (res.success) {
        success('Account deleted', `Account "${targetUser.userId}" has been removed.`)
        await loadAdmins()
      } else {
        error('Deletion failed', res.error)
      }
    }
  }

  const handleToggleDisabled = async (targetUser: AdminUser) => {
    if (targetUser.role === 'Owner' || targetUser.userId.toLowerCase() === 'sskadmin') {
      error('Protected Account', 'The default Owner account cannot be disabled.')
      return
    }

    const nextState = !targetUser.disabled
    const res = await authService.toggleAdminStatus(targetUser.userId, nextState)
    if (res.success) {
      success(
        nextState ? 'Account deactivated' : 'Account activated',
        `Account "${targetUser.userId}" is now ${nextState ? 'disabled' : 'active'}.`
      )
      await loadAdmins()
    } else {
      error('Action failed', res.error)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
            Admin Accounts & Permissions
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A70] mt-0.5">
            Only authenticated faculty can provision new administrative credentials. Public sign-up is disabled.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null)
            setModalOpen(true)
          }}
          className="admin-pill-btn self-start sm:self-center h-11 px-5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] shadow-md transition cursor-pointer flex items-center gap-2"
        >
          <UserPlus className="size-4 text-[#E8A33D]" />
          <span>Create Admin Account</span>
        </button>
      </div>

      {/* Admin Accounts Table */}
      <div className="admin-glass-card rounded-[28px] overflow-hidden shadow-sm border border-white/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E6DFCC]/60 bg-[#F8F4EA]/50 text-[#6B7A70] uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-5">Admin Profile</th>
                <th className="py-3.5 px-5">User ID</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Created Date</th>
                <th className="py-3.5 px-5">Last Login</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFCC]/60 font-medium text-[#13321F]">
              {admins.map((admin) => {
                const isOwner = admin.role === 'Owner' || admin.userId.toLowerCase() === 'sskadmin'
                const isSelf = admin.userId.toLowerCase() === currentUser.userId.toLowerCase()

                return (
                  <tr key={admin.id} className="hover:bg-[#F8F4EA]/30 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-[#13321F] text-[#E8A33D] font-bold flex items-center justify-center overflow-hidden border border-[#E8A33D]/30 shrink-0 shadow-2xs">
                          {admin.avatar ? (
                            <img src={admin.avatar} alt={admin.name} className="size-full object-cover" />
                          ) : (
                            admin.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#13321F] flex items-center gap-1.5">
                            <span>{admin.name}</span>
                            {isSelf && (
                              <span className="text-[10px] font-black text-[#1F5A3A] bg-[#EAF3EC] px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          {admin.disabled && (
                            <span className="text-[10px] text-rose-600 font-bold">
                              Account Deactivated
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <code className="font-mono text-xs font-bold text-[#13321F] bg-white/70 px-2.5 py-1 rounded-xl border border-[#E6DFCC]/60">
                        {admin.userId}
                      </code>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          admin.role === 'Owner'
                            ? 'bg-[#13321F] text-[#E8A33D]'
                            : 'bg-[#F8F4EA] text-[#13321F] border border-[#DED5C5]'
                        }`}
                      >
                        <Shield className="size-2.5" />
                        {admin.role}
                      </span>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-[#6B7A70]">
                      <div className="flex items-center gap-1 font-medium">
                        <Calendar className="size-3 text-[#E8A33D]" />
                        <span>
                          {new Date(admin.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-[#6B7A70]">
                      {admin.lastLogin ? (
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                          <Clock className="size-3 text-[#1F5A3A]" />
                          <span>
                            {new Date(admin.lastLogin).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            at{' '}
                            {new Date(admin.lastLogin).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] italic text-[#6B7A70]">Never logged in</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      {isOwner ? (
                        <span className="text-[10px] font-bold text-[#6B7A70] italic">
                          Protected Owner
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleToggleDisabled(admin)}
                            className={`admin-pill-btn px-3 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                              admin.disabled
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            }`}
                          >
                            {admin.disabled ? 'Re-enable' : 'Disable'}
                          </button>

                          <button
                            onClick={() => handleDelete(admin)}
                            className="size-8 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete account"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Account Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-md admin-glass-container bg-white/95 border border-white/80 rounded-[32px] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E6DFCC]/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5 text-[#E8A33D]" />
                <h3 className="text-lg font-black text-[#13321F]">
                  Create New Admin Account
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA]"
              >
                <X className="size-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-xs font-bold text-[#13321F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  User ID (Must be unique) *
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="e.g. ramesh_ssk"
                  className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-mono font-bold text-[#13321F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="admin-input w-full h-12 pl-4 pr-11 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7A70] hover:text-[#13321F] p-1"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="admin-input w-full h-12 px-4 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6DFCC]/60">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-pill-btn px-5 py-2.5 rounded-full border border-[#DED5C5] text-xs font-bold text-[#6B7A70]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="admin-pill-btn px-6 py-2.5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] transition cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {creating ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
