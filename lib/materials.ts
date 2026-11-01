// Centralized Study Materials Registry for SSK Coaching Classes
// Provides structured metadata for courses and protected PDFs

export interface StudyMaterial {
  id: string
  title: string
  courseId: 'physical' | 'organic' | 'inorganic' | 'complete'
  courseName: string
  chapterNumber: number
  subject: string
  fileName: string
  description: string
  pageCount: number
  fileSize: string
  demoPrice: number // ₹1 demonstration price
  standardPrice: number
  badge: string
  topics: string[]
  previewHighlights: {
    title: string
    detail: string
  }[]
}

export const studyMaterials: StudyMaterial[] = [
  {
    id: 'ch-2-structure-of-atom',
    title: 'Chapter 2 – Structure of Atom',
    courseId: 'physical',
    courseName: 'Physical Chemistry',
    chapterNumber: 2,
    subject: 'Physical Chemistry (Class 11 & 12)',
    fileName: 'ch-2 Structure of Atom #2.pdf',
    description:
      'Official classroom lecture notes, step-by-step derivations of Bohr radius & orbital energies, de Broglie relations, Quantum Numbers, and high-yield Board & NEET practice problem sets.',
    pageCount: 5,
    fileSize: '12 KB',
    demoPrice: 1,
    standardPrice: 199,
    badge: 'High-Yield Chapter',
    topics: [
      'Discovery of Electron, Proton & Neutron (e/m ratio)',
      'Thomson & Rutherford Alpha Scattering Experiments',
      'Plancks Quantum Theory & Photoelectric Effect',
      'Bohrs Postulates & Hydrogen Emission Spectral Series',
      'de Broglie Dual Nature & Heisenberg Uncertainty Principle',
      'Quantum Numbers (n, l, ml, ms) & Orbital Nodal Planes',
      'Aufbau Principle, Paulis Exclusion & Hunds Rule',
    ],
    previewHighlights: [
      {
        title: 'Complete Derivations',
        detail: 'Rydberg formula, de Broglie relation, and Bohr orbital energy formulas worked out step-by-step.',
      },
      {
        title: 'Formula Summary Table',
        detail: 'Quick revision cheat-sheet for numerical speed and accuracy in exam conditions.',
      },
      {
        title: '1:1 Faculty Solved Problems',
        detail: 'Curated and reviewed by senior Chemistry faculty Dalip Mangotra (M.Sc Chemistry, B.Ed).',
      },
    ],
  },
  {
    id: 'ch-12-organic-principles',
    title: 'Chapter 12 – Organic Chemistry: Some Basic Principles & Techniques',
    courseId: 'organic',
    courseName: 'Organic Chemistry',
    chapterNumber: 12,
    subject: 'Organic Chemistry (Class 11 & 12)',
    fileName: 'ch-2 Structure of Atom #2.pdf',
    description:
      'IUPAC nomenclature rules, electron displacement effects (inductive, electromeric, resonance, hyperconjugation), reactive intermediates, and reaction mechanism frameworks.',
    pageCount: 5,
    fileSize: '12 KB',
    demoPrice: 1,
    standardPrice: 199,
    badge: 'Core Foundations',
    topics: [
      'Tetravalence of Carbon & Hybridization (sp3, sp2, sp)',
      'IUPAC Nomenclature of Multifunctional Compounds',
      'Inductive, Resonance & Hyperconjugation Effects',
      'Carbocations, Carbanions & Free Radicals Stability',
      'Types of Organic Reactions & Mechanism Notation',
    ],
    previewHighlights: [
      {
        title: 'Mechanism Pathways',
        detail: 'Curated electron pushing diagrams with color-coded curly arrows for clarity.',
      },
      {
        title: 'Reaction Map Cheat Sheet',
        detail: 'Interconversion table of functional groups for quick board revision.',
      },
      {
        title: '1:1 Faculty Solved Examples',
        detail: 'Step-by-step isomerism and acidity/basicity ranking problems solved by faculty.',
      },
    ],
  },
  {
    id: 'ch-3-periodic-classification',
    title: 'Chapter 3 – Classification of Elements & Periodicity in Properties',
    courseId: 'inorganic',
    courseName: 'Inorganic Chemistry',
    chapterNumber: 3,
    subject: 'Inorganic Chemistry (Class 11 & 12)',
    fileName: 'ch-2 Structure of Atom #2.pdf',
    description:
      'High-yield memory maps, periodic trends (atomic radii, ionization enthalpy, electron gain enthalpy, electronegativity), and NCERT exemplar exceptions decoded.',
    pageCount: 5,
    fileSize: '12 KB',
    demoPrice: 1,
    standardPrice: 199,
    badge: 'High-Yield Memory Map',
    topics: [
      'Modern Periodic Law & Present Form of Periodic Table',
      'Electronic Configurations and Types of Elements (s, p, d, f)',
      'Periodic Trends in Atomic & Ionic Radii',
      'Ionization Enthalpy & Electron Gain Enthalpy Anomalies',
      'Electronegativity, Valency & Anomalous Periodic Properties',
    ],
    previewHighlights: [
      {
        title: 'Exception Navigator',
        detail: 'All NCERT periodic trend exceptions highlighted with electronic configuration rationale.',
      },
      {
        title: 'Memory Map Tables',
        detail: 'Visual comparison matrices for rapid retention during entrance exam prep.',
      },
      {
        title: 'Board & NEET Exam Questions',
        detail: 'Selected past 10 years trend-based questions with verified answers.',
      },
    ],
  },
  {
    id: 'ch-complete-revision-kit',
    title: 'Complete Chemistry Master Notes & Chapter 2 – Structure of Atom',
    courseId: 'complete',
    courseName: 'Complete Chemistry Course',
    chapterNumber: 2,
    subject: 'Comprehensive Chemistry (Class 11 & 12)',
    fileName: 'ch-2 Structure of Atom #2.pdf',
    description:
      'Comprehensive study notes covering Class 11th & 12th Chemistry with flagship Chapter 2 – Structure of Atom, derivations, formula cheat sheets, and board scoring strategies.',
    pageCount: 5,
    fileSize: '12 KB',
    demoPrice: 1,
    standardPrice: 199,
    badge: 'All-in-One Master Kit',
    topics: [
      'Physical Chemistry Numerical Formula Directory',
      'Organic Chemistry Named Reactions & Reagents Index',
      'Inorganic Chemistry Periodic Trends & Coordination Compounds',
      'Classroom Derivations (Bohr Model, Rydberg, Nernst, Rate Laws)',
      '10-Year Board PYQ Categorization by Marks Weightage',
    ],
    previewHighlights: [
      {
        title: 'Complete Formula Directory',
        detail: 'All key formulas across Physical, Organic, and Inorganic Chemistry in one booklet.',
      },
      {
        title: 'Step-by-Step Problem Solving',
        detail: 'Exam-tested derivation workflows for maximum step-marking in board exams.',
      },
      {
        title: '1:1 Sunday Mentorship Notes',
        detail: 'Annotated doubt notes directly from Dalip Mangotra sir.',
      },
    ],
  },
]

export const razorpayConfig = {
  // Official SSK Coaching Classes payment profile link provided by user
  paymentProfileUrl: 'https://razorpay.me/@sskcoaching',
  // Demo amount configured as ₹1 strictly per user instruction
  demoAmount: 1,
  currency: 'INR',
}

