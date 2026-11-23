'use client'

import React from 'react'
import { AdminUser } from '@/services/authService'
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileText,
  FileCheck2,
  Users,
  Sliders,
  ShieldAlert,
  UserCheck,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react'

export type AdminTab =
  | 'dashboard'
  | 'courses'
  | 'videos'
  | 'documents'
  | 'tests'
  | 'enquiries'
  | 'website'
  | 'accounts'
  | 'profile'

interface AdminSidebarProps {
  currentTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  currentUser: AdminUser
  onLogout: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
  enquiriesBadge?: number
  pendingChangesCount?: number
}

export function AdminSidebar({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  mobileOpen,
  onCloseMobile,
  enquiriesBadge = 0,
  pendingChangesCount = 0,
}: AdminSidebarProps) {
  const navItems: Array<{
    id: AdminTab
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string | number
    badgeColor?: string
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses & Prices', icon: BookOpen },
    { id: 'videos', label: 'Video Lectures', icon: Video },
    { id: 'documents', label: 'PDFs, Notes & DPPs', icon: FileText },
    { id: 'tests', label: 'Test Series', icon: FileCheck2 },
    {
      id: 'enquiries',
      label: 'Students & Enquiries',
      icon: Users,
      badge: enquiriesBadge > 0 ? enquiriesBadge : undefined,
      badgeColor: 'bg-[#E8A33D] text-[#13321F]',
    },
    {
      id: 'website',
      label: 'Banners & Website Text',
      icon: Sliders,
      badge: pendingChangesCount > 0 ? `${pendingChangesCount} unsaved` : undefined,
      badgeColor: 'bg-amber-400/20 text-amber-200 border border-amber-400/30',
    },
    { id: 'accounts', label: 'Admin Accounts', icon: ShieldAlert },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
  ]

  const handleNavClick = (tab: AdminTab) => {
    onSelectTab(tab)
    onCloseMobile()
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#13321F] text-[#FAF5EC] border-r border-[#1F5A3A]/60">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1F5A3A]/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white/10 p-1.5 border border-white/20 flex items-center justify-center shadow-xs">
            <img src="/image14.png" alt="SSK Logo" className="size-full object-contain" />
          </div>
          <div>
            <span className="block text-sm font-extrabold tracking-tight text-white leading-none">
              SSK Professional
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#E8A33D] text-[#13321F]">
                ADMIN
              </span>
              <span className="text-[10px] text-[#FAF5EC]/60 font-semibold tracking-wider uppercase">
                PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5" aria-label="Admin Navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#1F5A3A] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] font-bold border border-[#E8A33D]/30'
                  : 'text-[#FAF5EC]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`size-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#E8A33D]' : 'text-[#FAF5EC]/60'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-white/20 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom User Profile Card & Logout */}
      <div className="p-3 border-t border-[#1F5A3A]/70 bg-[#0E2617]/70">
        <button
          onClick={() => handleNavClick('profile')}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition text-left cursor-pointer group"
          title="Go to My Profile"
        >
          <div className="size-9 rounded-full bg-[#1F5A3A] border border-[#E8A33D]/40 flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold text-[#E8A33D]">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="size-full object-cover" />
            ) : (
              currentUser.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate group-hover:text-[#E8A33D] transition-colors">
                {currentUser.name}
              </span>
              <ChevronRight className="size-3 text-white/40 group-hover:text-white transition" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-semibold text-[#E8A33D] uppercase tracking-wider">
                {currentUser.role}
              </span>
              <span className="text-[10px] text-white/40">&bull;</span>
              <span className="text-[10px] text-white/50 truncate font-mono">
                {currentUser.userId}
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/30 transition border border-rose-800/30 cursor-pointer"
        >
          <LogOut className="size-3.5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar (256px) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-in Drawer with Backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
