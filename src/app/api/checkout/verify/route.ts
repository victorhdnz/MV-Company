import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID não fornecido' },
        { status: 400 }
      )
    }

    // Recuperar a sessão do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      status: session.status,
      paymentStatus: session.payment_status,
      planId: session.metadata?.planId,
      planName: session.metadata?.planName,
      billingCycle: session.metadata?.billingCycle,
      customerEmail: session.customer_email,
    })
  } catch (error: any) {
    console.error('Erro ao verificar sessão:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar sessão' },
      { status: 500 }
    )
  }
}

