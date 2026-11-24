// =======================================================================
// SSK PROFESSIONAL COACHING CLASSES - DATA SERVICE
// =======================================================================
// Centralized mock data layer powering both the Admin Dashboard and the
// public website. Implements a dual-state pattern:
// - `draftState`: Working copy edited by the admin in real-time
// - `publishedState`: Production copy served to the public site
// Pressing "Publish changes" synchronizes draftState -> publishedState.
//
// =======================================================================
// [FIREBASE FIRESTORE MIGRATION GUIDE]
// When ready to connect Cloud Firestore:
// 1. Initialize:
//    import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
//    const db = getFirestore()
//
// 2. Collections:
//    - `/settings/websiteContent`
//    - `/banners/{bannerId}`
//    - `/courses/{courseId}`
//    - `/lessons/{lessonId}`
//    - `/tests/{testId}`
//    - `/enquiries/{enquiryId}`
//    - `/students/{studentId}`
// =======================================================================

import {
  defaultWebsiteContentSeed,
  defaultBannersSeed,
  defaultCoursesSeed,
  defaultLessonsSeed,
  defaultTestsSeed,
  defaultEnquiriesSeed,
  defaultStudentsSeed,
  defaultDashboardStats,
  WebsiteContentSeed,
  BannerItemSeed,
  CourseSeed,
  LessonSeed,
  TestItemSeed,
  EnquirySeed,
  StudentSeed,
} from '@/lib/seedData'
import { storageService } from './storageService'

export type WebsiteContent = WebsiteContentSeed
export type BannerItem = BannerItemSeed
export type CourseItem = CourseSeed
export type LessonItem = LessonSeed
export type TestItem = TestItemSeed
export type EnquiryItem = EnquirySeed
export type StudentItem = StudentSeed

interface AppDataSchema {
  websiteContent: WebsiteContent
  banners: BannerItem[]
  courses: CourseItem[]
  lessons: LessonItem[]
  tests: TestItem[]
  enquiries: EnquiryItem[]
  students: StudentItem[]
  stats: typeof defaultDashboardStats
}

const STORAGE_KEY_PUBLISHED = 'ssk_published_data_v1'
const STORAGE_KEY_DRAFT = 'ssk_draft_data_v1'

class DataService {
  private publishedState: AppDataSchema
  private draftState: AppDataSchema
  private listeners: Array<() => void> = []

  constructor() {
    this.publishedState = this.getInitialSeedState()
    this.draftState = this.getInitialSeedState()
    this.loadFromStorage()
    if (this.isClient()) {
      setTimeout(() => this.syncWithCloudStorage(), 100)
    }
  }

  private isClient(): boolean {
    return typeof window !== 'undefined'
  }

  private getInitialSeedState(): AppDataSchema {
    return {
      websiteContent: { ...defaultWebsiteContentSeed },
      banners: JSON.parse(JSON.stringify(defaultBannersSeed)),
      courses: JSON.parse(JSON.stringify(defaultCoursesSeed)),
      lessons: JSON.parse(JSON.stringify(defaultLessonsSeed)),
      tests: JSON.parse(JSON.stringify(defaultTestsSeed)),
      enquiries: JSON.parse(JSON.stringify(defaultEnquiriesSeed)),
      students: JSON.parse(JSON.stringify(defaultStudentsSeed)),
      stats: { ...defaultDashboardStats },
    }
  }

  private loadFromStorage() {
    if (!this.isClient()) return
    try {
      const storedPublished = localStorage.getItem(STORAGE_KEY_PUBLISHED)
      if (storedPublished) {
        this.publishedState = JSON.parse(storedPublished)
        if (this.publishedState.enquiries) {
          let updated = false
          this.publishedState.enquiries.forEach((e) => {
            if (e.id === 'enq_101' && e.status === 'New') {
              e.status = 'Contacted'
              updated = true
            }
          })
          if (updated) {
            localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(this.publishedState))
          }
        }
      } else {
        localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(this.publishedState))
      }

      const storedDraft = localStorage.getItem(STORAGE_KEY_DRAFT)
      if (storedDraft) {
        this.draftState = JSON.parse(storedDraft)
        if (this.draftState.enquiries) {
          let updated = false
          this.draftState.enquiries.forEach((e) => {
            if (e.id === 'enq_101' && e.status === 'New') {
              e.status = 'Contacted'
              updated = true
            }
          })
          if (updated) {
            localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(this.draftState))
          }
        }
      } else {
        this.draftState = JSON.parse(JSON.stringify(this.publishedState))
        localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(this.draftState))
      }
    } catch (e) {
      console.warn('[dataService] Storage loading error:', e)
    }
  }

  private persistDraft() {
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(this.draftState))
      } catch (e) {
        console.warn('persistDraft error:', e)
      }
    }
    this.notifyListeners()
  }

  private persistPublished() {
    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY_PUBLISHED, JSON.stringify(this.publishedState))
      } catch (e) {
        console.warn('persistPublished error:', e)
      }
    }
    this.notifyListeners()
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => {
      try {
        cb()
      } catch (e) {
        console.error('[dataService] listener error:', e)
      }
    })
  }

  // ---------------------------------------------------------------------
  // DRAFT / PUBLISH PIPELINE
  // ---------------------------------------------------------------------
  // CONNECT FIRESTORE HERE:
  // In Firebase: Batch write draft changes to live documents
  // ---------------------------------------------------------------------
  public getPendingChangesCount(): number {
    let count = 0
    // Check website content diff
    if (JSON.stringify(this.draftState.websiteContent) !== JSON.stringify(this.publishedState.websiteContent)) {
      count += 1
    }
    // Check banners diff
    if (JSON.stringify(this.draftState.banners) !== JSON.stringify(this.publishedState.banners)) {
      count += Math.abs(this.draftState.banners.length - this.publishedState.banners.length) || 1
    }
    // Check courses diff
    if (JSON.stringify(this.draftState.courses) !== JSON.stringify(this.publishedState.courses)) {
      count += Math.abs(this.draftState.courses.length - this.publishedState.courses.length) || 1
    }
    // Check lessons diff
    if (JSON.stringify(this.draftState.lessons) !== JSON.stringify(this.publishedState.lessons)) {
      count += Math.abs(this.draftState.lessons.length - this.publishedState.lessons.length) || 1
    }
    // Check tests diff
    if (JSON.stringify(this.draftState.tests) !== JSON.stringify(this.publishedState.tests)) {
      count += Math.abs(this.draftState.tests.length - this.publishedState.tests.length) || 1
    }
    return count
  }

  public async publishChanges(): Promise<{ success: boolean; count: number }> {
    const changesCount = this.getPendingChangesCount()
    this.publishedState = JSON.parse(JSON.stringify(this.draftState))
    this.persistPublished()
    return { success: true, count: changesCount }
  }

  public async revertChanges(): Promise<{ success: boolean }> {
    this.draftState = JSON.parse(JSON.stringify(this.publishedState))
    this.persistDraft()
    return { success: true }
  }

  // ---------------------------------------------------------------------
  // WEBSITE CONTENT
  // ---------------------------------------------------------------------
  // CONNECT FIRESTORE HERE:
  // doc(db, 'settings', 'websiteContent')
  // ---------------------------------------------------------------------
  public getWebsiteContent(useDraft = false): WebsiteContent {
    return useDraft ? this.draftState.websiteContent : this.publishedState.websiteContent
  }

  public async updateWebsiteContent(partial: Partial<WebsiteContent>): Promise<WebsiteContent> {
    this.draftState.websiteContent = {
      ...this.draftState.websiteContent,
      ...partial,
    }
    this.persistDraft()
    return this.draftState.websiteContent
  }

  // ---------------------------------------------------------------------
  // BANNERS
  // ---------------------------------------------------------------------
  // CONNECT FIRESTORE HERE:
  // collection(db, 'banners')
  // ---------------------------------------------------------------------
  public getBanners(useDraft = false): BannerItem[] {
    const banners = useDraft ? this.draftState.banners : this.publishedState.banners
    return [...banners].sort((a, b) => a.order - b.order)
  }

  public async saveBanner(banner: BannerItem): Promise<BannerItem> {
    const list = this.draftState.banners
    const idx = list.findIndex((b) => b.id === banner.id)

    if (idx >= 0) {
      list[idx] = { ...banner }
    } else {
      const newBanner: BannerItem = {
        ...banner,
        id: banner.id || `banner_${Date.now()}`,
        order: list.length + 1,
      }
      list.push(newBanner)
    }

    this.persistDraft()
    return banner
  }

  public async deleteBanner(id: string): Promise<boolean> {
    this.draftState.banners = this.draftState.banners.filter((b) => b.id !== id)
    this.persistDraft()
    return true
  }

  public async reorderBanners(bannerIds: string[]): Promise<boolean> {
    const updated: BannerItem[] = []
    bannerIds.forEach((id, index) => {
      const match = this.draftState.banners.find((b) => b.id === id)
      if (match) {
        updated.push({ ...match, order: index + 1 })
      }
    })
    this.draftState.banners = updated
    this.persistDraft()
    return true
  }

  // ---------------------------------------------------------------------
  // COURSES & PRICES
  // ---------------------------------------------------------------------
  // CONNECT FIRESTORE HERE:
  // collection(db, 'courses')
  // ---------------------------------------------------------------------
  public getCourses(useDraft = false): CourseItem[] {
    return useDraft ? [...this.draftState.courses] : [...this.publishedState.courses]
  }

  public async saveCourse(course: CourseItem): Promise<CourseItem> {
    const list = this.draftState.courses
    const idx = list.findIndex((c) => c.id === course.id)

    if (idx >= 0) {
      list[idx] = { ...course }
    } else {
      const newCourse: CourseItem = {
        ...course,
        id: course.id || `course_${Date.now()}`,
      }
      list.push(newCourse)
    }

    this.persistDraft()
    return course
  }

  public async deleteCourse(id: string): Promise<boolean> {
    this.draftState.courses = this.draftState.courses.filter((c) => c.id !== id)
    this.persistDraft()
    return true
  }

  // ---------------------------------------------------------------------
  // LESSONS & UPLOADS (Videos, PDFs, Notes, DPPs, PYQs)
  // ---------------------------------------------------------------------
  // CONNECT FIRESTORE HERE:
  // collection(db, 'lessons')
  // ---------------------------------------------------------------------
  public getLessons(useDraft = false, filter?: { courseId?: string; type?: string; search?: string }): LessonItem[] {
    let lessons = useDraft ? [...this.draftState.lessons] : [...this.publishedState.lessons]

    if (filter) {
      if (filter.courseId && filter.courseId !== 'all') {
        lessons = lessons.filter((l) => l.courseId === filter.courseId)
      }
      if (filter.type && filter.type !== 'all') {
        lessons = lessons.filter((l) => l.type.toLowerCase() === filter.type?.toLowerCase())
      }
      if (filter.search && filter.search.trim()) {
        const q = filter.search.toLowerCase()
        lessons = lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.chapter.toLowerCase().includes(q) ||
            l.fileName.toLowerCase().includes(q)
        )
      }
    }

    return lessons.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  public async saveLesson(lesson: Partial<LessonItem>): Promise<LessonItem> {
    const list = this.draftState.lessons
    const id = lesson.id || `lesson_${Date.now()}`
    const idx = list.findIndex((l) => l.id === id)

    const fullLesson: LessonItem = {
      id,
      title: lesson.title || 'Untitled Lesson',
      courseId: lesson.courseId || 'physical',
      courseName: lesson.courseName || 'Physical Chemistry',
      chapter: lesson.chapter || 'General',
      type: lesson.type || 'PDF',
      description: lesson.description || '',
      fileUrl: lesson.fileUrl || '/sample-notes.pdf',
      fileName: lesson.fileName || 'document.pdf',
      fileSize: lesson.fileSize || '1.0 MB',
      duration: lesson.duration,
      pages: lesson.pages,
      enrolledOnly: lesson.enrolledOnly ?? true,
      allowDownload: lesson.allowDownload ?? true,
      status: lesson.status || 'live',
      uploadedAt: lesson.uploadedAt || new Date().toISOString(),
      downloadsCount: lesson.downloadsCount || 0,
      viewsCount: lesson.viewsCount || 0,
    }

    if (idx >= 0) {
      list[idx] = fullLesson
    } else {
      list.unshift(fullLesson)
    }

    this.persistDraft()
    return fullLesson
  }

  public async syncWithCloudStorage(): Promise<void> {
    if (!this.isClient()) return
    try {
      const materials = await storageService.listMaterials()
      if (materials && materials.length > 0) {
        let changed = false
        materials.forEach((m: any) => {
          const exists = this.draftState.lessons.some((l) => l.id === m.id)
          if (!exists) {
            this.draftState.lessons.unshift({
              id: m.id,
              title: m.title || m.originalFileName,
              courseId: m.subject ? m.subject.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'general',
              courseName: m.subject || 'Chemistry',
              chapter: m.chapter || 'General',
              type: (m.contentType as any) || 'PDF',
              description: m.description || '',
              fileUrl: `/api/admin/materials/${m.id}/preview`,
              fileName: m.originalFileName || 'document.pdf',
              fileSize: m.fileSizeFormatted || '1.0 MB',
              enrolledOnly: m.enrolledOnly ?? true,
              allowDownload: m.allowDownload ?? true,
              status: m.published ? 'live' : 'draft',
              uploadedAt: m.createdAt || new Date().toISOString(),
              downloadsCount: 0,
              viewsCount: 0,
            })
            changed = true
          }
        })
        if (changed) {
          this.persistDraft()
        }
      }
    } catch (e) {
      console.warn('[dataService] syncWithCloudStorage error:', e)
    }
  }

  public async deleteLesson(id: string): Promise<boolean> {
    this.draftState.lessons = this.draftState.lessons.filter((l) => l.id !== id)
    this.persistDraft()
    try {
      await storageService.deleteFile(id)
    } catch (e) {
      console.warn('[dataService] Notice deleting cloud storage file:', e)
    }
    return true
  }

  public async reorderLessons(lessonIds: string[]): Promise<boolean> {
    const list = this.draftState.lessons
    const map = new Map(list.map((l) => [l.id, l]))
    const reordered: LessonItem[] = []
    lessonIds.forEach((id) => {
      const match = map.get(id)
      if (match) reordered.push(match)
    })
    list.forEach((l) => {
      if (!lessonIds.includes(l.id)) reordered.push(l)
    })
    this.draftState.lessons = reordered
    this.persistDraft()
    return true
  }

  // ---------------------------------------------------------------------
  // TEST SERIES
  // ---------------------------------------------------------------------
  // CONNECT FIRESTORE HERE:
  // collection(db, 'tests')
  // ---------------------------------------------------------------------
  public getTests(useDraft = false): TestItem[] {
    return useDraft ? [...this.draftState.tests] : [...this.publishedState.tests]
  }

  public async saveTest(test: Partial<TestItem>): Promise<TestItem> {
    const list = this.draftState.tests
    const id = test.id || `test_${Date.now()}`
    const idx = list.findIndex((t) => t.id === id)

    const fullTest: TestItem = {
      id,
      title: test.title || 'Untitled Test',
      courseId: test.courseId || 'physical',
      courseName: test.courseName || 'Physical Chemistry',
      chapter: test.chapter || 'All Chapters',
      totalQuestions: test.totalQuestions || 30,
      totalMarks: test.totalMarks || 70,
      durationMinutes: test.durationMinutes || 60,
      status: test.status || 'active',
      scheduledDate: test.scheduledDate || new Date().toISOString().split('T')[0],
      attemptsCount: test.attemptsCount || 0,
      averageScore: test.averageScore || 0,
    }

    if (idx >= 0) {
      list[idx] = fullTest
    } else {
      list.unshift(fullTest)
    }

    this.persistDraft()
    return fullTest
  }

  public async deleteTest(id: string): Promise<boolean> {
    this.draftState.tests = this.draftState.tests.filter((t) => t.id !== id)
    this.persistDraft()
    return true
  }

  // ---------------------------------------------------------------------
  // ENQUIRIES & ADMISSIONS
  // ---------------------------------------------------------------------
  // CONNECT FIRESTORE HERE:
  // collection(db, 'enquiries')
  // ---------------------------------------------------------------------
  public getEnquiries(filter?: { status?: string; search?: string }): EnquiryItem[] {
    // Enquiries are shared live
    let items = [...this.draftState.enquiries]

    if (filter) {
      if (filter.status && filter.status !== 'all') {
        items = items.filter((e) => e.status.toLowerCase() === filter.status?.toLowerCase())
      }
      if (filter.search && filter.search.trim()) {
        const q = filter.search.toLowerCase()
        items = items.filter((e) => e.name.toLowerCase().includes(q) || e.phone.includes(q))
      }
    }

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  public async submitEnquiry(enquiry: Omit<EnquiryItem, 'id' | 'date' | 'status'>): Promise<EnquiryItem> {
    const newEnquiry: EnquiryItem = {
      ...enquiry,
      id: `enq_${Date.now()}`,
      date: new Date().toISOString(),
      status: 'New',
    }

    this.draftState.enquiries.unshift(newEnquiry)
    this.publishedState.enquiries.unshift(newEnquiry)
    this.persistDraft()
    this.persistPublished()

    return newEnquiry
  }

  public async updateEnquiryStatus(
    id: string,
    status: EnquiryItem['status'],
    notes?: string
  ): Promise<boolean> {
    const target = this.draftState.enquiries.find((e) => e.id === id)
    if (!target) return false

    target.status = status
    if (notes !== undefined) {
      target.notes = notes
    }

    // Sync with published state as enquiries are live customer entries
    const pubTarget = this.publishedState.enquiries.find((e) => e.id === id)
    if (pubTarget) {
      pubTarget.status = status
      if (notes !== undefined) pubTarget.notes = notes
    }

    this.persistDraft()
    this.persistPublished()
    return true
  }

  public exportEnquiriesToCSV(): string {
    const items = this.draftState.enquiries
    const headers = ['ID', 'Student Name', 'Phone', 'Class', 'Stream', 'Status', 'Date', 'Message', 'Notes']
    const rows = items.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      i.phone,
      i.classGrade,
      i.stream,
      i.status,
      new Date(i.date).toLocaleDateString('en-IN'),
      `"${(i.message || '').replace(/"/g, '""')}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`,
    ])

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  }

  // ---------------------------------------------------------------------
  // STUDENTS & ROSTER
  // ---------------------------------------------------------------------
  // CONNECT FIRESTORE HERE:
  // collection(db, 'students')
  // ---------------------------------------------------------------------
  public getStudents(): StudentItem[] {
    return [...this.draftState.students]
  }

  public async toggleStudentAccess(studentId: string, courseId: string, hasAccess: boolean): Promise<boolean> {
    const student = this.draftState.students.find((s) => s.id === studentId)
    if (!student) return false

    if (hasAccess) {
      if (!student.enrolledCourses.includes(courseId)) {
        student.enrolledCourses.push(courseId)
      }
    } else {
      student.enrolledCourses = student.enrolledCourses.filter((c) => c !== courseId)
    }

    this.persistDraft()
    return true
  }

  // ---------------------------------------------------------------------
  // DASHBOARD STATS
  // ---------------------------------------------------------------------
  public getDashboardStats() {
    const liveCourses = this.draftState.courses.filter((c) => c.status === 'live').length
    const videoCount = this.draftState.lessons.filter((l) => l.type === 'Video' && l.status === 'live').length
    const pdfCount = this.draftState.lessons.filter((l) => l.type !== 'Video' && l.status === 'live').length
    const enquiries = this.draftState.enquiries.length

    return {
      thisMonthEnquiries: enquiries,
      lastMonthEnquiries: 30,
      enquiriesGrowthPercent: 38,
      liveCoursesCount: liveCourses || 4,
      videoLecturesCount: videoCount || 32,
      pdfsNotesCount: pdfCount || 48,
      storageUsedBytes: 4509715660, // 4.2 GB
      storageTotalBytes: 53687091200, // 50 GB
      storagePercent: 8.4,
    }
  }
}

export const dataService = new DataService()
