import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  
  // Usar a origem da request para o redirect (mais confiável)
  const origin = requestUrl.origin
  
  if (!code) {
    return NextResponse.redirect(`${origin}/dashboard?error=no_code`)
  }

  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (e) {
            // Ignorar erro de cookie em server component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (e) {
            // Ignorar erro de cookie em server component
          }
        },
      },
    }
  )
  
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    console.error('[Auth Callback] Error:', error.message)
    return NextResponse.redirect(`${origin}/dashboard?error=auth_failed`)
  }

  // Redirect simples para o destino
  return NextResponse.redirect(`${origin}${next}`)
}

