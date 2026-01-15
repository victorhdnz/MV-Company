'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  BookOpen, 
  Wrench, 
  TrendingUp,
  Crown,
  Calendar,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react'

interface UsageStats {
  ai_messages: { current: number; limit: number | null }
}

interface CourseProgress {
  course_id: string
  course_title: string
  progress: number
  last_watched: string
}

export default function MemberDashboard() {
  const { user, profile, subscription, isPro } = useAuth()
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [recentCourses, setRecentCourses] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        // Buscar uso de mensagens de IA
        const periodStart = new Date()
        periodStart.setDate(1)
        periodStart.setHours(0, 0, 0, 0)

        const { data: usageData } = await supabase
          .from('user_usage')
          .select('feature_key, usage_count')
          .eq('user_id', user.id)
          .eq('feature_key', 'ai_messages')
          .gte('period_start', periodStart.toISOString().split('T')[0])
          .single()

        // Buscar limite do plano
        const limit = subscription?.plan_id === 'gogh_pro' ? 2000 : 500

        setUsageStats({
          ai_messages: {
            current: usageData?.usage_count || 0,
            limit: limit
          }
        })

        // Buscar progresso nos cursos (quando implementado)
        // Por enquanto, dados mockados
        setRecentCourses([])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, subscription])

  // Calcular dias restantes da assinatura
  const daysRemaining = subscription ? 
    Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) 
    : 0

  const quickActions = [
    {
      href: '/membro/agentes',
      title: 'Conversar com IA',
      description: 'Acesse nossos agentes especializados',
      icon: MessageSquare,
      color: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      href: '/membro/cursos',
      title: 'Estudar',
      description: 'Continue seus cursos',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      href: '/membro/ferramentas',
      title: 'Ferramentas',
      description: 'Acesse Canva e CapCut Pro',
      icon: Wrench,
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header de Boas-vindas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gogh-black to-gogh-grayDark rounded-2xl p-6 lg:p-8 text-white overflow-hidden relative"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gogh-yellow rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gogh-yellow rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-gogh-yellow" />
            <span className="text-gogh-yellow text-sm font-medium">
              {isPro ? 'Membro Pro' : 'Membro Essencial'}
            </span>
          </div>
          
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Olá, {profile?.full_name?.split(' ')[0] || 'Criador'}! 👋
          </h1>
          <p className="text-white/70 max-w-xl">
            Bem-vindo à sua área de membros. Aqui você tem acesso a todos os recursos para impulsionar sua criação de conteúdo.
          </p>

          {!isPro && (
            <Link
              href="/membro/upgrade"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gogh-yellow text-gogh-black rounded-lg font-medium hover:bg-gogh-yellow/90 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Fazer Upgrade para Pro
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Uso de IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-gogh-grayLight shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gogh-grayDark">Este mês</span>
          </div>
          <p className="text-sm text-gogh-grayDark mb-1">Mensagens de IA</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gogh-black">
              {usageStats?.ai_messages.current || 0}
            </span>
            <span className="text-sm text-gogh-grayDark">
              / {usageStats?.ai_messages.limit || (isPro ? 2000 : 500)}
            </span>
          </div>
          <div className="mt-3 h-2 bg-gogh-grayLight rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(
                  ((usageStats?.ai_messages.current || 0) / (usageStats?.ai_messages.limit || 500)) * 100, 
                  100
                )}%` 
              }}
            />
          </div>
        </motion.div>

        {/* Status da Assinatura */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 border border-gogh-grayLight shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Ativa
            </span>
          </div>
          <p className="text-sm text-gogh-grayDark mb-1">Sua Assinatura</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gogh-black">
              {subscription?.plan_id === 'gogh_pro' ? 'Gogh Pro' : 'Gogh Essencial'}
            </span>
          </div>
          <p className="mt-2 text-sm text-gogh-grayDark">
            {subscription?.billing_cycle === 'annual' ? 'Plano Anual' : 'Plano Mensal'}
          </p>
        </motion.div>

        {/* Próxima Renovação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 border border-gogh-grayLight shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs text-gogh-grayDark">
              {subscription?.cancel_at_period_end ? 'Cancela em' : 'Renova em'}
            </span>
          </div>
          <p className="text-sm text-gogh-grayDark mb-1">Próxima Cobrança</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gogh-black">{daysRemaining}</span>
            <span className="text-sm text-gogh-grayDark">dias</span>
          </div>
          <p className="mt-2 text-sm text-gogh-grayDark">
            {subscription ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR') : '-'}
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gogh-black mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 4) }}
            >
              <Link
                href={action.href}
                className="group block bg-white rounded-xl p-5 border border-gogh-grayLight shadow-sm hover:shadow-md hover:border-gogh-yellow transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${action.iconBg} rounded-xl group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gogh-black group-hover:text-gogh-yellow transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gogh-grayDark mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gogh-grayDark group-hover:text-gogh-yellow group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recursos do Plano */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 border border-gogh-grayLight shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gogh-black">Recursos do seu Plano</h2>
          {!isPro && (
            <Link
              href="/membro/upgrade"
              className="text-sm text-gogh-yellow hover:underline flex items-center gap-1"
            >
              Ver recursos Pro
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Agentes de IA', included: true },
            { name: 'Cursos Completos', included: true },
            { name: 'Canva Pro', included: true },
            { name: 'CapCut Pro', included: true },
            { name: `${isPro ? '2000' : '500'} msgs/mês`, included: true },
            { name: 'Suporte Prioritário', included: isPro },
            { name: 'Agentes Personalizados', included: isPro },
            { name: 'Cursos Exclusivos', included: isPro },
          ].map((feature, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                feature.included ? 'bg-emerald-50' : 'bg-gray-50'
              }`}
            >
              <CheckCircle2 
                className={`w-4 h-4 ${
                  feature.included ? 'text-emerald-500' : 'text-gray-300'
                }`} 
              />
              <span className={`text-sm ${
                feature.included ? 'text-gogh-black' : 'text-gray-400'
              }`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity / Courses Progress */}
      {recentCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 border border-gogh-grayLight shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gogh-black">Continue Estudando</h2>
            <Link
              href="/membro/cursos"
              className="text-sm text-gogh-yellow hover:underline flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.course_id} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gogh-grayLight rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-gogh-grayDark" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gogh-black">{course.course_title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gogh-grayLight rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gogh-yellow rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gogh-grayDark">{course.progress}%</span>
                  </div>
                </div>
                <Link
                  href={`/membro/cursos/${course.course_id}`}
                  className="px-3 py-1.5 bg-gogh-yellow text-gogh-black text-sm font-medium rounded-lg hover:bg-gogh-yellow/80 transition-colors"
                >
                  Continuar
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

