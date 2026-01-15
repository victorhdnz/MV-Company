'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Crown, 
  Sparkles, 
  ArrowRight,
  MessageSquare,
  BookOpen,
  Palette,
  Scissors,
  Zap
} from 'lucide-react'

export default function SubscribePage() {
  const { user, hasActiveSubscription, loading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  // Se já tem assinatura, redirecionar para o dashboard
  useEffect(() => {
    if (!loading && hasActiveSubscription) {
      router.push('/membro')
    }
  }, [loading, hasActiveSubscription, router])

  // Redirecionar para checkout do Stripe
  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      router.push('/login?redirect=/membro/assinar')
      return
    }

    setRedirecting(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de checkout não retornada')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      setRedirecting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gogh-beige flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gogh-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gogh-grayDark">Carregando...</p>
        </div>
      </div>
    )
  }

  const plans = [
    {
      id: 'essencial',
      name: 'Gogh Essencial',
      description: 'Perfeito para começar sua jornada de criação de conteúdo',
      monthlyPrice: 'R$ 47',
      annualPrice: 'R$ 37,60',
      annualTotal: 'R$ 451,20/ano',
      monthlyPriceId: 'price_1SpjGIJmSvvqlkSQGIpVMt0H',
      annualPriceId: 'price_1SpjHyJmSvvqlkSQRBubxB7K',
      features: [
        { text: '500 mensagens de IA/mês', included: true },
        { text: 'Todos os agentes básicos', included: true },
        { text: 'Cursos de Canva e CapCut', included: true },
        { text: 'Acesso Canva Pro', included: true },
        { text: 'Acesso CapCut Pro', included: true },
        { text: 'Suporte por chat', included: true },
        { text: 'Suporte prioritário', included: false },
        { text: 'Agentes personalizados', included: false },
        { text: 'Cursos exclusivos Pro', included: false },
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Gogh Pro',
      description: 'Para criadores que querem resultados profissionais',
      monthlyPrice: 'R$ 97',
      annualPrice: 'R$ 77,60',
      annualTotal: 'R$ 931,20/ano',
      monthlyPriceId: 'price_1SpjJIJmSvvqlkSQpBHztwk6',
      annualPriceId: 'price_1SpjKSJmSvvqlkSQlr8jNDTf',
      features: [
        { text: '2000 mensagens de IA/mês', included: true },
        { text: 'Todos os agentes (básicos + premium)', included: true },
        { text: 'Todos os cursos', included: true },
        { text: 'Acesso Canva Pro', included: true },
        { text: 'Acesso CapCut Pro', included: true },
        { text: 'Suporte prioritário 24h', included: true },
        { text: 'Até 3 agentes personalizados', included: true },
        { text: 'Cursos exclusivos Pro', included: true },
        { text: 'Acesso antecipado a novidades', included: true },
      ],
      popular: true
    }
  ]

  return (
    <div className="min-h-[80vh] py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gogh-yellow/20 rounded-full text-gogh-black text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Área de Membros
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-gogh-black mb-4">
            Escolha seu plano
          </h1>
          <p className="text-gogh-grayDark max-w-2xl mx-auto">
            Desbloqueie todo o potencial da Gogh Lab com acesso aos agentes de IA, 
            cursos exclusivos e as melhores ferramentas de criação.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { icon: MessageSquare, label: 'Agentes de IA', color: 'text-purple-600 bg-purple-100' },
            { icon: BookOpen, label: 'Cursos Completos', color: 'text-emerald-600 bg-emerald-100' },
            { icon: Palette, label: 'Canva Pro', color: 'text-pink-600 bg-pink-100' },
            { icon: Scissors, label: 'CapCut Pro', color: 'text-blue-600 bg-blue-100' },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-gogh-grayLight text-center">
              <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gogh-black">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`
                relative bg-white rounded-2xl border-2 overflow-hidden
                ${plan.popular 
                  ? 'border-gogh-yellow shadow-lg shadow-gogh-yellow/20' 
                  : 'border-gogh-grayLight'
                }
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gogh-yellow text-gogh-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MAIS POPULAR
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.popular && <Crown className="w-5 h-5 text-amber-500" />}
                    <h3 className="text-xl font-bold text-gogh-black">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-gogh-grayDark">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-gogh-black">{plan.annualPrice}</span>
                    <span className="text-gogh-grayDark">/mês</span>
                  </div>
                  <p className="text-sm text-gogh-grayDark">
                    {plan.annualTotal} • Economia de 20%
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          feature.included ? 'text-gogh-yellow' : 'text-gray-300'
                        }`} 
                      />
                      <span className={`text-sm ${
                        feature.included ? 'text-gogh-black' : 'text-gray-400 line-through'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleSubscribe(plan.annualPriceId)}
                    disabled={redirecting}
                    className={`
                      w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                      ${plan.popular
                        ? 'bg-gogh-yellow text-gogh-black hover:bg-gogh-yellow/90'
                        : 'bg-gogh-black text-white hover:bg-gogh-black/90'
                      }
                      ${redirecting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {redirecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Redirecionando...
                      </>
                    ) : (
                      <>
                        Assinar Anual
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSubscribe(plan.monthlyPriceId)}
                    disabled={redirecting}
                    className="w-full text-center text-sm text-gogh-grayDark hover:text-gogh-black transition-colors py-2"
                  >
                    ou {plan.monthlyPrice}/mês
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gogh-grayDark mb-4">
            ✓ Cancele quando quiser • ✓ Garantia de 7 dias • ✓ Suporte em português
          </p>
          <Link href="/" className="text-gogh-yellow hover:underline text-sm">
            Voltar para o site
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

