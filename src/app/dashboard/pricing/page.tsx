'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation'
import { getSiteSettings, saveSiteSettings } from '@/lib/supabase/site-settings-helper'
import { PriceTier, Feature } from '@/components/ui/pricing-card'

interface PricingSettings {
  pricing_enabled?: boolean
  pricing_title?: string
  pricing_description?: string
  pricing_annual_discount?: number
  pricing_plans?: [PriceTier, PriceTier, PriceTier]
  pricing_whatsapp_number?: string
}

export default function PricingEditorPage() {
  const router = useRouter()
  const { isAuthenticated, isEditor, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<PricingSettings>({
    pricing_enabled: false,
    pricing_title: 'Escolha o plano ideal para sua empresa',
    pricing_description: 'Soluções completas de gestão digital para impulsionar seu negócio. Do básico ao enterprise, temos o plano certo para você.',
    pricing_annual_discount: 20,
    pricing_whatsapp_number: '',
    pricing_plans: [
      {
        id: 'basico',
        name: 'Básico',
        description: 'Ideal para pequenas empresas que estão começando sua jornada digital.',
        priceMonthly: 497,
        priceAnnually: 4766,
        isPopular: false,
        buttonLabel: 'Saiba mais',
        features: [
          { name: 'Criação de site institucional', isIncluded: true },
          { name: 'Gestão de redes sociais (3 plataformas)', isIncluded: true },
          { name: 'Criação de conteúdo (8 posts/mês)', isIncluded: true },
          { name: 'Relatórios mensais básicos', isIncluded: true },
          { name: 'Suporte por e-mail', isIncluded: true },
          { name: 'Tráfego pago', isIncluded: false },
          { name: 'Consultoria estratégica', isIncluded: false },
        ],
        whatsappMessageMonthly: 'Olá! Tenho interesse no plano Básico mensal. Gostaria de saber mais informações.',
        whatsappMessageAnnually: 'Olá! Tenho interesse no plano Básico anual. Gostaria de saber mais informações.',
      },
      {
        id: 'profissional',
        name: 'Profissional',
        description: 'Perfeito para empresas em crescimento que precisam de uma presença digital completa.',
        priceMonthly: 997,
        priceAnnually: 9565,
        isPopular: true,
        buttonLabel: 'Como iniciar',
        features: [
          { name: 'Criação de site institucional', isIncluded: true },
          { name: 'Gestão de redes sociais (5 plataformas)', isIncluded: true },
          { name: 'Criação de conteúdo (16 posts/mês)', isIncluded: true },
          { name: 'Tráfego pago (até R$ 1.000/mês)', isIncluded: true },
          { name: 'Relatórios mensais detalhados', isIncluded: true },
          { name: 'Suporte prioritário WhatsApp', isIncluded: true },
          { name: 'Consultoria estratégica mensal', isIncluded: true },
          { name: 'E-mail marketing', isIncluded: false },
        ],
        whatsappMessageMonthly: 'Olá! Tenho interesse no plano Profissional mensal. Gostaria de saber como iniciar.',
        whatsappMessageAnnually: 'Olá! Tenho interesse no plano Profissional anual. Gostaria de saber como iniciar.',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Solução completa para grandes empresas que precisam de máxima performance e suporte dedicado.',
        priceMonthly: 2497,
        priceAnnually: 23965,
        isPopular: false,
        buttonLabel: 'Saiba mais',
        features: [
          { name: 'Criação de site institucional + e-commerce', isIncluded: true },
          { name: 'Gestão de redes sociais (ilimitado)', isIncluded: true },
          { name: 'Criação de conteúdo (ilimitado)', isIncluded: true },
          { name: 'Tráfego pago (até R$ 5.000/mês)', isIncluded: true },
          { name: 'Relatórios semanais detalhados', isIncluded: true },
          { name: 'Suporte 24/7 dedicado', isIncluded: true },
          { name: 'Consultoria estratégica semanal', isIncluded: true },
          { name: 'E-mail marketing completo', isIncluded: true },
          { name: 'Gerente de conta dedicado', isIncluded: true },
        ],
        whatsappMessageMonthly: 'Olá! Tenho interesse no plano Enterprise mensal. Gostaria de agendar uma conversa.',
        whatsappMessageAnnually: 'Olá! Tenho interesse no plano Enterprise anual. Gostaria de agendar uma conversa.',
      },
    ],
  })

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !isEditor) {
        router.push('/dashboard')
      } else {
        loadSettings()
      }
    }
  }, [isAuthenticated, isEditor, authLoading, router])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await getSiteSettings()

      if (error) {
        console.error('Erro ao carregar configurações:', error)
        toast.error('Erro ao carregar configurações de pricing.')
        return
      }

      if (data?.homepage_content?.pricing) {
        const pricing = data.homepage_content.pricing
        setFormData(prev => ({
          ...prev,
          ...pricing,
          pricing_plans: pricing.pricing_plans || prev.pricing_plans,
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações de pricing.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: currentData } = await getSiteSettings()
      const currentHomepageContent = currentData?.homepage_content || {}

      const { success, error } = await saveSiteSettings({
        fieldsToUpdate: {
          homepage_content: {
            ...currentHomepageContent,
            pricing: formData,
          },
        },
      })

      if (!success) {
        console.error('Erro ao salvar configurações:', error)
        toast.error(error?.message || 'Erro ao salvar configurações de pricing.')
        return
      }

      toast.success('Configurações de pricing salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações de pricing.')
    } finally {
      setSaving(false)
    }
  }

  const updatePlan = (index: number, field: keyof PriceTier, value: any) => {
    if (!formData.pricing_plans) return
    
    const newPlans = [...formData.pricing_plans] as [PriceTier, PriceTier, PriceTier]
    newPlans[index] = { ...newPlans[index], [field]: value }
    setFormData({ ...formData, pricing_plans: newPlans })
  }

  const updateFeature = (planIndex: number, featureIndex: number, field: keyof Feature, value: any) => {
    if (!formData.pricing_plans) return
    
    const newPlans = [...formData.pricing_plans] as [PriceTier, PriceTier, PriceTier]
    const newFeatures = [...newPlans[planIndex].features]
    newFeatures[featureIndex] = { ...newFeatures[featureIndex], [field]: value }
    newPlans[planIndex] = { ...newPlans[planIndex], features: newFeatures }
    setFormData({ ...formData, pricing_plans: newPlans })
  }

  const addFeature = (planIndex: number) => {
    if (!formData.pricing_plans) return
    
    const newPlans = [...formData.pricing_plans] as [PriceTier, PriceTier, PriceTier]
    newPlans[planIndex].features.push({ name: '', isIncluded: true })
    setFormData({ ...formData, pricing_plans: newPlans })
  }

  const removeFeature = (planIndex: number, featureIndex: number) => {
    if (!formData.pricing_plans) return
    
    const newPlans = [...formData.pricing_plans] as [PriceTier, PriceTier, PriceTier]
    newPlans[planIndex].features.splice(featureIndex, 1)
    setFormData({ ...formData, pricing_plans: newPlans })
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
          title="Gerenciar Planos de Assinatura"
          subtitle="Configure os planos mensais e anuais de assinatura"
          backUrl="/dashboard"
          backLabel="Voltar ao Dashboard"
          actions={
            <Button onClick={handleSave} isLoading={saving} size="lg">
              <Save size={18} className="mr-2" />
              Salvar Alterações
            </Button>
          }
        />

        <div className="mt-8 space-y-6">
          {/* Configurações Gerais */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">Configurações Gerais</h2>
            <div className="space-y-4">
              <Switch
                label="Habilitar Seção de Pricing"
                checked={formData.pricing_enabled ?? false}
                onCheckedChange={(checked) => setFormData({ ...formData, pricing_enabled: checked })}
              />
              {formData.pricing_enabled && (
                <>
                  <Input
                    label="Título"
                    value={formData.pricing_title || ''}
                    onChange={(e) => setFormData({ ...formData, pricing_title: e.target.value })}
                    placeholder="Ex: Escolha o plano ideal para sua empresa"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      value={formData.pricing_description || ''}
                      onChange={(e) => setFormData({ ...formData, pricing_description: e.target.value })}
                      placeholder="Ex: Soluções completas de gestão digital para impulsionar seu negócio..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Input
                    label="Percentual de Desconto Anual (%)"
                    value={formData.pricing_annual_discount?.toString() || '20'}
                    onChange={(e) => setFormData({ ...formData, pricing_annual_discount: parseInt(e.target.value) || 20 })}
                    type="number"
                    min="0"
                    max="100"
                  />
                  <Input
                    label="Número do WhatsApp para Redirecionamento"
                    value={formData.pricing_whatsapp_number || ''}
                    onChange={(e) => setFormData({ ...formData, pricing_whatsapp_number: e.target.value })}
                    placeholder="Ex: 5534984136291"
                  />
                </>
              )}
            </div>
          </div>

          {/* Planos */}
          {formData.pricing_enabled && formData.pricing_plans && (
            <div className="space-y-6">
              {formData.pricing_plans.map((plan, planIndex) => (
                <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold mb-4">Plano {planIndex + 1}: {plan.name}</h3>
                  
                  <div className="space-y-4">
                    <Input
                      label="Nome do Plano"
                      value={plan.name}
                      onChange={(e) => updatePlan(planIndex, 'name', e.target.value)}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Descrição</label>
                      <textarea
                        value={plan.description}
                        onChange={(e) => updatePlan(planIndex, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Preço Mensal (R$)"
                        value={plan.priceMonthly.toString()}
                        onChange={(e) => updatePlan(planIndex, 'priceMonthly', parseFloat(e.target.value) || 0)}
                        type="number"
                        min="0"
                      />
                      <Input
                        label="Preço Anual (R$)"
                        value={plan.priceAnnually.toString()}
                        onChange={(e) => updatePlan(planIndex, 'priceAnnually', parseFloat(e.target.value) || 0)}
                        type="number"
                        min="0"
                      />
                    </div>
                    <Switch
                      label="Marcar como 'Most Popular'"
                      checked={plan.isPopular}
                      onCheckedChange={(checked) => updatePlan(planIndex, 'isPopular', checked)}
                    />
                    <Input
                      label="Texto do Botão"
                      value={plan.buttonLabel}
                      onChange={(e) => updatePlan(planIndex, 'buttonLabel', e.target.value)}
                    />
                    
                    {/* Mensagens WhatsApp */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-3">Mensagens WhatsApp</h4>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mensagem para Plano Mensal</label>
                        <textarea
                          value={plan.whatsappMessageMonthly || ''}
                          onChange={(e) => updatePlan(planIndex, 'whatsappMessageMonthly', e.target.value)}
                          placeholder="Mensagem que será enviada ao clicar no botão do plano mensal"
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium mb-2">Mensagem para Plano Anual</label>
                        <textarea
                          value={plan.whatsappMessageAnnually || ''}
                          onChange={(e) => updatePlan(planIndex, 'whatsappMessageAnnually', e.target.value)}
                          placeholder="Mensagem que será enviada ao clicar no botão do plano anual"
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Features */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">Recursos (Features)</h4>
                        <Button
                          onClick={() => addFeature(planIndex)}
                          variant="outline"
                          size="sm"
                        >
                          + Adicionar Recurso
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-3 items-start">
                            <Input
                              value={feature.name}
                              onChange={(e) => updateFeature(planIndex, featureIndex, 'name', e.target.value)}
                              placeholder="Nome do recurso"
                              className="flex-1"
                            />
                            <Switch
                              checked={feature.isIncluded}
                              onCheckedChange={(checked) => updateFeature(planIndex, featureIndex, 'isIncluded', checked)}
                            />
                            <Button
                              onClick={() => removeFeature(planIndex, featureIndex)}
                              variant="ghost"
                              size="sm"
                            >
                              Remover
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

