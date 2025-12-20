'use client'

import { ServiceDetailContent } from '@/types/service-detail'
import { MessageCircle, Mail, Instagram } from 'lucide-react'

interface ServiceCTAProps {
  content: ServiceDetailContent
}

export function ServiceCTA({ content }: ServiceCTAProps) {
  if (!content.cta_enabled) return null

  const whatsappNumber = content.cta_whatsapp_number?.replace(/\D/g, '') || ''

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto max-w-4xl text-center">
        {content.cta_title && (
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-8 mb-6 backdrop-blur-sm inline-block">
            <h2 className="text-3xl md:text-5xl font-bold">
              {content.cta_title}
            </h2>
          </div>
        )}
        {content.cta_description && (
          <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-6 mb-12 max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-gray-300 text-lg md:text-xl">
              {content.cta_description}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {content.cta_whatsapp_enabled && whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[200px] bg-[#25D366] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#20BA5A] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
          )}
          {content.cta_email_enabled && content.cta_email_address && (
            <a
              href={`mailto:${content.cta_email_address}`}
              className="w-full sm:w-auto min-w-[200px] bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              E-mail
            </a>
          )}
          {content.cta_instagram_enabled && content.cta_instagram_url && (
            <a
              href={content.cta_instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[200px] bg-[#E4405F] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#D32E4A] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Instagram size={20} />
              Instagram
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

