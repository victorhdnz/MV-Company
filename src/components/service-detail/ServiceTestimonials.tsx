'use client'

import { ServiceDetailContent } from '@/types/service-detail'
import { ServiceTestimonial } from '@/types'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface ServiceTestimonialsProps {
  content: ServiceDetailContent
  testimonials: ServiceTestimonial[]
}

export function ServiceTestimonials({ content, testimonials }: ServiceTestimonialsProps) {
  if (!content.testimonials_enabled) return null

  return (
    <section className="py-16 md:py-24 px-4 bg-black text-white">
      <div className="container mx-auto max-w-6xl">
        {content.testimonials_title && (
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
            {content.testimonials_title}
          </h2>
        )}

        {/* Stats */}
        {content.testimonials_stats && (
          <p className="text-center text-xl text-gray-300 mb-12">
            {content.testimonials_stats}
          </p>
        )}

        {/* Testimonials Grid */}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600 hover:bg-gray-800 transition-all backdrop-blur-sm shadow-lg"
              >
                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < testimonial.rating! ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                )}

                {/* Text */}
                <p className="text-gray-300 mb-4 italic line-clamp-4">
                  "{testimonial.testimonial_text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {testimonial.client_photo && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.client_photo}
                        alt={testimonial.client_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.client_name}</p>
                    {testimonial.client_company && (
                      <p className="text-sm text-gray-400">{testimonial.client_company}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

