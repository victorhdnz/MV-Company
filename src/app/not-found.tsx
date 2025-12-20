'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'
import { useNotFound } from '@/contexts/NotFoundContext'

export default function NotFound() {
  const { setIsNotFound } = useNotFound()

  useEffect(() => {
    setIsNotFound(true)
    return () => {
      setIsNotFound(false)
    }
  }, [setIsNotFound])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
          <div className="text-6xl mb-4">😕</div>
        </div>

        <h2 className="text-3xl font-bold mb-4">Página Não Encontrada</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>

        <div className="flex justify-center">
          <Link href="/" prefetch={true}>
            <Button size="lg">
              <Home size={20} className="mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

