'use client'

import React, { useState, useEffect } from 'react'
import { authService, AdminUser } from '@/services/authService'
import { dataService, LessonItem } from '@/services/dataService'
import { ToastProvider, useToast } from '@/components/admin/ToastContext'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminTab } from '@/components/admin/AdminSidebar'
import { AdminTopMenu } from '@/components/admin/AdminTopMenu'
import { AdminIconRail } from '@/components/admin/AdminIconRail'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { DefaultPasswordBanner } from '@/components/admin/DefaultPasswordBanner'
import { UploadModal } from '@/components/admin/UploadModal'

// Views
import { DashboardHomeView } from '@/components/admin/views/DashboardHomeView'
import { CoursesView } from '@/components/admin/views/CoursesView'
import { VideosView } from '@/components/admin/views/VideosView'
import { DocumentsView } from '@/components/admin/views/DocumentsView'
import { TestsView } from '@/components/admin/views/TestsView'
import { EnquiriesView } from '@/components/admin/views/EnquiriesView'
import { WebsiteContentView } from '@/components/admin/views/WebsiteContentView'
import { AdminAccountsView } from '@/components/admin/views/AdminAccountsView'
import { MyProfileView } from '@/components/admin/views/MyProfileView'

function AdminAppInner() {
  const { success, error, info } = useToast()

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Navigation state
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadModalType, setUploadModalType] = useState<'Video' | 'PDF' | 'Notes' | 'DPP' | 'PYQ'>('PDF')

  // Reactive data counts
  const [pendingChanges, setPendingChanges] = useState(0)
  const [dataVersion, setDataVersion] = useState(0)

  // Observe auth state
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Observe data state for pending changes
  useEffect(() => {
    const updateStats = () => {
      setPendingChanges(dataService.getPendingChangesCount())
      setDataVersion((v) => v + 1)
    }
    updateStats()
    const unsubscribe = dataService.subscribe(updateStats)
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await authService.logout()
    info('Logged out', 'You have been signed out of the administrative session.')
  }

  const handlePublishAll = async () => {
    try {
      const res = await dataService.publishChanges()
      if (res.success) {
        success('Website published live!', `${res.count} changes have been applied to the live site.`)
        setPendingChanges(0)
      }
    } catch {
      error('Publishing failed', 'An error occurred while publishing changes.')
    }
  }

  const handleRevertAll = async () => {
    try {
      const res = await dataService.revertChanges()
      if (res.success) {
        info('Changes reverted', 'Draft edits discarded. Live content restored.')
        setPendingChanges(0)
      }
    } catch {
      error('Reversion failed', 'An error occurred while reverting changes.')
    }
  }

  const handleOpenUpload = (type: 'Video' | 'PDF' | 'Notes' | 'DPP' | 'PYQ' = 'PDF') => {
    setUploadModalType(type)
    setUploadModalOpen(true)
  }

  const handleDeleteLesson = async (id: string) => {
    await dataService.deleteLesson(id)
    success('Lesson deleted', 'Item removed from lessons list.')
  }

  // 1. Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-2xl bg-[#13321F] p-2.5 flex items-center justify-center animate-pulse shadow-xl border border-[#1F5A3A]">
            <img src="/image14.png" alt="SSK" className="size-full object-contain" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#13321F]/70">
            Loading Admin Portal...
          </span>
        </div>
      </div>
    )
  }

  // 2. Unauthenticated: Render dedicated Login screen
  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setCurrentUser(user)
          success(`Welcome back, ${user.name}!`, 'Admin session initialized.')
        }}
      />
    )
  }

  // 3. Authenticated: Render Full-Width SaaS Admin Shell
  const newEnquiriesCount = dataService
    .getEnquiries()
    .filter((e) => e.status === 'New').length

  return (
    <div className="min-h-screen flex flex-col relative pb-20 lg:pb-10 pt-3">
      {/* Centred Pill-shaped Top Menu with full-width alignment matching main dashboard */}
      <AdminTopMenu
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        newEnquiriesCount={newEnquiriesCount}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* Interactive Green Sidebar (Hover-expand on desktop, full drawer on mobile) */}
      <AdminIconRail
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        newEnquiriesCount={newEnquiriesCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Glass Dashboard Container: Expands to 90–94% viewport width (max-w-[1800px]) */}
      <div className="flex-1 w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:pl-64 lg:pr-8 my-3 sm:my-5">
        <div className="admin-glass-container rounded-[32px] p-5 sm:p-7 lg:p-9 shadow-[0_20px_50px_rgba(19,50,31,0.06)] min-h-[calc(100vh-130px)] flex flex-col border border-white/80">
          {/* Page Header (Round back button + large bold title + 3 stat chips + action pill buttons) */}
          <AdminPageHeader
            currentTab={activeTab}
            onBack={() => setActiveTab('dashboard')}
            pendingChangesCount={pendingChanges}
            onPublish={handlePublishAll}
            onRevert={handleRevertAll}
          />

          {/* Default Password Reminder Banner (Spans full available content width) */}
          {currentUser.isDefaultPassword && (
            <DefaultPasswordBanner onGoToProfile={() => setActiveTab('profile')} />
          )}

          {/* View Router */}
          <main className="flex-1 w-full">
            {activeTab === 'dashboard' && (
              <DashboardHomeView
                currentUser={currentUser}
                onNavigateTab={setActiveTab}
                onOpenUpload={handleOpenUpload}
                onDeleteLesson={handleDeleteLesson}
              />
            )}

            {activeTab === 'courses' && <CoursesView />}

            {activeTab === 'videos' && (
              <VideosView onOpenUpload={() => handleOpenUpload('Video')} />
            )}

            {activeTab === 'documents' && (
              <DocumentsView onOpenUpload={handleOpenUpload} />
            )}

            {activeTab === 'tests' && <TestsView />}

            {activeTab === 'enquiries' && <EnquiriesView />}

            {activeTab === 'website' && (
              <WebsiteContentView
                onPublish={handlePublishAll}
                onRevert={handleRevertAll}
                pendingChangesCount={pendingChanges}
              />
            )}

            {activeTab === 'accounts' && (
              <AdminAccountsView currentUser={currentUser} />
            )}

            {activeTab === 'profile' && (
              <MyProfileView
                currentUser={currentUser}
                onProfileUpdated={(updated) => {
                  setCurrentUser(updated)
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        initialType={uploadModalType}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => {
          setPendingChanges(dataService.getPendingChangesCount())
        }}
      />
    </div>
  )
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminAppInner />
    </ToastProvider>
  )
}
