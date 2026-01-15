import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

// Inicializar Stripe (a chave será configurada nas variáveis de ambiente)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { priceId, planId, planName, billingCycle } = body

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID não fornecido' },
        { status: 400 }
      )
    }

    // Verificar se o usuário está logado
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    // URL base para redirecionamentos
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goghlab.com.br'

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing-section`,
      // Se o usuário estiver logado, preencher o email
      customer_email: user?.email || undefined,
      // Metadados para identificar o plano
      metadata: {
        planId,
        planName,
        billingCycle,
        userId: user?.id || '',
      },
      // Permitir código promocional
      allow_promotion_codes: true,
      // Coletar endereço de cobrança
      billing_address_collection: 'required',
      // Configurações de assinatura
      subscription_data: {
        metadata: {
          planId,
          planName,
          billingCycle,
          userId: user?.id || '',
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erro ao criar sessão de checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar sessão de checkout' },
      { status: 500 }
    )
  }
}

