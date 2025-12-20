'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { createClient } from '@/lib/supabase/client'
import { CompanyComparison } from '@/types'
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, GitCompare, Search, Save, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { BackButton } from '@/components/ui/BackButton'
import Image from 'next/image'
import { getSiteSettings, saveSiteSettings } from '@/lib/supabase/site-settings-helper'

export default function ComparadorDashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isEditor, loading: authLoading } = useAuth()
  const [comparisons, setComparisons] = useState<CompanyComparison[]>([])
  const [filteredComparisons, setFilteredComparisons] = useState<CompanyComparison[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [footerExpanded, setFooterExpanded] = useState(false)
  const [savingFooter, setSavingFooter] = useState(false)
  const [footerContent, setFooterContent] = useState({
    title: 'Pronto para trabalhar com a MV Company?',
    subtitle: 'Entre em contato e descubra como podemos transformar seu negócio',
    whatsapp_enabled: true,
    whatsapp_number: '',
    whatsapp_text: 'WhatsApp',
    email_enabled: true,
    email_address: '',
    email_text: 'E-mail',
    instagram_enabled: true,
    instagram_url: '',
    instagram_text: 'Instagram',
  })

  const supabase = createClient()

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !isEditor) {
        router.push('/dashboard')
      } else {
        loadComparisons()
        loadFooterContent()
      }
    }
  }, [isAuthenticated, isEditor, authLoading, router])

  const loadFooterContent = async () => {
    try {
      const { data, error } = await getSiteSettings()
      if (error) {
        console.error('Erro ao carregar rodapé:', error)
        return
      }
      if (data?.comparison_footer) {
        setFooterContent(prev => ({ ...prev, ...data.comparison_footer }))
      }
    } catch (error) {
      console.error('Erro ao carregar rodapé:', error)
    }
  }

  const handleSaveFooter = async () => {
    setSavingFooter(true)
    try {
      const { success, error } = await saveSiteSettings({
        fieldsToUpdate: {
          comparison_footer: footerContent,
        },
      })

      if (!success) {
        toast.error(error?.message || 'Erro ao salvar rodapé')
        return
      }

      toast.success('Rodapé salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar rodapé:', error)
      toast.error('Erro ao salvar rodapé')
    } finally {
      setSavingFooter(false)
    }
  }

  // Recarregar quando a página receber foco
  useEffect(() => {
    if (!isAuthenticated || !isEditor) return
    
    const handleFocus = () => {
      loadComparisons()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated, isEditor]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadComparisons = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('company_comparisons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setComparisons(data as CompanyComparison[] || [])
    } catch (error) {
      console.error('Erro ao carregar comparações:', error)
      toast.error('Erro ao carregar comparações')
    } finally {
      setLoading(false)
    }
  }

  const toggleComparisonStatus = async (comparisonId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('company_comparisons')
        .update({ is_active: !currentStatus })
        .eq('id', comparisonId)

      if (error) throw error

      toast.success('Status atualizado')
      loadComparisons()
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const deleteComparison = async (comparisonId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta comparação?')) return

    try {
      const { error } = await supabase
        .from('company_comparisons')
        .delete()
        .eq('id', comparisonId)

      if (error) throw error

      toast.success('Comparação excluída')
      loadComparisons()
    } catch (error) {
      toast.error('Erro ao excluir comparação')
    }
  }

  // Filter comparisons
  useEffect(() => {
    let filtered = comparisons

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(comparison =>
        comparison.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comparison.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(comparison =>
        statusFilter === 'active' ? comparison.is_active : !comparison.is_active
      )
    }

    setFilteredComparisons(filtered)
    setCurrentPage(1)
  }, [comparisons, searchTerm, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredComparisons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedComparisons = filteredComparisons.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getTopicsCount = (comparison: CompanyComparison) => {
    if (Array.isArray(comparison.comparison_topics)) {
      return comparison.comparison_topics.length
    }
    return 0
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <BackButton href="/dashboard" />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Comparador de Empresas</h1>
            <p className="text-gray-600">Gerencie comparações entre MV Company e outras empresas</p>
          </div>
          <div className="flex gap-3">
            <Link href="/comparar?preview=true" target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye size={18} />
                Ver Preview
              </Button>
            </Link>
            <Link href="/comparar" target="_blank">
              <Button variant="outline" className="flex items-center gap-2">
                <GitCompare size={18} />
                Ver Comparador Público
              </Button>
            </Link>
            <Link href="/dashboard/comparador/novo">
              <Button className="flex items-center gap-2">
                <Plus size={20} />
                Nova Comparação
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer Editor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <button
            onClick={() => setFooterExpanded(!footerExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Rodapé do Comparador</h2>
              <span className="text-sm text-gray-500">(Editar textos e links de contato)</span>
            </div>
            {footerExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {footerExpanded && (
            <div className="p-6 border-t border-gray-200 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Título do Rodapé"
                  value={footerContent.title}
                  onChange={(e) => setFooterContent({ ...footerContent, title: e.target.value })}
                  placeholder="Ex: Pronto para trabalhar com a MV Company?"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Subtítulo</label>
                  <textarea
                    value={footerContent.subtitle}
                    onChange={(e) => setFooterContent({ ...footerContent, subtitle: e.target.value })}
                    placeholder="Ex: Entre em contato e descubra como podemos transformar seu negócio"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold mb-4">Contatos</h3>
                <div className="space-y-4">
                  {/* WhatsApp */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <Switch
                      label="Habilitar WhatsApp"
                      checked={footerContent.whatsapp_enabled}
                      onCheckedChange={(checked) => setFooterContent({ ...footerContent, whatsapp_enabled: checked })}
                    />
                    {footerContent.whatsapp_enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          label="Número do WhatsApp (com DDD, ex: 5534984136291)"
                          value={footerContent.whatsapp_number}
                          onChange={(e) => setFooterContent({ ...footerContent, whatsapp_number: e.target.value })}
                          placeholder="Ex: 5534984136291"
                        />
                        <Input
                          label="Texto do Botão"
                          value={footerContent.whatsapp_text}
                          onChange={(e) => setFooterContent({ ...footerContent, whatsapp_text: e.target.value })}
                          placeholder="Ex: WhatsApp"
                        />
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <Switch
                      label="Habilitar E-mail"
                      checked={footerContent.email_enabled}
                      onCheckedChange={(checked) => setFooterContent({ ...footerContent, email_enabled: checked })}
                    />
                    {footerContent.email_enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          label="Endereço de E-mail"
                          value={footerContent.email_address}
                          onChange={(e) => setFooterContent({ ...footerContent, email_address: e.target.value })}
                          placeholder="Ex: contato@mvcompany.com.br"
                        />
                        <Input
                          label="Texto do Botão"
                          value={footerContent.email_text}
                          onChange={(e) => setFooterContent({ ...footerContent, email_text: e.target.value })}
                          placeholder="Ex: E-mail"
                        />
                      </div>
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <Switch
                      label="Habilitar Instagram"
                      checked={footerContent.instagram_enabled}
                      onCheckedChange={(checked) => setFooterContent({ ...footerContent, instagram_enabled: checked })}
                    />
                    {footerContent.instagram_enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          label="URL do Instagram"
                          value={footerContent.instagram_url}
                          onChange={(e) => setFooterContent({ ...footerContent, instagram_url: e.target.value })}
                          placeholder="Ex: https://instagram.com/mvcompany"
                        />
                        <Input
                          label="Texto do Botão"
                          value={footerContent.instagram_text}
                          onChange={(e) => setFooterContent({ ...footerContent, instagram_text: e.target.value })}
                          placeholder="Ex: Instagram"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button onClick={handleSaveFooter} isLoading={savingFooter}>
                  <Save size={18} className="mr-2" />
                  Salvar Rodapé
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar comparações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comparisons List */}
        {paginatedComparisons.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Nenhuma comparação encontrada com os filtros aplicados'
                : 'Nenhuma comparação cadastrada ainda'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link href="/dashboard/comparador/novo">
                <Button className="mt-4">
                  <Plus size={20} className="mr-2" />
                  Criar Primeira Comparação
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {paginatedComparisons.map((comparison) => (
                <div
                  key={comparison.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {comparison.name}
                      </h3>
                      <p className="text-sm text-gray-500">/{comparison.slug}</p>
                    </div>
                    <button
                      onClick={() => toggleComparisonStatus(comparison.id, comparison.is_active)}
                      className={`p-1 rounded ${
                        comparison.is_active
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {comparison.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  {comparison.logo && (
                    <div className="relative w-full h-20 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={comparison.logo}
                        alt={comparison.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  {comparison.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {comparison.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      {getTopicsCount(comparison)} tópicos
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/comparador/${comparison.id}`}>
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Edit size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteComparison(comparison.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredComparisons.length)} de {filteredComparisons.length} comparações
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        currentPage === page
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
