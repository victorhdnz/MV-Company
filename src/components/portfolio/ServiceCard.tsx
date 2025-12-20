'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Service } from '@/types'

interface ServiceCardProps {
  service: Service
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Link href={`/portfolio/${service.slug}`} className="block group">
      <div className="relative h-[300px] md:h-[350px] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-300">
        {/* Background Image - Blurred by default, sharp on hover */}
        {service.cover_image ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={service.cover_image}
                alt={service.name}
                fill
                className="object-cover scale-110 group-hover:scale-115 transition-all duration-500 blur-md group-hover:blur-0"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-all duration-500" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Content - Fade out on hover */}
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8 group-hover:opacity-0 transition-opacity duration-500">
          {/* Top Section - Icon/Logo */}
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              {service.cover_image ? (
                <Image
                  src={service.cover_image}
                  alt={service.name}
                  width={56}
                  height={56}
                  className="object-contain p-1.5 rounded-lg"
                />
              ) : (
                <span className="text-2xl md:text-3xl">🚀</span>
              )}
            </div>
            {service.is_featured && (
              <div className="px-3 py-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full">
                <span className="text-yellow-400 text-xs font-semibold">Destaque</span>
              </div>
            )}
          </div>

          {/* Bottom Section - Text */}
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {service.name}
            </h3>
            {service.short_description && (
              <p className="text-white/80 text-sm md:text-base font-light line-clamp-2">
                {service.short_description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
