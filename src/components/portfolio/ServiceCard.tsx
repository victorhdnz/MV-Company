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
      <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-300">
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
        <div className="relative h-full flex flex-col justify-between p-8 md:p-10 group-hover:opacity-0 transition-opacity duration-500">
          {/* Top Section - Icon/Logo */}
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              {service.cover_image ? (
                <Image
                  src={service.cover_image}
                  alt={service.name}
                  width={80}
                  height={80}
                  className="object-contain p-2 rounded-xl"
                />
              ) : (
                <span className="text-3xl md:text-4xl">🚀</span>
              )}
            </div>
            {service.is_featured && (
              <div className="px-4 py-2 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full">
                <span className="text-yellow-400 text-xs font-semibold">Destaque</span>
              </div>
            )}
          </div>

          {/* Bottom Section - Text */}
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {service.name}
            </h3>
            {service.short_description && (
              <p className="text-white/80 text-base md:text-lg font-light line-clamp-2">
                {service.short_description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
