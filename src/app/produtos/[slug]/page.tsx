import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

// Redirecionar página antiga de produto para portfolio se existir serviço equivalente
export default async function ProdutoPage({ params }: { params: { slug: string } }) {
  try {
    const supabase = createServerClient()
    
    // Tentar encontrar serviço com mesmo slug
    const { data: service } = await supabase
      .from('services')
      .select('slug')
      .eq('slug', params.slug)
      .eq('is_active', true)
      .maybeSingle()

    if (service) {
      redirect(`/portfolio/${service.slug}`)
    }
  } catch (error) {
    console.error('Erro ao verificar serviço:', error)
  }

  // Se não encontrar, redirecionar para homepage
  redirect('/')
}
