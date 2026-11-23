'use client'

import React from 'react'
import { AdminTab } from './AdminSidebar'
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
} from 'lucide-react'

interface AdminIconRailProps {
  currentTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  onLogout: () => void
  newEnquiriesCount: number
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function AdminIconRail({
  currentTab,
  onSelectTab,
  onLogout,
  newEnquiriesCount,
  mobileOpen = false,
  onCloseMobile,
}: AdminIconRailProps) {
  const railItems: Array<{
    id: AdminTab
    label: string
    icon: React.ComponentType<{ className?: string }>
    hasBadge?: boolean
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses & Prices', icon: BookOpen },
    { id: 'videos', label: 'Video Lectures', icon: Video },
    { id: 'documents', label: 'PDFs, Notes & DPPs', icon: FileText },
    { id: 'tests', label: 'Test Series', icon: FileCheck2 },
    { id: 'enquiries', label: 'Students & Enquiries', icon: Users },
    { id: 'website', label: 'Banners & Website Text', icon: Sliders },
    { id: 'accounts', label: 'Admin Accounts', icon: ShieldAlert },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
  ]

  return (
    <>
      {/* ============================================================= */}
      {/* DESKTOP: Static Forest Green Capsule Rail                     */}
      {/* Permanently expanded at a clean fixed width (~214px)          */}
      {/* No hover collapse/expand, no layout shift or jitter           */}
      {/* ============================================================= */}
      <aside
        className="hidden lg:flex fixed left-4 xl:left-5 top-20 bottom-6 z-40 w-[214px] rounded-[28px] bg-[#13321F] text-white flex-col justify-between py-5 px-3 border border-[#1F5A3A]/80 shadow-[0_16px_40px_rgba(19,50,31,0.28)]"
        aria-label="Admin Navigation Rail"
      >
        {/* Top: Mini Emblem & Title */}
        <div className="flex items-center gap-2.5 w-full pb-3 border-b border-white/10 overflow-hidden">
          <div className="size-9 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20 shrink-0">
            <img src="/image14.png" alt="SSK Logo" className="size-full object-contain" />
          </div>
          <div className="overflow-hidden min-w-0">
            <span className="block text-xs font-black text-white leading-tight truncate">SSK Professional</span>
            <span className="block text-[9px] font-bold uppercase tracking-wider text-[#E8A33D] truncate">
              Admin Console
            </span>
          </div>
        </div>

        {/* Middle: Navigation Items */}
        <div className="flex-1 flex flex-col justify-center gap-1 w-full py-3 overflow-y-auto overflow-x-hidden scrollbar-none">
          {railItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center h-10 rounded-2xl transition-all duration-150 cursor-pointer relative px-2 ${
                  isActive
                    ? 'bg-white/10 text-white shadow-xs'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
                aria-label={item.label}
              >
                {/* Fixed-width Icon container */}
                <div
                  className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 relative ${
                    isActive
                      ? 'bg-[#E8A33D] text-[#13321F] shadow-[0_4px_12px_rgba(232,163,61,0.35)] font-bold'
                      : 'text-white/80'
                  }`}
                >
                  <Icon className="size-4" />
                </div>

                {/* Permanent Feature Label */}
                <span
                  className={`ml-2.5 text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis text-left flex-1 min-w-0 ${
                    isActive ? 'text-[#E8A33D]' : 'text-white'
                  }`}
                >
                  {item.label}
                </span>

                {/* Badge if any */}
                {item.hasBadge && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#E8A33D] text-[#13321F] text-[9px] font-black shrink-0">
                    New
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Bottom: Sign Out */}
        <div className="pt-3 border-t border-white/10 w-full">
          <button
            onClick={onLogout}
            className="w-full flex items-center h-10 rounded-2xl text-rose-300 hover:text-white hover:bg-rose-900/40 transition-all duration-150 cursor-pointer px-2"
            aria-label="Log out"
          >
            <div className="size-8 rounded-xl flex items-center justify-center shrink-0">
              <LogOut className="size-4" />
            </div>
            <span className="ml-2.5 text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis text-left flex-1 min-w-0">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* ============================================================= */}
      {/* MOBILE: Navigation Drawer with Smooth Slide-in & Backdrop     */}
      {/* ============================================================= */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide-in Drawer */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#13321F] text-white flex flex-col justify-between p-5 shadow-2xl z-10 border-r border-[#1F5A3A] animate-in slide-in-from-left duration-300">
            <div>
              {/* Header with Logo, Name & Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
                    <img src="/image14.png" alt="SSK Logo" className="size-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white leading-tight">SSK Professional</h3>
                    <span className="text-[10px] font-bold text-[#E8A33D] uppercase tracking-wider block">
                      Admin Console
                    </span>
                  </div>
                </div>

                <button
                  onClick={onCloseMobile}
                  className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Navigation Items List with Feature Names */}
              <nav className="mt-5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                {railItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentTab === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id)
                        onCloseMobile?.()
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#E8A33D] text-[#13321F] shadow-sm font-extrabold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className={`size-4.5 ${isActive ? 'text-[#13321F]' : 'text-white/90'}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.hasBadge && (
                        <span
                          className={`size-2 rounded-full ${
                            isActive ? 'bg-[#13321F]' : 'bg-[#E8A33D]'
                          }`}
                        />
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Sign Out */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  onCloseMobile?.()
                  onLogout()
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-bold text-rose-300 hover:bg-rose-900/40 hover:text-white transition cursor-pointer"
              >
                <LogOut className="size-4.5" />
                <span>Sign Out of Console</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
