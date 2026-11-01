'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface HeroBannerCardProps {
  onEnquireClick: (courseName?: string) => void
}

export function HeroBannerCard({ onEnquireClick }: HeroBannerCardProps) {
  const [activeSlide, setActiveSlide] = useState(0)


  const slides = [
    {
      id: 'classroom-smartboard',
      image: '/image2.png',
      badge: 'SSK CLASSROOM EXCELLENCE',
      title: 'Interactive Smartboard Chemistry Lectures',
      subtitle: 'Decoded reaction mechanisms, molecular orbital visualization & 1:1 guidance',
      courseTarget: 'Complete Chemistry Course',
    },
    {
      id: 'lab-demonstrations',
      image: '/image1.png',
      badge: 'PRACTICAL CONCEPT LEARNING',
      title: 'Experimental Clarity & Science Lab Demonstrations',
      subtitle: 'Building strong foundations for Class 11th & 12th Board, NEET & JEE',
      courseTarget: 'Physical Chemistry',
    },
  ]

  // Auto advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  function nextSlide(e: React.MouseEvent) {
    e.stopPropagation()
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }

  function prevSlide(e: React.MouseEvent) {
    e.stopPropagation()
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const current = slides[activeSlide]

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Sliding Image Carousel Container matching Screenshot 2 */}
      <div
        onClick={() => onEnquireClick(current.courseTarget)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-[#DED5C5] bg-[#12372A] shadow-[0_12px_40px_rgba(18,55,42,0.12)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(18,55,42,0.2)] hover:border-[#12372A]/40"
      >
        {/* Aspect Ratio Container (16:9 for optimal responsive balance) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle top & bottom gradient overlays for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
            </div>
          ))}

          {/* Top Overlays */}
          <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-20 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
              <Sparkles className="size-3 text-[#E8A33D]" />
              {current.badge}
            </span>

            <span className="rounded-full bg-[#12372A] border border-[#EBE3D5]/30 px-3 py-1 text-[11px] font-bold text-[#FAF5EC] shadow-md">
              Admissions Open
            </span>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 grid size-8 sm:size-10 place-items-center rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-xs transition shadow-md active:scale-95"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 grid size-8 sm:size-10 place-items-center rounded-full bg-black/45 hover:bg-black/75 text-white backdrop-blur-xs transition shadow-md active:scale-95"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </button>

          {/* Bottom Captions Overlay */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6 text-white">
            <h3 className="text-base sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
              {current.title}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow-xs">
              {current.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Dots Slider Indicator */}
      <div className="mt-3.5 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                setActiveSlide(i)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === i
                  ? 'w-7 bg-[#12372A]'
                  : 'w-2 bg-[#DED5C5] hover:bg-[#68675D]'
              }`}
              aria-label={`Show slide ${i + 1}`}
            />
          ))}
        </div>
        <p className="text-xs font-semibold text-[#12372A]">
          Tap or click banner above to open the application form
        </p>
      </div>
    </div>
  )
}
