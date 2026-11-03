import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { courses } from '@/lib/courses'
import { CourseDetailPageClient } from './CourseDetailPageClient'

interface CoursePageProps {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }))
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { id } = await params
  const course = courses.find((c) => c.id === id)
  if (!course) {
    return {
      title: 'Course Not Found | SSK Professional Coaching Classes',
    }
  }

  return {
    title: `${course.name} - Notes & Study Material | SSK Professional Coaching Classes`,
    description: course.description,
    icons: {
      icon: [
        { url: '/favicon.ico?v=2', sizes: 'any' },
        { url: '/favicon-32x32.png?v=2', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-16x16.png?v=2', type: 'image/png', sizes: '16x16' },
        { url: '/favicon.png?v=2', type: 'image/png', sizes: '512x512' },
        { url: '/image14_raw.png?v=2', type: 'image/png' },
      ],
      shortcut: '/favicon.ico?v=2',
      apple: [
        { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
      ],
    },
  }
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { id } = await params
  const course = courses.find((c) => c.id === id)

  if (!course) {
    notFound()
  }

  return <CourseDetailPageClient course={course} />
}

