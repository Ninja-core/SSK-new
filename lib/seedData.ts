// =======================================================================
// SSK PROFESSIONAL COACHING CLASSES - SEED DATA
// =======================================================================
// This file serves as the centralized mock data repository for the
// front-end-first Admin Dashboard. When ready to connect Firebase,
// this seed data can be imported into Cloud Firestore.
// =======================================================================

export interface AdminUserSeed {
  id: string
  userId: string
  name: string
  role: 'Owner' | 'Admin'
  avatar: string
  createdAt: string
  lastLogin: string | null
  isDefaultPassword: boolean
  disabled: boolean
  createdBy?: string
}

export interface WebsiteContentSeed {
  announcementTag: string
  showAnnouncement: boolean
  heroHeadline: string
  heroSubheadline: string
  heroCtaPrimary: string
  heroCtaSecondary: string
  instituteName: string
  instituteShort: string
  brandHeader: string
  brandSub: string
  tagline: string
  address: string
  city: string
  state: string
  phonePrimary: string
  phoneSecondary: string
  whatsappNumber: string
  email: string
  instagramUrl: string
  youtubeUrl: string
  stats: {
    experienceYears: string
    activeStudents: string
    boardScoreMax: string
    successRate: string
  }
}

export interface BannerItemSeed {
  id: string
  title: string
  subtitle: string
  badge: string
  image: string
  linkText: string
  linkHref: string
  active: boolean
  order: number
}

export interface CourseSeed {
  id: string
  number: string
  name: string
  eyebrow: string
  tag: string
  image: string
  price: number
  formattedPrice: string
  originalPrice: string
  discount: string
  cardBg: string
  accentColor: string
  borderColor: string
  pillBg: string
  pillText: string
  buttonBg: string
  buttonHoverBg: string
  schedulePill: string
  doubtPill: string
  description: string
  highlights: string[]
  topics: string[]
  youtubePlaylistUrl: string
  status: 'live' | 'draft'
  totalStudents: number
  totalVideos: number
  totalPdfs: number
}

export interface LessonSeed {
  id: string
  title: string
  courseId: string
  courseName: string
  chapter: string
  type: 'Video' | 'PDF' | 'Notes' | 'DPP' | 'PYQ'
  description?: string
  fileUrl: string
  fileName: string
  fileSize: string
  duration?: string
  pages?: number
  enrolledOnly: boolean
  allowDownload: boolean
  status: 'live' | 'draft'
  uploadedAt: string
  downloadsCount: number
  viewsCount: number
}

export interface TestItemSeed {
  id: string
  title: string
  courseId: string
  courseName: string
  chapter: string
  totalQuestions: number
  totalMarks: number
  durationMinutes: number
  status: 'active' | 'draft' | 'archived'
  scheduledDate: string
  attemptsCount: number
  averageScore: number
}

export interface EnquirySeed {
  id: string
  name: string
  phone: string
  classGrade: 'Class 11th' | 'Class 12th' | 'Target / Dropper'
  stream: 'Medical (NEET)' | 'Non-Medical (JEE)' | 'Board Focus'
  message: string
  date: string
  status: 'New' | 'Contacted' | 'Enrolled' | 'Closed'
  notes?: string
  followUpDate?: string
}

export interface StudentSeed {
  id: string
  name: string
  phone: string
  classGrade: string
  stream: string
  enrolledCourses: string[]
  joinedDate: string
  feeStatus: 'Paid' | 'Partial' | 'Pending'
  accessActive: boolean
}

// -----------------------------------------------------------------------
// 1. DEFAULT ADMIN USER (SEED)
// User ID: sskadmin
// Password: SSK@12345
// -----------------------------------------------------------------------
export const defaultAdminSeed: AdminUserSeed = {
  id: 'admin_owner_01',
  userId: 'sskadmin',
  name: 'Owner',
  role: 'Owner',
  avatar: '/image10-collar.png',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLogin: '2026-11-21T18:30:00.000Z',
  isDefaultPassword: true, // triggers the gentle warning banner until changed
  disabled: false,
}

// -----------------------------------------------------------------------
// 2. WEBSITE CONTENT SEED
// -----------------------------------------------------------------------
export const defaultWebsiteContentSeed: WebsiteContentSeed = {
  announcementTag: 'Admissions Open 2026-27',
  showAnnouncement: true,
  heroHeadline: 'Master Chemistry. Build Your Future.',
  heroSubheadline:
    'Targeted 1:1 conceptual derivations, step-by-step board numericals, and comprehensive NEET/JEE foundation for Class 11th & 12th students in Ramgarh.',
  heroCtaPrimary: 'Enquire for Demo Class',
  heroCtaSecondary: 'Explore Courses & PDFs',
  instituteName: 'SSK Professional Coaching Classes',
  instituteShort: 'SSK Coaching Classes',
  brandHeader: 'SSK PROFESSIONAL',
  brandSub: 'COACHING CLASSES',
  tagline: 'Master Chemistry. Build Your Future.',
  address: 'Near Post Office, Ramgarh',
  city: 'Ramgarh',
  state: 'Jammu & Kashmir',
  phonePrimary: '9419152187',
  phoneSecondary: '8082858131',
  whatsappNumber: '919419152187',
  email: 'sskchemistryclasses@gmail.com',
  instagramUrl: 'https://www.instagram.com/sskchemistryclasses',
  youtubeUrl: 'https://www.youtube.com/@sskchemistryclasses',
  stats: {
    experienceYears: '12+',
    activeStudents: '350+',
    boardScoreMax: '98/100',
    successRate: '94%',
  },
}

// -----------------------------------------------------------------------
// 3. CAROUSEL BANNERS SEED
// -----------------------------------------------------------------------
export const defaultBannersSeed: BannerItemSeed[] = [
  {
    id: 'banner_01',
    title: 'New Class 11th & 12th Batches Starting',
    subtitle: 'Limited seats per batch for personalized 1:1 attention & derivations practice.',
    badge: 'ADMISSIONS OPEN',
    image: '/image1.png',
    linkText: 'Book Free Demo',
    linkHref: '#enquire',
    active: true,
    order: 1,
  },
  {
    id: 'banner_02',
    title: 'Chapter 2: Structure of Atom Lecture Notes',
    subtitle: 'Download complete Bohr radius derivations, Rydberg equations, and Board PYQs.',
    badge: 'OFFICIAL NOTES',
    image: '/image2.png',
    linkText: 'Unlock ₹1 PDF',
    linkHref: '/courses/physical',
    active: true,
    order: 2,
  },
  {
    id: 'banner_03',
    title: 'Sunday 1:1 Dedicated Doubt Resolution',
    subtitle: 'Direct interaction with senior faculty Dalip Mangotra (M.Sc Chemistry, B.Ed).',
    badge: 'INDIVIDUAL ATTENTION',
    image: '/image10.png',
    linkText: 'Contact Faculty',
    linkHref: 'https://wa.me/919419152187',
    active: true,
    order: 3,
  },
]

// -----------------------------------------------------------------------
// 4. COURSES SEED
// -----------------------------------------------------------------------
export const defaultCoursesSeed: CourseSeed[] = [
  {
    id: 'physical',
    number: '01',
    name: 'Physical Chemistry',
    eyebrow: 'CLASS 11th & 12th',
    tag: 'Numericals & Conceptual Derivations',
    image: '/image4.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹8,999',
    discount: '44% OFF',
    cardBg: '#E8F0FE',
    accentColor: '#5277C3',
    borderColor: '#C7D9FA',
    pillBg: '#D6E4FC',
    pillText: '#2C4F9E',
    buttonBg: '#5277C3',
    buttonHoverBg: '#4163AC',
    schedulePill: 'Target Boards & Entrances',
    doubtPill: '1:1 Doubt Solving',
    description: 'Make equations intuitive through clear concepts, worked examples, and step-by-step problem derivations.',
    highlights: [
      'Chapter-wise Board PYQs & Daily Practice Problems',
      'Sunday 1:1 dedicated doubt resolution',
    ],
    topics: ['Mole Concept', 'Thermodynamics', 'Equilibrium', 'Chemical Kinetics', 'Electrochemistry'],
    youtubePlaylistUrl: 'https://www.youtube.com/@sskchemistryclasses',
    status: 'live',
    totalStudents: 142,
    totalVideos: 18,
    totalPdfs: 14,
  },
  {
    id: 'organic',
    number: '02',
    name: 'Organic Chemistry',
    eyebrow: 'CLASS 11th & 12th',
    tag: 'Mechanisms & Synthesis Mastery',
    image: '/image5.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹8,999',
    discount: '44% OFF',
    cardBg: '#F1EAFE',
    accentColor: '#8B72C9',
    borderColor: '#DDD0FA',
    pillBg: '#E5D8FC',
    pillText: '#5E449D',
    buttonBg: '#8B72C9',
    buttonHoverBg: '#7A62B6',
    schedulePill: 'Target Boards & Entrances',
    doubtPill: 'Mechanism Flowcharts',
    description: 'Learn electron flow, curly arrows, named reactions, and multi-step synthesis pathways without rote memorization.',
    highlights: [
      'Visual reaction maps & conversion roadmaps',
      'NCERT line-by-line decoding and board patterns',
    ],
    topics: ['General Organic Chemistry (GOC)', 'Hydrocarbons', 'Haloalkanes & Haloarenes', 'Alcohols & Phenols', 'Aldehydes & Ketones', 'Amines'],
    youtubePlaylistUrl: 'https://www.youtube.com/@sskchemistryclasses',
    status: 'live',
    totalStudents: 128,
    totalVideos: 14,
    totalPdfs: 16,
  },
  {
    id: 'inorganic',
    number: '03',
    name: 'Inorganic Chemistry',
    eyebrow: 'CLASS 11th & 12th',
    tag: 'Trends, Bonding & Coordination',
    image: '/image6.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹8,999',
    discount: '44% OFF',
    cardBg: '#EAF6EE',
    accentColor: '#4A9A68',
    borderColor: '#C7E5D3',
    pillBg: '#D5EEDF',
    pillText: '#286B42',
    buttonBg: '#4A9A68',
    buttonHoverBg: '#3E8357',
    schedulePill: 'Target Boards & Entrances',
    doubtPill: 'NCERT High-Yield Points',
    description: 'Clear periodic trends, electronic configurations, crystal field theory, and high-scoring NCERT exceptions.',
    highlights: [
      'Memory tricks for periodic trends and color tests',
      'Full coordination compound nomenclature & isomerism',
    ],
    topics: ['Chemical Bonding', 'Periodic Properties', 'p-Block Elements', 'd & f-Block Elements', 'Coordination Chemistry'],
    youtubePlaylistUrl: 'https://www.youtube.com/@sskchemistryclasses',
    status: 'live',
    totalStudents: 116,
    totalVideos: 12,
    totalPdfs: 10,
  },
  {
    id: 'complete',
    number: '04',
    name: 'Complete Chemistry (Boards + NEET/JEE)',
    eyebrow: 'CLASS 11th & 12th (RECOMMENDED)',
    tag: 'Full 360° Syllabus Coverage',
    image: '/image7.jpg',
    price: 9999,
    formattedPrice: '₹9,999',
    originalPrice: '₹19,999',
    discount: '50% OFF',
    cardBg: '#FEF8EA',
    accentColor: '#C48A2C',
    borderColor: '#F6E0B3',
    pillBg: '#FCEECF',
    pillText: '#8A5D14',
    buttonBg: '#C48A2C',
    buttonHoverBg: '#AA7420',
    schedulePill: 'All-in-One Comprehensive',
    doubtPill: 'Daily Personal Mentorship',
    description: 'Master Physical, Organic, and Inorganic Chemistry together with weekly mock tests, revision notes, and exam answer writing tips.',
    highlights: [
      'Includes all 3 modules + Full Year Test Series',
      'Priority 1:1 doubt sessions with faculty',
      'Free printed formula books & derivation cheat-sheets',
    ],
    topics: ['Physical Chemistry (Full)', 'Organic Chemistry (Full)', 'Inorganic Chemistry (Full)', 'Full Mock Board Exam Series'],
    youtubePlaylistUrl: 'https://www.youtube.com/@sskchemistryclasses',
    status: 'live',
    totalStudents: 185,
    totalVideos: 44,
    totalPdfs: 40,
  },
]

// -----------------------------------------------------------------------
// 5. LESSONS & UPLOADS SEED
// -----------------------------------------------------------------------
export const defaultLessonsSeed: LessonSeed[] = [
  {
    id: 'lesson_01',
    title: 'Chapter 2: Structure of Atom – Official Classroom Lecture Notes',
    courseId: 'physical',
    courseName: 'Physical Chemistry',
    chapter: 'Structure of Atom',
    type: 'PDF',
    description: 'Step-by-step Bohr model derivations, de Broglie relation, Quantum numbers, and Board PYQs.',
    fileUrl: '/api/material/view?token=demo',
    fileName: 'ch-2 Structure of Atom #2.pdf',
    fileSize: '2.4 MB',
    pages: 5,
    enrolledOnly: false,
    allowDownload: true,
    status: 'live',
    uploadedAt: '2026-11-01T14:20:00.000Z',
    downloadsCount: 184,
    viewsCount: 420,
  },
  {
    id: 'lesson_02',
    title: 'Derivation of Bohr Radius & Orbital Energy Equations',
    courseId: 'physical',
    courseName: 'Physical Chemistry',
    chapter: 'Structure of Atom',
    type: 'Video',
    description: 'Complete 45-minute whiteboard walkthrough of atomic spectra and energy level calculations.',
    fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    fileName: 'bohr_radius_derivation.mp4',
    fileSize: '480 MB',
    duration: '44:18',
    enrolledOnly: true,
    allowDownload: false,
    status: 'live',
    uploadedAt: '2026-11-05T10:15:00.000Z',
    downloadsCount: 0,
    viewsCount: 310,
  },
  {
    id: 'lesson_03',
    title: 'Mole Concept – DPP 01: Stoichiometry & Limiting Reagent',
    courseId: 'physical',
    courseName: 'Physical Chemistry',
    chapter: 'Some Basic Concepts of Chemistry',
    type: 'DPP',
    description: '25 high-yield numericals with answer key and hints for speed enhancement.',
    fileUrl: '/sample-notes.pdf',
    fileName: 'mole_concept_dpp_01.pdf',
    fileSize: '1.2 MB',
    pages: 4,
    enrolledOnly: true,
    allowDownload: true,
    status: 'live',
    uploadedAt: '2026-11-08T16:40:00.000Z',
    downloadsCount: 145,
    viewsCount: 220,
  },
  {
    id: 'lesson_04',
    title: 'GOC Masterclass: Inductive, Mesomeric & Hyperconjugation Effects',
    courseId: 'organic',
    courseName: 'Organic Chemistry',
    chapter: 'General Organic Chemistry',
    type: 'Video',
    description: 'Core electron displacement mechanisms decoded with 30 competitive question examples.',
    fileUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    fileName: 'goc_resonance_masterclass.mp4',
    fileSize: '620 MB',
    duration: '58:45',
    enrolledOnly: false,
    allowDownload: false,
    status: 'live',
    uploadedAt: '2026-11-12T11:00:00.000Z',
    downloadsCount: 0,
    viewsCount: 520,
  },
  {
    id: 'lesson_05',
    title: 'Aldehydes, Ketones & Carboxylic Acids – Named Reactions Sheet',
    courseId: 'organic',
    courseName: 'Organic Chemistry',
    chapter: 'Aldehydes and Ketones',
    type: 'Notes',
    description: 'Aldol, Cannizzaro, Clemmensen, Wolff-Kishner, and Hell-Volhard-Zelinsky mechanisms.',
    fileUrl: '/sample-notes.pdf',
    fileName: 'organic_named_reactions.pdf',
    fileSize: '3.1 MB',
    pages: 8,
    enrolledOnly: false,
    allowDownload: true,
    status: 'live',
    uploadedAt: '2026-11-15T09:30:00.000Z',
    downloadsCount: 290,
    viewsCount: 680,
  },
  {
    id: 'lesson_06',
    title: 'Chemical Bonding: VSEPR, Hybridisation & Molecular Orbital Theory (MOT)',
    courseId: 'inorganic',
    courseName: 'Inorganic Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    type: 'PDF',
    description: 'Formula maps for paramagnetic vs diamagnetic species and bond order shortcuts.',
    fileUrl: '/sample-notes.pdf',
    fileName: 'chemical_bonding_mot.pdf',
    fileSize: '2.8 MB',
    pages: 6,
    enrolledOnly: true,
    allowDownload: true,
    status: 'live',
    uploadedAt: '2026-11-18T15:10:00.000Z',
    downloadsCount: 98,
    viewsCount: 195,
  },
  {
    id: 'lesson_07',
    title: 'Class 12th Board Exam PYQ Compilation (Last 10 Years Solved)',
    courseId: 'complete',
    courseName: 'Complete Chemistry',
    chapter: 'All Chapters',
    type: 'PYQ',
    description: 'Strictly evaluated solutions with marking scheme breakdown and common mistakes list.',
    fileUrl: '/sample-notes.pdf',
    fileName: 'chemistry_class12_pyq_10yr.pdf',
    fileSize: '8.4 MB',
    pages: 34,
    enrolledOnly: true,
    allowDownload: true,
    status: 'draft',
    uploadedAt: '2026-11-20T17:45:00.000Z',
    downloadsCount: 12,
    viewsCount: 45,
  },
]

// -----------------------------------------------------------------------
// 6. TEST SERIES SEED
// -----------------------------------------------------------------------
export const defaultTestsSeed: TestItemSeed[] = [
  {
    id: 'test_01',
    title: 'Structure of Atom – Chapter Benchmark Test',
    courseId: 'physical',
    courseName: 'Physical Chemistry',
    chapter: 'Structure of Atom',
    totalQuestions: 30,
    totalMarks: 70,
    durationMinutes: 60,
    status: 'active',
    scheduledDate: '2026-11-23',
    attemptsCount: 88,
    averageScore: 54.2,
  },
  {
    id: 'test_02',
    title: 'GOC & Reaction Intermediates Speed Drill',
    courseId: 'organic',
    courseName: 'Organic Chemistry',
    chapter: 'General Organic Chemistry',
    totalQuestions: 25,
    totalMarks: 50,
    durationMinutes: 45,
    status: 'active',
    scheduledDate: '2026-11-25',
    attemptsCount: 74,
    averageScore: 38.6,
  },
  {
    id: 'test_03',
    title: 'Chemical Bonding & Periodic Properties Review',
    courseId: 'inorganic',
    courseName: 'Inorganic Chemistry',
    chapter: 'Chemical Bonding',
    totalQuestions: 35,
    totalMarks: 70,
    durationMinutes: 60,
    status: 'active',
    scheduledDate: '2026-11-28',
    attemptsCount: 65,
    averageScore: 51.0,
  },
  {
    id: 'test_04',
    title: 'Class 12th Half-Syllabus Board Mock Exam',
    courseId: 'complete',
    courseName: 'Complete Chemistry',
    chapter: 'Full Term 1 Syllabus',
    totalQuestions: 40,
    totalMarks: 100,
    durationMinutes: 180,
    status: 'draft',
    scheduledDate: '2026-12-05',
    attemptsCount: 0,
    averageScore: 0,
  },
]

// -----------------------------------------------------------------------
// 7. ENQUIRIES SEED
// -----------------------------------------------------------------------
export const defaultEnquiriesSeed: EnquirySeed[] = [
  {
    id: 'enq_101',
    name: 'Aman Sharma',
    phone: '9858112233',
    classGrade: 'Class 11th',
    stream: 'Non-Medical (JEE)',
    message: 'Interested in Physical Chemistry demo class for Sunday batch. Please confirm timings.',
    date: '2026-11-21T10:14:00.000Z',
    status: 'Contacted',
    notes: 'Called from Ramgarh main market. Prefers morning 9:00 AM batch.',
    followUpDate: '2026-11-22',
  },
  {
    id: 'enq_102',
    name: 'Priya Jamwal',
    phone: '9419234567',
    classGrade: 'Class 12th',
    stream: 'Medical (NEET)',
    message: 'Need help with Organic Chemistry conversions and reaction mechanisms for upcoming pre-boards.',
    date: '2026-11-20T16:30:00.000Z',
    status: 'Contacted',
    notes: 'Father visited institute. Sent syllabus schedule on WhatsApp.',
    followUpDate: '2026-11-23',
  },
  {
    id: 'enq_103',
    name: 'Rohit Choudhary',
    phone: '7006891234',
    classGrade: 'Class 12th',
    stream: 'Non-Medical (JEE)',
    message: 'Looking for Complete Chemistry course including test series and 1:1 doubt clearing.',
    date: '2026-11-19T14:45:00.000Z',
    status: 'Enrolled',
    notes: 'Enrolled in Complete Chemistry batch. Receipt #SSK-2026-88 issued.',
  },
  {
    id: 'enq_104',
    name: 'Simran Kour',
    phone: '9797554433',
    classGrade: 'Class 11th',
    stream: 'Medical (NEET)',
    message: 'Can I attend demo session with senior faculty Dalip Sir?',
    date: '2026-11-18T11:20:00.000Z',
    status: 'Contacted',
    notes: 'Demo scheduled for Saturday 4 PM.',
    followUpDate: '2026-11-22',
  },
  {
    id: 'enq_105',
    name: 'Sahil Verma',
    phone: '9622119988',
    classGrade: 'Target / Dropper',
    stream: 'Medical (NEET)',
    message: 'Wanted to enquire about crash course pricing and test series schedule.',
    date: '2026-11-17T09:15:00.000Z',
    status: 'Closed',
    notes: 'Decided to join regular 1-year program next term.',
  },
  {
    id: 'enq_106',
    name: 'Mehak Rajput',
    phone: '9419188776',
    classGrade: 'Class 12th',
    stream: 'Board Focus',
    message: 'Derivations in Physical Chemistry are difficult. Can I take individual module only?',
    date: '2026-11-15T15:00:00.000Z',
    status: 'Enrolled',
    notes: 'Joined Physical Chemistry module. Assigned to Room 2 batch.',
  },
]

// -----------------------------------------------------------------------
// 8. STUDENTS SEED
// -----------------------------------------------------------------------
export const defaultStudentsSeed: StudentSeed[] = [
  {
    id: 'std_01',
    name: 'Rohit Choudhary',
    phone: '7006891234',
    classGrade: 'Class 12th',
    stream: 'Non-Medical (JEE)',
    enrolledCourses: ['complete', 'physical', 'organic', 'inorganic'],
    joinedDate: '2026-11-19',
    feeStatus: 'Paid',
    accessActive: true,
  },
  {
    id: 'std_02',
    name: 'Mehak Rajput',
    phone: '9419188776',
    classGrade: 'Class 12th',
    stream: 'Board Focus',
    enrolledCourses: ['physical'],
    joinedDate: '2026-11-15',
    feeStatus: 'Paid',
    accessActive: true,
  },
  {
    id: 'std_03',
    name: 'Harpreet Singh',
    phone: '9419122334',
    classGrade: 'Class 11th',
    stream: 'Medical (NEET)',
    enrolledCourses: ['physical', 'inorganic'],
    joinedDate: '2026-10-12',
    feeStatus: 'Paid',
    accessActive: true,
  },
  {
    id: 'std_04',
    name: 'Ananya Gupta',
    phone: '9906123456',
    classGrade: 'Class 12th',
    stream: 'Non-Medical (JEE)',
    enrolledCourses: ['organic'],
    joinedDate: '2026-10-25',
    feeStatus: 'Partial',
    accessActive: true,
  },
  {
    id: 'std_05',
    name: 'Vikas Sharma',
    phone: '9622445566',
    classGrade: 'Class 11th',
    stream: 'Non-Medical (JEE)',
    enrolledCourses: ['complete'],
    joinedDate: '2026-09-01',
    feeStatus: 'Paid',
    accessActive: true,
  },
  {
    id: 'std_06',
    name: 'Neha Slathia',
    phone: '9419155667',
    classGrade: 'Class 12th',
    stream: 'Medical (NEET)',
    enrolledCourses: ['organic', 'inorganic'],
    joinedDate: '2026-09-18',
    feeStatus: 'Pending',
    accessActive: false, // Access disabled until fee clearance
  },
]

// -----------------------------------------------------------------------
// 9. OVERVIEW STATS (THIS MONTH AT A GLANCE)
// -----------------------------------------------------------------------
export const defaultDashboardStats = {
  thisMonthEnquiries: 42,
  lastMonthEnquiries: 30,
  enquiriesGrowthPercent: 40,
  liveCoursesCount: 4,
  videoLecturesCount: 32,
  pdfsNotesCount: 48,
  activeEnrolledStudents: 185,
  storageUsedBytes: 4509715660, // 4.2 GB
  storageTotalBytes: 53687091200, // 50 GB
  storagePercent: 8.4,
}
