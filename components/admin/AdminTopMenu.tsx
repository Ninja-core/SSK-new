'use client'

import React, { useState, useRef, useEffect } from 'react'
import { AdminUser } from '@/services/authService'
import { AdminTab } from './AdminSidebar'
import {
  Bell,
  ChevronDown,
  LogOut,
  UserCheck,
  Shield,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  FileCheck2,
  Menu,
} from 'lucide-react'

interface AdminTopMenuProps {
  currentTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  currentUser: AdminUser
  onLogout: () => void
  newEnquiriesCount: number
  onOpenMobileMenu?: () => void
}

export function AdminTopMenu({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  newEnquiriesCount,
  onOpenMobileMenu,
}: AdminTopMenuProps) {
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false)
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAvatarDropdownOpen(false)
      }
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setContentDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isContentActive = currentTab === 'videos' || currentTab === 'documents' || currentTab === 'tests'

  return (
    <header className="sticky top-3 z-30 mx-auto w-full max-w-[1800px] px-3 sm:px-6 lg:pl-64 lg:pr-8">
      <div className="h-16 px-3.5 sm:px-6 rounded-full admin-glass-container flex items-center justify-between gap-2 sm:gap-4 shadow-[0_12px_32px_rgba(19,50,31,0.06)] border border-white/80">
        {/* Left: Mobile Menu Toggle + Brand Logo & Name */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Hamburger Button */}
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden size-10 rounded-full bg-white/80 border border-[#E6DFCC] flex items-center justify-center text-[#13321F] hover:bg-[#F8F4EA] transition shadow-2xs shrink-0 cursor-pointer active:scale-95"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="size-5" />
            </button>
          )}

          {/* Brand Logo & Name */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 text-left transition hover:opacity-90 shrink-0 cursor-pointer"
          >
            <div className="size-9 rounded-full bg-[#13321F] p-1.5 flex items-center justify-center border border-[#1F5A3A] shadow-xs shrink-0">
              <img src="/image14.png" alt="SSK Logo" className="size-full object-contain" />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block text-sm font-extrabold tracking-tight text-[#13321F]">
                SSK Professional
              </span>
              <span className="block text-[9px] font-bold text-[#6B7A70] uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </button>
        </div>

        {/* Middle: Centred Pill-shaped Nav Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F8F4EA]/80 p-1 rounded-full border border-[#E6DFCC]/60" aria-label="Main Tabs">
          {/* Overview */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-[#13321F] text-white shadow-xs'
                : 'text-[#13321F]/70 hover:text-[#13321F] hover:bg-white/50'
            }`}
          >
            Overview
          </button>

          {/* Courses */}
          <button
            onClick={() => onSelectTab('courses')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'courses'
                ? 'bg-[#13321F] text-white shadow-xs'
                : 'text-[#13321F]/70 hover:text-[#13321F] hover:bg-white/50'
            }`}
          >
            Courses
          </button>

          {/* Content Dropdown (Videos, PDFs, Tests) */}
          <div className="relative" ref={contentRef}>
            <button
              onClick={() => setContentDropdownOpen(!contentDropdownOpen)}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isContentActive
                  ? 'bg-[#13321F] text-white shadow-xs'
                  : 'text-[#13321F]/70 hover:text-[#13321F] hover:bg-white/50'
              }`}
            >
              <span>Content</span>
              <ChevronDown className="size-3 opacity-70" />
            </button>

            {contentDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-white border border-[#E6DFCC] shadow-xl p-1.5 animate-in fade-in slide-in-from-top-2 z-50">
                <button
                  onClick={() => {
                    onSelectTab('videos')
                    setContentDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    currentTab === 'videos' ? 'bg-[#F8F4EA] text-[#13321F] font-bold' : 'text-[#6B7A70] hover:bg-[#F8F4EA]'
                  }`}
                >
                  <Video className="size-3.5 text-[#4F7DF3]" />
                  <span>Video Lectures</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('documents')
                    setContentDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    currentTab === 'documents' ? 'bg-[#F8F4EA] text-[#13321F] font-bold' : 'text-[#6B7A70] hover:bg-[#F8F4EA]'
                  }`}
                >
                  <FileText className="size-3.5 text-[#2E9E6B]" />
                  <span>PDFs, Notes & DPPs</span>
                </button>

                <button
                  onClick={() => {
                    onSelectTab('tests')
                    setContentDropdownOpen(false)
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    currentTab === 'tests' ? 'bg-[#F8F4EA] text-[#13321F] font-bold' : 'text-[#6B7A70] hover:bg-[#F8F4EA]'
                  }`}
                >
                  <FileCheck2 className="size-3.5 text-[#E8A33D]" />
                  <span>Test Series</span>
                </button>
              </div>
            )}
          </div>

          {/* Enquiries */}
          <button
            onClick={() => onSelectTab('enquiries')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'enquiries'
                ? 'bg-[#13321F] text-white shadow-xs'
                : 'text-[#13321F]/70 hover:text-[#13321F] hover:bg-white/50'
            }`}
          >
            <span>Enquiries</span>
          </button>

          {/* Website */}
          <button
            onClick={() => onSelectTab('website')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'website'
                ? 'bg-[#13321F] text-white shadow-xs'
                : 'text-[#13321F]/70 hover:text-[#13321F] hover:bg-white/50'
            }`}
          >
            Website
          </button>

          {/* Accounts */}
          <button
            onClick={() => onSelectTab('accounts')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentTab === 'accounts'
                ? 'bg-[#13321F] text-white shadow-xs'
                : 'text-[#13321F]/70 hover:text-[#13321F] hover:bg-white/50'
            }`}
          >
            Accounts
          </button>
        </nav>

        {/* Right: Notification Bell & Owner Round Avatar Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Notification Bell */}
          <button
            onClick={() => onSelectTab('enquiries')}
            className="size-10 rounded-full bg-white border border-[#E6DFCC]/80 flex items-center justify-center text-[#13321F] hover:bg-[#F8F4EA] transition cursor-pointer relative shadow-2xs active:scale-95"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="size-4 text-[#13321F]" />
          </button>

          {/* Owner Round Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white border border-[#E6DFCC]/80 hover:bg-[#F8F4EA] transition shadow-2xs cursor-pointer active:scale-95"
            >
              <div className="size-8 rounded-full bg-[#13321F] text-[#E8A33D] font-bold text-xs flex items-center justify-center overflow-hidden border border-[#E8A33D]/40 shrink-0">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="size-full object-cover" />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#13321F] max-w-[90px] truncate">
                {currentUser.name}
              </span>
              <ChevronDown className="size-3 text-[#6B7A70]" />
            </button>

            {avatarDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-[#E6DFCC] shadow-xl p-2 animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-3 py-2 border-b border-[#E6DFCC]/60">
                  <p className="text-xs font-bold text-[#13321F] truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-[#6B7A70] uppercase tracking-wider font-semibold">
                    {currentUser.role} &bull; <span className="font-mono">{currentUser.userId}</span>
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectTab('profile')
                      setAvatarDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#13321F] hover:bg-[#F8F4EA] transition text-left cursor-pointer"
                  >
                    <UserCheck className="size-3.5 text-[#1F5A3A]" />
                    <span>My Profile & Password</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('accounts')
                      setAvatarDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#13321F] hover:bg-[#F8F4EA] transition text-left cursor-pointer"
                  >
                    <Shield className="size-3.5 text-[#E8A33D]" />
                    <span>Admin Accounts</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[#E6DFCC]/60">
                  <button
                    onClick={() => {
                      setAvatarDropdownOpen(false)
                      onLogout()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
