import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | SSK Professional Coaching Classes',
  description: 'Private administrative management portal for SSK Professional Coaching Classes.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF3EC] via-[#F8F4EA] to-[#E3EEF8] text-[#13321F] admin-font antialiased selection:bg-[#E8A33D]/25 selection:text-[#13321F] relative overflow-x-hidden">
      {/* Soft pastel blurred colour blobs behind */}
      <div className="fixed -top-40 -left-40 size-96 rounded-full bg-[#EAF3EC] blur-3xl opacity-80 pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 size-96 rounded-full bg-[#E3EEF8] blur-3xl opacity-75 pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/4 size-96 rounded-full bg-[#F4E04D]/15 blur-3xl opacity-70 pointer-events-none z-0" />
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  )
}
