'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { createClient } from '@/lib/supabase/client'
import { Save, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { DashboardNavigation } from '@/components/dashboard/DashboardNavigation'
import { getSiteSettings, saveSiteSettings } from '@/lib/supabase/site-settings-helper'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function LoadingLogoPage() {
  const router = useRouter()
  const { isAuthenticated, isEditor, loading: authLoading } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingLogo, setLoadingLogo] = useState<string>('')
  const [loadingEmoji, setLoadingEmoji] = useState<string>('⌚')

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isEditor)) {
      router.push('/dashboard')
    } else if (!authLoading && isAuthenticated && isEditor) {
      loadSettings()
    }
  }, [isAuthenticated, isEditor, authLoading, router])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await getSiteSettings()

      if (error) {
        console.error('Erro ao carregar configurações:', error)
        toast.error('Erro ao carregar configurações.')
        return
      }

      if (data) {
        // Buscar do site_settings direto
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('loading_logo, loading_emoji')
          .eq('key', 'general')
          .maybeSingle()

        if (settingsData) {
          setLoadingLogo(settingsData.loading_logo || '')
          setLoadingEmoji(settingsData.loading_emoji || '⌚')
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      toast.error('Erro ao carregar configurações.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          loading_logo: loadingLogo || null,
          loading_emoji: loadingEmoji || '⌚',
          updated_at: new Date().toISOString(),
        })
        .eq('key', 'general')

      if (error) {
        // Se não existir, criar
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({
            key: 'general',
            loading_logo: loadingLogo || null,
            loading_emoji: loadingEmoji || '⌚',
            description: 'Configurações gerais do site',
          })

        if (insertError) {
          console.error('Erro ao salvar configurações:', insertError)
          toast.error('Erro ao salvar configurações.')
          return
        }
      }

      toast.success('Logo de carregamento salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveLogo = () => {
    setLoadingLogo('')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardNavigation
          title="Logo de Carregamento"
          subtitle="Configure a logo que aparece durante o carregamento das páginas"
          backUrl="/dashboard"
          backLabel="Voltar ao Dashboard"
          actions={
            <Button onClick={handleSave} isLoading={saving} size="lg">
              <Save size={18} className="mr-2" />
              Salvar Alterações
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Upload da Logo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Logo de Carregamento</label>
                <p className="text-sm text-gray-500 mb-4">
                  Faça upload da logo da empresa. Ela aparecerá dentro do círculo de carregamento.
                  Recomendado: logo quadrada ou circular, fundo transparente (PNG).
                </p>
                <ImageUploader
                  value={loadingLogo}
                  onChange={(url) => setLoadingLogo(url)}
                  placeholder="Upload da logo de carregamento"
                  cropType="square"
                  aspectRatio={1}
                  recommendedDimensions="200x200px"
                />
                {loadingLogo && (
                  <button
                    onClick={handleRemoveLogo}
                    className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remover Logo
                  </button>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium mb-2">Emoji de Fallback</label>
                <p className="text-sm text-gray-500 mb-4">
                  Emoji que será usado caso não haja logo configurada.
                </p>
                <input
                  type="text"
                  value={loadingEmoji}
                  onChange={(e) => setLoadingEmoji(e.target.value)}
                  placeholder="⌚"
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-2xl text-center"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Prévia</h2>
            <div className="space-y-8">
              {/* Small Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Tamanho Pequeno</h3>
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                  <LoadingSpinner size="sm" />
                </div>
              </div>

              {/* Medium Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Tamanho Médio</h3>
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                  <LoadingSpinner size="md" />
                </div>
              </div>

              {/* Large Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Tamanho Grande</h3>
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                  <LoadingSpinner size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

