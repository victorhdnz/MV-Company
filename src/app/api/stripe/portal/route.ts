import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Erro de autenticação no portal Stripe:', authError)
      return NextResponse.json({ 
        error: 'Erro de autenticação. Faça login novamente.',
        details: process.env.NODE_ENV === 'development' ? authError.message : undefined
      }, { status: 401 })
    }
    
    if (!user) {
      console.error('Usuário não autenticado no portal Stripe')
      return NextResponse.json({ 
        error: 'Usuário não autenticado. Faça login novamente.' 
      }, { status: 401 })
    }

    // Buscar a assinatura ativa do usuário
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, plan_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (subError) {
      console.error('Erro ao buscar assinatura:', subError)
      return NextResponse.json({ 
        error: 'Erro ao buscar informações da assinatura',
        details: process.env.NODE_ENV === 'development' ? subError.message : undefined
      }, { status: 500 })
    }

    if (!subscription) {
      console.log('Assinatura não encontrada para usuário:', user.id)
      return NextResponse.json({ 
        error: 'Nenhuma assinatura ativa encontrada. Se você tem uma assinatura manual, entre em contato com o suporte.',
        isManual: true
      }, { status: 404 })
    }

    // Se não tem stripe_customer_id, é uma assinatura manual
    // Não pode usar o portal do Stripe
    if (!subscription.stripe_customer_id || subscription.stripe_customer_id.startsWith('manual_') || subscription.stripe_customer_id === null) {
      console.log('Tentativa de acessar portal com assinatura manual:', {
        user_id: user.id,
        subscription_id: subscription.plan_id,
        stripe_customer_id: subscription.stripe_customer_id
      })
      return NextResponse.json({ 
        error: 'Esta assinatura foi criada manualmente e não pode ser gerenciada através do portal do Stripe. Entre em contato com o suporte através do WhatsApp para gerenciar sua assinatura.',
        isManual: true
      }, { status: 400 })
    }

    // Criar sessão do portal de gerenciamento do Stripe
    // Usar a configuração do portal criada no Dashboard
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://goghlab.com.br'}/membro/conta`,
      // Usar a configuração do portal se especificada
      ...(process.env.STRIPE_PORTAL_CONFIGURATION_ID && {
        configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID,
      }),
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error('Erro ao criar sessão do portal:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

