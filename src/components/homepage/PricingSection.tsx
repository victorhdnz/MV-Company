'use client'

import { useState } from 'react'
import { PricingComponent, PriceTier, BillingCycle, FeatureCategory } from '@/components/ui/pricing-card'
import { FadeInElement } from '@/components/ui/FadeInElement'

interface PricingSectionProps {
  enabled?: boolean
  title?: string
  description?: string
  annualDiscount?: number
  plans?: PriceTier[]
  whatsappNumber?: string
  featureCategories?: FeatureCategory[]
}

export function PricingSection({
  enabled = false,
  title,
  description,
  annualDiscount = 20,
  plans,
  whatsappNumber,
  featureCategories = [],
}: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annually')

  if (!enabled || !plans) return null

  const handlePlanSelect = async (planId: string, cycle: BillingCycle, plan: PriceTier) => {
    // Obter o Price ID do Stripe baseado no ciclo
    const priceId = cycle === 'monthly' 
      ? plan.stripePriceIdMonthly 
      : plan.stripePriceIdAnnually

    // Se tiver Price ID configurado, redirecionar para checkout do Stripe
    if (priceId) {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            planId,
            planName: plan.name,
            billingCycle: cycle,
          }),
        })

        const data = await response.json()

        if (data.url) {
          window.location.href = data.url
        } else {
          console.error('Erro ao criar sessão de checkout:', data.error)
          alert('Erro ao processar pagamento. Tente novamente.')
        }
      } catch (error) {
        console.error('Erro ao criar sessão de checkout:', error)
        alert('Erro ao processar pagamento. Tente novamente.')
      }
    } else {
      // Fallback: redirecionar para página de login/cadastro se não tiver Stripe configurado
      window.location.href = `/login?plan=${planId}&cycle=${cycle}`
    }
  }

  return (
    <section id="pricing-section" className="py-16 md:py-24 px-4 bg-[#F5F1E8]">
      <FadeInElement>
        <PricingComponent
          plans={plans}
          billingCycle={billingCycle}
          onCycleChange={setBillingCycle}
          onPlanSelect={handlePlanSelect}
          title={title}
          description={description}
          annualDiscountPercent={annualDiscount}
          featureCategories={featureCategories}
        />
      </FadeInElement>
    </section>
  )
}

