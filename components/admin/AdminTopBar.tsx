'use client'

import React, { useState } from 'react'
import { AdminUser } from '@/services/authService'
import {
  Lock,
  ExternalLink,
  UploadCloud,
  RotateCcw,
  Menu,
  Check,
  Sparkles,
} from 'lucide-react'

interface AdminTopBarProps {
  currentUser: AdminUser
  pendingChangesCount: number
  onPublish: () => Promise<void>
  onRevert: () => Promise<void>
  onOpenMobileMenu: () => void
}

export function AdminTopBar({
  currentUser,
  pendingChangesCount,
  onPublish,
  onRevert,
  onOpenMobileMenu,
}: AdminTopBarProps) {
  const [publishing, setPublishing] = useState(false)
  const [reverting, setReverting] = useState(false)
  const [justPublished, setJustPublished] = useState(false)

  const handlePublishClick = async () => {
    setPublishing(true)
    try {
      await onPublish()
      setJustPublished(true)
      setTimeout(() => setJustPublished(false), 3000)
    } finally {
      setPublishing(false)
    }
  }

  const handleRevertClick = async () => {
    if (confirm('Are you sure you want to discard all unsaved draft changes and revert to the live version?')) {
      setReverting(true)
      try {
        await onRevert()
      } finally {
        setReverting(false)
      }
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-[#FFFDF7]/90 border-b border-[#E6DFCC] px-4 sm:px-8 py-3.5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-[#DED5C5] bg-[#F8F4EA] text-[#13321F] hover:bg-[#EBE3D5] transition cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="size-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#13321F] tracking-tight">
                Welcome back, {currentUser.name}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#13321F]/8 border border-[#13321F]/15 text-[#13321F] text-[10px] font-bold uppercase tracking-wider">
                <Lock className="size-2.5 text-[#E8A33D]" />
                Private: admin login only
              </span>
            </div>
            <p className="text-xs text-[#5B6A5F] mt-0.5 line-clamp-1">
              Edit anything on your website from here. Changes go live after you press Publish.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          {/* Revert Drafts Button (shown if changes pending) */}
          {pendingChangesCount > 0 && (
            <button
              onClick={handleRevertClick}
              disabled={reverting || publishing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-300 bg-rose-50/80 text-rose-800 text-xs font-semibold hover:bg-rose-100 transition cursor-pointer disabled:opacity-50"
              title="Discard draft edits and revert to published version"
            >
              <RotateCcw className={`size-3.5 ${reverting ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Discard Drafts</span>
            </button>
          )}

          {/* View Live Site Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#DED5C5] bg-[#FFFDF7] text-xs font-bold text-[#13321F] hover:bg-[#F8F4EA] hover:border-[#13321F]/30 transition shadow-2xs active:scale-95"
            title="Open public website in a new tab"
          >
            <ExternalLink className="size-3 text-[#5B6A5F]" />
            <span>View live site</span>
          </a>

          {/* Publish Changes Primary Button */}
          <button
            onClick={handlePublishClick}
            disabled={publishing}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-md transition active:scale-95 cursor-pointer ${
              justPublished
                ? 'bg-[#1F5A3A] text-white'
                : pendingChangesCount > 0
                ? 'bg-[#E8A33D] text-[#13321F] hover:bg-[#d6932e] shadow-[0_4px_16px_rgba(232,163,61,0.35)] animate-pulse'
                : 'bg-[#13321F] text-white hover:bg-[#1C4B3A]'
            }`}
          >
            {publishing ? (
              <>
                <div className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Publishing...</span>
              </>
            ) : justPublished ? (
              <>
                <Check className="size-4 text-emerald-300" />
                <span>Changes Live!</span>
              </>
            ) : (
              <>
                <UploadCloud className="size-4" />
                <span>Publish changes</span>
                {pendingChangesCount > 0 && (
                  <span className="size-5 rounded-full bg-[#13321F] text-[#E8A33D] text-[10px] font-black flex items-center justify-center">
                    {pendingChangesCount}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
