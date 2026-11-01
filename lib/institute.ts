// Centralized institute configuration for SSK Professional Coaching Classes
// All official details are sourced directly from the official institute banner

export interface FacultyMember {
  name: string
  qualification: string
  subject: string
  extra?: string
  color?: string
  image: string
  quote: string
  stats: { exp: string; students: string }
  archColor: string
  tagBg: string
  tagText: string
  extraTagBg?: string
  extraTagText?: string
  number: string
  staggerClass: string
  featured?: boolean
}

export interface ContactNumber {
  label: string
  tel: string
  isPrimary?: boolean
}

export const instituteConfig = {
  name: 'SSK Professional Coaching Classes',
  shortName: 'SSK Coaching Classes',
  brandHeader: 'SSK PROFESSIONAL',
  brandSub: 'COACHING CLASSES',
  logo: '/image14.png',
  tagline: 'Master Chemistry. Build Your Future.',
  admissions: 'Admissions Open',
  classes: 'Class 11th and 12th',
  streams: 'Medical and Non-Medical',
  address: 'Near Post Office, Ramgarh',
  city: 'Ramgarh',
  state: 'Jammu & Kashmir',

  // Working telephone contacts from official banner
  contactNumbers: [
    { label: '9419152187', tel: '+919419152187', isPrimary: true },
    { label: '8082858131', tel: '+918082858131' },
  ] as ContactNumber[],

  // Primary WhatsApp number for 1-click enquiries (9419152187)
  whatsappNumber: '919419152187',

  // Verified social media handles
  instagram: {
    handle: '@sskchemistryclasses',
    url: 'https://www.instagram.com/sskchemistryclasses',
  },
  youtube: {
    handle: '@sskchemistryclasses',
    url: 'https://www.youtube.com/@sskchemistryclasses',
  },

  // Official Expert Faculty Members with exact qualifications and editorial palettes
  faculty: [
    {
      name: 'Dalip Mangotra',
      qualification: 'M.Sc Chemistry, B.Ed',
      extra: 'CSIR / UGC-NET',
      subject: 'CHEMISTRY',
      color: 'bg-orange-50 text-[#D9573B] border-orange-200/80',
      image: '/image10.png',
      quote: 'Makes organic chemistry feel simple',
      stats: { exp: '10+', students: '2,000+' },
      number: '1',
      archColor: '#D9573B',
      tagBg: '#D9573B',
      tagText: '#FFFFFF',
      extraTagBg: '#FBE8A6',
      extraTagText: '#12372A',
      staggerClass: 'lg:translate-y-0',
      featured: true,
    },
    {
      name: 'Udhay Slathia',
      qualification: 'M.Sc Mathematics',
      subject: 'MATHEMATICS',
      color: 'bg-emerald-50 text-[#6B8E78] border-emerald-200/80',
      image: '/image11.png',
      quote: 'Turns tough problems into clear steps',
      stats: { exp: '8+', students: '1,500+' },
      number: '2',
      archColor: '#6B8E78',
      tagBg: '#D1E2D7',
      tagText: '#12372A',
      staggerClass: 'lg:translate-y-8',
      featured: false,
    },
    {
      name: 'Rohit Gupta',
      qualification: 'M.Sc Electronics',
      subject: 'ELECTRONICS',
      color: 'bg-rose-50 text-[#A87C8A] border-rose-200/80',
      image: '/image12.png',
      quote: 'Concept-first, practical approach',
      stats: { exp: '12+', students: '3,000+' },
      number: '3',
      archColor: '#A87C8A',
      tagBg: '#EBDADF',
      tagText: '#12372A',
      staggerClass: 'lg:translate-y-3',
      featured: false,
    },
    {
      name: 'Rakesh Kumar',
      qualification: 'M.Sc Zoology',
      subject: 'ZOOLOGY',
      color: 'bg-pink-50 text-[#B85B6C] border-pink-200/80',
      image: '/image13.png',
      quote: 'Diagram-driven teaching for NEET',
      stats: { exp: '10+', students: '2,500+' },
      number: '4',
      archColor: '#B85B6C',
      tagBg: '#F4D3D8',
      tagText: '#12372A',
      staggerClass: 'lg:translate-y-8',
      featured: false,
    },
  ] as FacultyMember[],

  // Official image assets
  bannerImage: '/image2.png',
  galleryImages: {
    featured: '/image2.png',
    classroomLecture: '/image2.png',
    labDemo: '/image1.png',
    studyDesk: '/image6.jpg',
  },
}

