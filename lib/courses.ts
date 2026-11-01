export interface Course {
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
}

export const courses: Course[] = [
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
    youtubePlaylistUrl: '', // Add YouTube playlist link when ready
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
    buttonHoverBg: '#765DB5',
    schedulePill: 'NCERT Line-by-Line',
    doubtPill: '1:1 Doubt Solving',
    description: 'Understand reactions as connected stories instead of isolated facts to memorise.',
    highlights: [
      'General Organic Chemistry (GOC) & intermediates',
      'Sunday 1:1 dedicated doubt resolution',
    ],
    topics: ['GOC & Isomerism', 'Hydrocarbons', 'Haloalkanes', 'Carbonyl Compounds', 'Biomolecules'],
    youtubePlaylistUrl: '', // Add YouTube playlist link when ready
  },
  {
    id: 'inorganic',
    number: '03',
    name: 'Inorganic Chemistry',
    eyebrow: 'CLASS 11th & 12th',
    tag: 'Periodic Trends & NCERT Mastery',
    image: '/image6.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹8,999',
    discount: '44% OFF',
    cardBg: '#E4F5EC',
    accentColor: '#398568',
    borderColor: '#C0E6D2',
    pillBg: '#D0EEDD',
    pillText: '#235D47',
    buttonBg: '#398568',
    buttonHoverBg: '#2D6F55',
    schedulePill: 'High-Yield Memory Maps',
    doubtPill: '1:1 Doubt Solving',
    description: 'Turn periodic trends, bonding, and coordination chemistry into a system you can rely on.',
    highlights: [
      'NCERT exemplar decoding with quick revision guides',
      'Sunday 1:1 dedicated doubt resolution',
    ],
    topics: ['Periodic Table', 'Chemical Bonding', 'Coordination Chemistry', 'p-Block Elements', 'd & f-Block'],
    youtubePlaylistUrl: '', // Add YouTube playlist link when ready
  },
  {
    id: 'complete',
    number: '04',
    name: 'Complete Chemistry Course',
    eyebrow: 'COMPREHENSIVE BATCH',
    tag: 'Physical + Organic + Inorganic All-in-One',
    image: '/image7.jpg',
    price: 4999,
    formattedPrice: '₹4,999',
    originalPrice: '₹9,999',
    discount: '50% OFF',
    cardBg: '#F8EBDD',
    accentColor: '#B68A42',
    borderColor: '#E8D4BE',
    pillBg: '#F2DFCB',
    pillText: '#865E1E',
    buttonBg: '#B68A42',
    buttonHoverBg: '#9F7430',
    schedulePill: 'Full Syllabus Coverage',
    doubtPill: 'Sunday 1:1 Mentorship',
    description: 'A structured route through all three branches, designed for consistent revision and top scores.',
    highlights: [
      'Full-length test series with personal performance review',
      'Sunday 1:1 dedicated doubt resolution',
    ],
    topics: ['Complete Class 11th & 12th Syllabus', 'Board PYQ Bank', 'Formula Sheets', 'Mock Tests'],
    youtubePlaylistUrl: '', // Add YouTube playlist link when ready
  },
]

