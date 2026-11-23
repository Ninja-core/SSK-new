'use client'

import React, { useState } from 'react'
import { dataService, WebsiteContent, BannerItem } from '@/services/dataService'
import { useToast } from '../ToastContext'
import {
  Sliders,
  Sparkles,
  Phone,
  MapPin,
  Mail,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  RotateCcw,
  UploadCloud,
  Image as ImageIcon,
  X,
} from 'lucide-react'

interface WebsiteContentViewProps {
  onPublish: () => Promise<void>
  onRevert: () => Promise<void>
  pendingChangesCount: number
}

export function WebsiteContentView({
  onPublish,
  onRevert,
  pendingChangesCount,
}: WebsiteContentViewProps) {
  const { success } = useToast()

  // Read current draft content
  const content = dataService.getWebsiteContent(true)
  const banners = dataService.getBanners(true)

  // Local working state
  const [headline, setHeadline] = useState(content.heroHeadline)
  const [subheadline, setSubheadline] = useState(content.heroSubheadline)
  const [announcementTag, setAnnouncementTag] = useState(content.announcementTag)
  const [showAnnouncement, setShowAnnouncement] = useState(content.showAnnouncement)
  const [phonePrimary, setPhonePrimary] = useState(content.phonePrimary)
  const [phoneSecondary, setPhoneSecondary] = useState(content.phoneSecondary)
  const [address, setAddress] = useState(content.address)
  const [email, setEmail] = useState(content.email)
  const [whatsappNumber, setWhatsappNumber] = useState(content.whatsappNumber)

  // Banner editing
  const [newBannerTitle, setNewBannerTitle] = useState('')
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('')
  const [newBannerBadge, setNewBannerBadge] = useState('ANNOUNCEMENT')
  const [newBannerLinkText, setNewBannerLinkText] = useState('Explore Courses')
  const [newBannerLinkHref, setNewBannerLinkHref] = useState('#courses')
  const [bannerModalOpen, setBannerModalOpen] = useState(false)

  const handleSaveTextChanges = async () => {
    await dataService.updateWebsiteContent({
      heroHeadline: headline.trim(),
      heroSubheadline: subheadline.trim(),
      announcementTag: announcementTag.trim(),
      showAnnouncement,
      phonePrimary: phonePrimary.trim(),
      phoneSecondary: phoneSecondary.trim(),
      address: address.trim(),
      email: email.trim(),
      whatsappNumber: whatsappNumber.trim(),
    })
    success('Saved to draft', 'Website text changes saved. Click Publish Changes to go live.')
  }

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBannerTitle.trim()) return

    await dataService.saveBanner({
      id: `banner_${Date.now()}`,
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim(),
      badge: newBannerBadge.trim(),
      image: '/image1.png',
      linkText: newBannerLinkText.trim() || 'Learn More',
      linkHref: newBannerLinkHref.trim() || '#enquire',
      active: true,
      order: banners.length + 1,
    })

    setNewBannerTitle('')
    setNewBannerSubtitle('')
    setBannerModalOpen(false)
    success('Banner added', 'New banner saved in drafts.')
  }

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Delete this banner from slider?')) {
      await dataService.deleteBanner(id)
      success('Banner deleted', 'Banner removed from draft carousel.')
    }
  }

  const handleMoveBanner = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= banners.length) return

    const reordered = [...banners]
    const temp = reordered[index]
    reordered[index] = reordered[targetIdx]
    reordered[targetIdx] = temp

    await dataService.reorderBanners(reordered.map((b) => b.id))
    success('Banners reordered', 'Slider order updated.')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#13321F] tracking-tight">
            Banners, Headlines & Contact Info
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7A70] mt-0.5">
            Edit anything on your live website without touching code. Changes stay in draft until published.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          {pendingChangesCount > 0 && (
            <button
              onClick={onRevert}
              className="admin-pill-btn inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-rose-300 bg-rose-50 text-xs font-bold text-rose-800 hover:bg-rose-100 transition cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Discard Drafts</span>
            </button>
          )}

          <button
            onClick={onPublish}
            className="admin-pill-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#13321F] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#1C4B3A] transition cursor-pointer active:scale-95"
          >
            <UploadCloud className="size-4 text-[#E8A33D]" />
            <span>Publish Changes Live ({pendingChangesCount})</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Editor (Left 7) & Live Preview (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================== */}
        {/* LEFT COLUMN: EDITORS                                        */}
        {/* =========================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Homepage Hero Section */}
          <div className="admin-glass-card rounded-[28px] p-6 shadow-sm border border-white/80">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E6DFCC]/60">
              <h3 className="text-base font-black text-[#13321F] tracking-tight">
                Homepage Hero Text
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#E3EEF8] text-[#2C4F9E]">
                ABOVE THE FOLD
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Admissions Open Tag */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#13321F]">
                    Announcement Tag Badge
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#13321F]">
                    <input
                      type="checkbox"
                      checked={showAnnouncement}
                      onChange={(e) => setShowAnnouncement(e.target.checked)}
                      className="size-4 rounded accent-[#13321F]"
                    />
                    <span>Show badge</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={announcementTag}
                  onChange={(e) => setAnnouncementTag(e.target.value)}
                  placeholder="e.g. Admissions Open 2026-27"
                  className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-xs font-semibold text-[#13321F]"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Main Hero Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="admin-input w-full h-12 px-4 rounded-2xl bg-white border border-[#E6DFCC] text-sm font-bold text-[#13321F]"
                />
              </div>

              {/* Subheadline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Hero Sub-Text Description
                </label>
                <textarea
                  rows={3}
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F] focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20 resize-none leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveTextChanges}
                className="admin-pill-btn px-5 py-2.5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] transition cursor-pointer shadow-sm"
              >
                Save Hero Draft
              </button>
            </div>
          </div>

          {/* Card 2: Banner Carousel Slider Manager */}
          <div className="admin-glass-card rounded-[28px] p-6 shadow-sm border border-white/80">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E6DFCC]/60">
              <div>
                <h3 className="text-base font-black text-[#13321F] tracking-tight">
                  Hero Banner Slider
                </h3>
                <p className="text-xs text-[#6B7A70] mt-0.5">
                  Add, delete or reorder rotating announcement banners
                </p>
              </div>

              <button
                onClick={() => setBannerModalOpen(true)}
                className="admin-pill-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] transition cursor-pointer"
              >
                <Plus className="size-3.5 text-[#E8A33D]" />
                <span>Add Banner</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {banners.map((b, idx) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 border border-[#E6DFCC]/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-2xl bg-[#13321F] text-[#E8A33D] flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                      #{b.order}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-[#8A5D14] uppercase tracking-wider block truncate">
                        {b.badge}
                      </span>
                      <h4 className="text-xs font-black text-[#13321F] truncate">
                        {b.title}
                      </h4>
                      <p className="text-[10px] text-[#6B7A70] truncate">
                        {b.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveBanner(idx, 'up')}
                      disabled={idx === 0}
                      className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveBanner(idx, 'down')}
                      disabled={idx === banners.length - 1}
                      className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA] disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="size-8 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete banner"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Contact Details & Social Links */}
          <div className="admin-glass-card rounded-[28px] p-6 shadow-sm border border-white/80">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E6DFCC]/60">
              <h3 className="text-base font-black text-[#13321F] tracking-tight">
                Institute Contact & Location
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EAF3EC] text-[#1F5A3A]">
                RAMGARH, J&K
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Primary Telephone
                  </label>
                  <input
                    type="text"
                    value={phonePrimary}
                    onChange={(e) => setPhonePrimary(e.target.value)}
                    className="admin-input w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Secondary Telephone
                  </label>
                  <input
                    type="text"
                    value={phoneSecondary}
                    onChange={(e) => setPhoneSecondary(e.target.value)}
                    className="admin-input w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Official Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="admin-input w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#13321F] mb-1">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-input w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveTextChanges}
                className="admin-pill-btn mt-2 px-5 py-2.5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A] transition cursor-pointer shadow-sm"
              >
                Save Contact Draft
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* RIGHT COLUMN: LIVE PREVIEW PANEL                            */}
        {/* =========================================================== */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 admin-glass-card rounded-[28px] p-5 shadow-md border border-white/80">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DFCC]/60">
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-[#E8A33D]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#13321F]">
                  Live Website Preview
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF3EC] text-[#1F5A3A]">
                Draft State
              </span>
            </div>

            {/* Simulated Public Site Preview Canvas */}
            <div className="mt-4 rounded-2xl bg-[#FAF5EC] border border-[#DED5C5] p-5 text-[#12372A] shadow-inner">
              {showAnnouncement && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#DED5C5] text-[10px] font-bold uppercase tracking-wider text-[#12372A] shadow-2xs mb-3">
                  <Sparkles className="size-3 text-[#E8A33D]" />
                  <span>{announcementTag || 'Admissions Open'}</span>
                </div>
              )}

              <h2 className="text-lg font-black tracking-tight text-[#12372A] leading-tight">
                {headline || 'Master Chemistry. Build Your Future.'}
              </h2>

              <p className="text-xs text-[#68675D] mt-2 leading-relaxed">
                {subheadline ||
                  '1:1 conceptual derivations, worked board numericals, and comprehensive NEET foundation in Ramgarh.'}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-full bg-[#12372A] text-white text-[11px] font-bold shadow-xs">
                  Enquire for Demo
                </div>
                <div className="px-3 py-1.5 rounded-full border border-[#DED5C5] bg-[#FFFDF8] text-[11px] font-bold text-[#12372A]">
                  Explore Courses
                </div>
              </div>

              {/* Sample rotating banner preview */}
              {banners.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#DED5C5]/60">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#8A5D14] block mb-1.5">
                    Banner Slide #1
                  </span>
                  <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#DED5C5]">
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#E8A33D]/20 text-[#8A5D14]">
                      {banners[0].badge}
                    </span>
                    <h5 className="text-xs font-bold text-[#12372A] mt-1">
                      {banners[0].title}
                    </h5>
                    <p className="text-[10px] text-[#68675D] mt-0.5">
                      {banners[0].subtitle}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact info snippet */}
              <div className="mt-4 pt-3 border-t border-[#DED5C5]/60 flex items-center justify-between text-[10px] text-[#68675D]">
                <span>📞 {phonePrimary}</span>
                <span>📍 {address}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#6B7A70] text-center mt-3 font-medium">
              This preview matches what visitors see on the public landing page.
            </p>
          </div>
        </div>
      </div>

      {/* Add Banner Modal */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-md admin-glass-container bg-white/95 border border-white/80 rounded-[32px] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DFCC]/60 mb-4">
              <h3 className="text-lg font-black text-[#13321F]">
                Add New Carousel Banner
              </h3>
              <button
                onClick={() => setBannerModalOpen(false)}
                className="size-8 rounded-full flex items-center justify-center text-[#6B7A70] hover:text-[#13321F] hover:bg-[#F8F4EA]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Banner Badge Tag
                </label>
                <input
                  type="text"
                  value={newBannerBadge}
                  onChange={(e) => setNewBannerBadge(e.target.value)}
                  placeholder="e.g. ADMISSIONS OPEN, NEW BATCH"
                  className="admin-input w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-semibold text-[#13321F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Banner Title *
                </label>
                <input
                  type="text"
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  placeholder="e.g. Sunday 1:1 Doubt Resolution Sessions"
                  className="admin-input w-full h-11 px-3.5 rounded-xl border border-[#E6DFCC] bg-white text-xs font-bold text-[#13321F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#13321F] mb-1.5">
                  Banner Subtitle
                </label>
                <textarea
                  rows={2}
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  placeholder="Brief description for banner carousel..."
                  className="w-full p-3 rounded-xl border border-[#E6DFCC] bg-white text-xs font-medium text-[#13321F] resize-none focus:outline-none focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6DFCC]/60">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="admin-pill-btn px-5 py-2.5 rounded-full border border-[#DED5C5] text-xs font-bold text-[#6B7A70]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-pill-btn px-6 py-2.5 rounded-full bg-[#13321F] text-white text-xs font-bold hover:bg-[#1C4B3A]"
                >
                  Add Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
