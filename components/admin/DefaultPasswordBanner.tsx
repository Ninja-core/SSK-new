'use client'

import React from 'react'
import { ShieldAlert, ArrowRight } from 'lucide-react'

interface DefaultPasswordBannerProps {
  onGoToProfile: () => void
}

export function DefaultPasswordBanner({ onGoToProfile }: DefaultPasswordBannerProps) {
  return (
    <div className="mb-6 rounded-[22px] bg-[#FEF8EA]/90 border border-[#F6E0B3] p-3.5 sm:p-4 text-[#8A5D14] shadow-xs backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-[#E8A33D]/25 flex items-center justify-center shrink-0">
            <ShieldAlert className="size-4.5 text-[#C48A2C]" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#6D4708]">
              You are using the default password. Please change it.
            </p>
            <p className="text-[11px] text-[#8A5D14]/85">
              Secure your admin account by setting a unique private password in your profile.
            </p>
          </div>
        </div>

        <button
          onClick={onGoToProfile}
          className="admin-pill-btn h-9 px-4 rounded-full bg-[#E8A33D] text-[#13321F] text-xs font-black hover:bg-[#d8932e] shadow-2xs active:scale-95 transition shrink-0"
        >
          <span>Change Password</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
