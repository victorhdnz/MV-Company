'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Crown, 
  Lock, 
  ChevronRight,
  Sparkles,
  Plus,
  Clock
} from 'lucide-react'

interface AIAgent {
  id: string
  slug: string
  name: string
  description: string | null
  avatar_url: string | null
  is_premium: boolean
  is_active: boolean
}

interface Conversation {
  id: string
  agent_id: string
  title: string
  updated_at: string
  agent?: AIAgent
}

export default function AgentsPage() {
  const { user, isPro } = useAuth()
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Buscar agentes ativos
        const { data: agentsData, error: agentsError } = await (supabase as any)
          .from('ai_agents')
          .select('*')
          .eq('is_active', true)
          .order('order_position', { ascending: true })

        if (agentsError) throw agentsError
        setAgents(agentsData || [])

        // Buscar conversas recentes do usuário
        const { data: conversationsData, error: conversationsError } = await (supabase as any)
          .from('ai_conversations')
          .select(`
            id,
            agent_id,
            title,
            updated_at,
            ai_agents (
              id,
              slug,
              name,
              avatar_url
            )
          `)
          .eq('user_id', user.id)
          .eq('is_archived', false)
          .order('updated_at', { ascending: false })
          .limit(10)

        if (conversationsError) throw conversationsError
        
        const formattedConversations = conversationsData?.map((conv: any) => ({
          ...conv,
          agent: conv.ai_agents as unknown as AIAgent
        })) || []
        
        setConversations(formattedConversations)
      } catch (error) {
        console.error('Error fetching agents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Função para iniciar nova conversa
  const startNewConversation = async (agent: AIAgent) => {
    if (!user) return

    // Verificar se é premium e usuário não é Pro
    if (agent.is_premium && !isPro) {
      return // Não permite acesso
    }

    try {
      // Criar nova conversa
      const { data, error } = await (supabase as any)
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          agent_id: agent.id,
          title: `Conversa com ${agent.name}`
        })
        .select()
        .single()

      if (error) throw error

      // Redirecionar para a conversa
      window.location.href = `/membro/agentes/chat/${data.id}`
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  // Agrupar agentes por premium/básico
  const basicAgents = agents.filter(a => !a.is_premium)
  const premiumAgents = agents.filter(a => a.is_premium)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gogh-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gogh-grayDark">Carregando agentes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gogh-black mb-2">
          Agentes de IA
        </h1>
        <p className="text-gogh-grayDark">
          Converse com nossos agentes especializados para impulsionar sua criação de conteúdo.
        </p>
      </div>

      {/* Conversas Recentes */}
      {conversations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gogh-grayLight shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gogh-black flex items-center gap-2">
              <Clock className="w-5 h-5 text-gogh-grayDark" />
              Conversas Recentes
            </h2>
            <Link
              href="/membro/agentes/historico"
              className="text-sm text-gogh-yellow hover:underline"
            >
              Ver todas
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {conversations.slice(0, 6).map((conv) => (
              <Link
                key={conv.id}
                href={`/membro/agentes/chat/${conv.id}`}
                className="flex items-center gap-3 p-3 bg-gogh-grayLight/30 hover:bg-gogh-grayLight rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-gogh-yellow to-amber-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-gogh-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gogh-black truncate text-sm">
                    {conv.title}
                  </p>
                  <p className="text-xs text-gogh-grayDark truncate">
                    {conv.agent?.name || 'Agente'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gogh-grayDark group-hover:text-gogh-yellow transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Agentes Básicos */}
      <div>
        <h2 className="text-lg font-semibold text-gogh-black mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gogh-yellow" />
          Agentes Disponíveis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => startNewConversation(agent)}
                className="w-full text-left bg-white rounded-xl p-5 border border-gogh-grayLight shadow-sm hover:shadow-md hover:border-gogh-yellow transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gogh-yellow to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7 text-gogh-black" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gogh-black group-hover:text-gogh-yellow transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gogh-grayDark mt-1 line-clamp-2">
                      {agent.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gogh-grayDark">Clique para conversar</span>
                  <div className="flex items-center gap-1 text-gogh-yellow text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Nova conversa
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Agentes Premium */}
      {premiumAgents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gogh-black mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Agentes Premium
            {!isPro && (
              <span className="text-xs font-normal text-gogh-grayDark ml-2">
                (Disponível no plano Pro)
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (basicAgents.length + index) * 0.1 }}
              >
                {isPro ? (
                  <button
                    onClick={() => startNewConversation(agent)}
                    className="w-full text-left bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border border-amber-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Crown className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gogh-black group-hover:text-amber-600 transition-colors">
                            {agent.name}
                          </h3>
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Pro
                          </span>
                        </div>
                        <p className="text-sm text-gogh-grayDark mt-1 line-clamp-2">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gogh-grayDark">Agente exclusivo Pro</span>
                      <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                        <Plus className="w-4 h-4" />
                        Nova conversa
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="relative bg-gray-50 rounded-xl p-5 border border-gray-200 opacity-75">
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent rounded-xl" />
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Lock className="w-7 h-7 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-500">
                            {agent.name}
                          </h3>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            Pro
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                      <Link
                        href="/membro/upgrade"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors"
                      >
                        <Crown className="w-4 h-4" />
                        Fazer Upgrade
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {agents.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gogh-grayDark mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gogh-black mb-2">
            Nenhum agente disponível
          </h3>
          <p className="text-gogh-grayDark">
            Os agentes estão sendo configurados. Volte em breve!
          </p>
        </div>
      )}
    </div>
  )
}

