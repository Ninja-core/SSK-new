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

