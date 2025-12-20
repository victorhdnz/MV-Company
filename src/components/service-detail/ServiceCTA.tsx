'use client'

import { ServiceDetailContent } from '@/types/service-detail'
import { SocialButton } from '@/components/ui/SocialButton'

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
            <SocialButton
              type="whatsapp"
              href={`https://wa.me/${whatsappNumber}`}
              text={content.cta_whatsapp_text || 'WhatsApp'}
            />
          )}
          {content.cta_email_enabled && content.cta_email_address && (
            <SocialButton
              type="email"
              href={`mailto:${content.cta_email_address}`}
              text={content.cta_email_text || 'E-mail'}
            />
          )}
          {content.cta_instagram_enabled && content.cta_instagram_url && (
            <SocialButton
              type="instagram"
              href={content.cta_instagram_url}
              text={content.cta_instagram_text || 'Instagram'}
            />
          )}
        </div>
      </div>
    </section>
  )
}

