'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { VideoUploader } from '@/components/ui/VideoUploader'
import { BenefitsManager } from '@/components/ui/BenefitsManager'
import { GiftsManager } from '@/components/ui/GiftsManager'
import { AlternateContentManager } from '@/components/ui/AlternateContentManager'
import { createClient } from '@/lib/supabase/client'
import { Save, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation'
import { getSiteSettings, saveSiteSettings } from '@/lib/supabase/site-settings-helper'
import { SectionWrapper } from '@/components/editor/section-wrapper'
import { ServiceDetailContent } from '@/types/service-detail'

// Mapeamento de seções
const sectionIcons: Record<string, string> = {
  hero: '🎥',
  benefits: '📋',
  gifts: '🎁',
  alternate: '🔄',
  about: '👥',
  testimonials: '💬',
  cta: '📞',
}

const sectionLabels: Record<string, string> = {
  hero: 'Hero com Vídeo',
  benefits: 'O que você receberá',
  gifts: 'Ganhe esses presentes',
  alternate: 'Conteúdo Alternado',
  about: 'Quem somos nós',
  testimonials: 'Depoimentos',
  cta: 'CTA Final',
}

export default function ServiceDetailLayoutPage() {
  const router = useRouter()
  const { isAuthenticated, isEditor, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>('hero')
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'hero',
    'benefits',
    'gifts',
    'alternate',
    'about',
    'testimonials',
    'cta',
  ])
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
    hero: true,
    benefits: true,
    gifts: true,
    alternate: true,
    about: true,
    testimonials: true,
    cta: true,
  })
  const [formData, setFormData] = useState<ServiceDetailContent>({
    hero_enabled: true,
    hero_video_url: '',
    hero_video_autoplay: false,
    hero_title: '',
    hero_title_highlight: '',
    hero_title_highlight_color: '#FFFFFF',
    hero_subtitle: '',

    benefits_enabled: true,
    benefits_title: 'O que você receberá dentro da MV Company',
    benefits_items: [],

    gifts_enabled: true,
    gifts_title: 'Ganhe esses presentes entrando agora',
    gifts_items: [],

    alternate_content_enabled: true,
    alternate_content_items: [],

    about_enabled: true,
    about_title: 'Quem somos nós',
    about_image: '',
    about_text: '',

    testimonials_enabled: true,
    testimonials_title: 'Todos os dias recebemos esse tipo de depoimentos',
    testimonials_stats: 'Mais de 60 clientes satisfeitos',

    cta_enabled: true,
    cta_title: 'Entenda mais e entre em contato conosco',
    cta_description: 'Inicie seu planejamento hoje mesmo',
    cta_whatsapp_enabled: true,
    cta_whatsapp_number: '',
    cta_email_enabled: true,
    cta_email_address: '',
    cta_instagram_enabled: true,
    cta_instagram_url: '',
  })

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isEditor)) {
      router.push('/dashboard')
    } else if (!authLoading && isAuthenticated && isEditor) {
      loadLayoutSettings()
    }
  }, [isAuthenticated, isEditor, authLoading, router])

  const loadLayoutSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await getSiteSettings()

      if (error) {
        console.error('Erro ao carregar configurações do layout:', error)
        toast.error('Erro ao carregar configurações do layout.')
        return
      }

      if (data?.service_detail_layout) {
        const layout = data.service_detail_layout as ServiceDetailContent
        setFormData(prev => ({ ...prev, ...layout }))
        
        // Carregar ordem e visibilidade se existirem
        if (layout.section_order) {
          setSectionOrder(layout.section_order)
        }
        if (layout.section_visibility) {
          setSectionVisibility(layout.section_visibility)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do layout:', error)
      toast.error('Erro ao carregar configurações do layout.')
    } finally {
      setLoading(false)
    }
  }

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sectionOrder.indexOf(sectionId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= sectionOrder.length) return

    const newOrder = [...sectionOrder]
    const [removed] = newOrder.splice(currentIndex, 1)
    newOrder.splice(newIndex, 0, removed)
    
    setSectionOrder(newOrder)
    toast.success(`Seção movida ${direction === 'up' ? 'para cima' : 'para baixo'}!`)
  }

  const toggleSectionVisibility = (section: string) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
    
    // Atualizar também o enabled do formData
    const enabledKey = `${section}_enabled` as keyof ServiceDetailContent
    setFormData(prev => ({
      ...prev,
      [enabledKey]: !sectionVisibility[section]
    }))
    
    toast.success(`Seção ${sectionVisibility[section] ? 'oculta' : 'visível'}!`)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { success, error } = await saveSiteSettings({
        fieldsToUpdate: { 
          service_detail_layout: {
            ...formData,
            section_order: sectionOrder,
            section_visibility: sectionVisibility,
          } as ServiceDetailContent
        },
      })

      if (!success) {
        console.error('Erro ao salvar configurações do layout:', error)
        toast.error(error?.message || 'Erro ao salvar configurações do layout.')
        return
      }

      toast.success('Configurações do layout salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações do layout:', error)
      toast.error('Erro ao salvar configurações do layout.')
    } finally {
      setSaving(false)
    }
  }

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          <div className="space-y-4">
            <Switch
              label="Habilitar Seção Hero com Vídeo"
              checked={formData.hero_enabled ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, hero_enabled: checked })}
            />
            {formData.hero_enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">URL do Vídeo</label>
                  <VideoUploader
                    value={formData.hero_video_url || ''}
                    onChange={(url) => setFormData({ ...formData, hero_video_url: url })}
                    placeholder="URL do vídeo ou upload"
                  />
                </div>
                <Switch
                  label="Auto-play do vídeo (reproduzir automaticamente)"
                  checked={formData.hero_video_autoplay ?? false}
                  onCheckedChange={(checked) => setFormData({ ...formData, hero_video_autoplay: checked })}
                />
                <Input
                  label="Título Principal"
                  value={formData.hero_title || ''}
                  onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                  placeholder="Ex: Aprenda esses 2 ajustes..."
                />
                <Input
                  label="Palavra para Destacar (dentro do título)"
                  value={formData.hero_title_highlight || ''}
                  onChange={(e) => setFormData({ ...formData, hero_title_highlight: e.target.value })}
                  placeholder="Ex: preguiçosos"
                />
                <div className="flex items-center gap-4">
                  <Input
                    label="Cor da Palavra Destacada"
                    value={formData.hero_title_highlight_color || '#FFFFFF'}
                    onChange={(e) => setFormData({ ...formData, hero_title_highlight_color: e.target.value })}
                    type="color"
                    className="w-24 h-12"
                  />
                  <div className="flex-1">
                    <Input
                      label=""
                      value={formData.hero_title_highlight_color || '#FFFFFF'}
                      onChange={(e) => setFormData({ ...formData, hero_title_highlight_color: e.target.value })}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtítulo</label>
                  <textarea
                    value={formData.hero_subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                    placeholder="Subtítulo descritivo..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        )

      case 'benefits':
        return (
          <div className="space-y-4">
            <Switch
              label="Habilitar Seção 'O que você receberá'"
              checked={formData.benefits_enabled ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, benefits_enabled: checked })}
            />
            {formData.benefits_enabled && (
              <>
                <Input
                  label="Título da Seção"
                  value={formData.benefits_title || ''}
                  onChange={(e) => setFormData({ ...formData, benefits_title: e.target.value })}
                  placeholder="Ex: O que você receberá dentro da MV Company"
                />
                <BenefitsManager
                  value={formData.benefits_items || []}
                  onChange={(items) => setFormData({ ...formData, benefits_items: items })}
                />
              </>
            )}
          </div>
        )

      case 'gifts':
        return (
          <div className="space-y-4">
            <Switch
              label="Habilitar Seção 'Ganhe esses presentes'"
              checked={formData.gifts_enabled ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, gifts_enabled: checked })}
            />
            {formData.gifts_enabled && (
              <>
                <Input
                  label="Título da Seção"
                  value={formData.gifts_title || ''}
                  onChange={(e) => setFormData({ ...formData, gifts_title: e.target.value })}
                  placeholder="Ex: Ganhe esses presentes entrando agora"
                />
                <GiftsManager
                  value={formData.gifts_items || []}
                  onChange={(items) => setFormData({ ...formData, gifts_items: items })}
                />
              </>
            )}
          </div>
        )

      case 'alternate':
        return (
          <div className="space-y-4">
            <Switch
              label="Habilitar Conteúdo Alternado"
              checked={formData.alternate_content_enabled ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, alternate_content_enabled: checked })}
            />
            {formData.alternate_content_enabled && (
              <AlternateContentManager
                value={formData.alternate_content_items || []}
                onChange={(items) => setFormData({ ...formData, alternate_content_items: items })}
              />
            )}
          </div>
        )

      case 'about':
        return (
          <div className="space-y-4">
            <Switch
              label="Habilitar Seção 'Quem somos nós'"
              checked={formData.about_enabled ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, about_enabled: checked })}
            />
            {formData.about_enabled && (
              <>
                <Input
                  label="Título da Seção"
                  value={formData.about_title || ''}
                  onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                  placeholder="Ex: Quem somos nós"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Foto dos Donos (PNG transparente recomendado)</label>
                  <ImageUploader
                    value={formData.about_image || ''}
                    onChange={(url) => setFormData({ ...formData, about_image: url })}
                    placeholder="Upload de foto"
                    cropType="square"
                    aspectRatio={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Texto sobre a empresa</label>
                  <textarea
                    value={formData.about_text || ''}
                    onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                    placeholder="Texto sobre a empresa..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        )

      case 'testimonials':
        return (
          <div className="space-y-4">
            <Switch
              label="Habilitar Seção Depoimentos"
              checked={formData.testimonials_enabled ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, testimonials_enabled: checked })}
            />
            {formData.testimonials_enabled && (
              <>
                <Input
                  label="Título da Seção"
                  value={formData.testimonials_title || ''}
                  onChange={(e) => setFormData({ ...formData, testimonials_title: e.target.value })}
                  placeholder="Ex: Todos os dias recebemos esse tipo de depoimentos"
                />
                <Input
                  label="Estatística (ex: Mais de 60 clientes satisfeitos)"
                  value={formData.testimonials_stats || ''}
                  onChange={(e) => setFormData({ ...formData, testimonials_stats: e.target.value })}
                  placeholder="Ex: Mais de 60 clientes satisfeitos"
                />
                <p className="text-sm text-gray-500">
                  Os depoimentos são gerenciados na seção "Avaliações" do dashboard.
                </p>
              </>
            )}
          </div>
        )

      case 'cta':
        return (
          <div className="space-y-4">
            <Switch
              label="Habilitar CTA Final"
              checked={formData.cta_enabled ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, cta_enabled: checked })}
            />
            {formData.cta_enabled && (
              <>
                <Input
                  label="Título do CTA"
                  value={formData.cta_title || ''}
                  onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
                  placeholder="Ex: Entenda mais e entre em contato conosco"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    value={formData.cta_description || ''}
                    onChange={(e) => setFormData({ ...formData, cta_description: e.target.value })}
                    placeholder="Ex: Inicie seu planejamento hoje mesmo"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                  <h3 className="font-semibold">Contatos</h3>
                  <Switch
                    label="Habilitar WhatsApp"
                    checked={formData.cta_whatsapp_enabled ?? true}
                    onCheckedChange={(checked) => setFormData({ ...formData, cta_whatsapp_enabled: checked })}
                  />
                  {formData.cta_whatsapp_enabled && (
                    <Input
                      label="Número do WhatsApp (com DDD, ex: 5534984136291)"
                      value={formData.cta_whatsapp_number || ''}
                      onChange={(e) => setFormData({ ...formData, cta_whatsapp_number: e.target.value })}
                      placeholder="Ex: 5534984136291"
                    />
                  )}
                  <Switch
                    label="Habilitar E-mail"
                    checked={formData.cta_email_enabled ?? true}
                    onCheckedChange={(checked) => setFormData({ ...formData, cta_email_enabled: checked })}
                  />
                  {formData.cta_email_enabled && (
                    <Input
                      label="Endereço de E-mail"
                      value={formData.cta_email_address || ''}
                      onChange={(e) => setFormData({ ...formData, cta_email_address: e.target.value })}
                      placeholder="Ex: contato@mvcompany.com.br"
                    />
                  )}
                  <Switch
                    label="Habilitar Instagram"
                    checked={formData.cta_instagram_enabled ?? true}
                    onCheckedChange={(checked) => setFormData({ ...formData, cta_instagram_enabled: checked })}
                  />
                  {formData.cta_instagram_enabled && (
                    <Input
                      label="URL do Instagram"
                      value={formData.cta_instagram_url || ''}
                      onChange={(e) => setFormData({ ...formData, cta_instagram_url: e.target.value })}
                      placeholder="Ex: https://instagram.com/mvcompany"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        )

      default:
        return <div className="text-gray-500 text-center py-4">Conteúdo da seção {sectionId}</div>
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardNavigation
          title="Layout de Página Detalhada"
          subtitle="Configure o layout e seções das páginas de detalhes dos serviços"
          backUrl="/dashboard"
          backLabel="Voltar ao Dashboard"
          actions={
            <div className="flex gap-3">
              <Link href="/portfolio" target="_blank">
                <Button variant="outline" size="lg">
                  <Eye size={18} className="mr-2" />
                  Ver Preview
                </Button>
              </Link>
              <Button onClick={handleSave} isLoading={saving} size="lg">
                <Save size={18} className="mr-2" />
                Salvar Alterações
              </Button>
            </div>
          }
        />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Editor Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Seções da Página</h2>
              </div>
              
              {/* Dica */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Use as setas ↑↓ para reordenar. 
                  Clique no 👁️ para ocultar/mostrar. 
                  Clique na seção para expandir e editar.
                </p>
              </div>

              {/* Seções */}
              {sectionOrder.map((sectionId, index) => (
                <SectionWrapper
                  key={sectionId}
                  section={sectionId}
                  icon={sectionIcons[sectionId] || '📄'}
                  title={sectionLabels[sectionId] || sectionId}
                  expandedSection={expandedSection}
                  setExpandedSection={setExpandedSection}
                  index={index}
                  toggleSectionVisibility={toggleSectionVisibility}
                  isVisible={sectionVisibility[sectionId] ?? true}
                  moveSection={moveSection}
                  sectionOrder={sectionOrder}
                >
                  {renderSectionContent(sectionId)}
                </SectionWrapper>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold mb-4">Ações</h3>
              <Button onClick={handleSave} isLoading={saving} className="w-full">
                <Save size={18} className="mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
