'use client'

import { useAuth } from '@/contexts/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login', 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        // Redirecionar usuários logados da página de login
        router.push('/simulado')
      }
    }
  }, [user, loading, router, redirectTo, requireAuth])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se requer auth mas não tem usuário, não renderizar nada
  // (o redirect já foi acionado)
  if (requireAuth && !user) {
    return null
  }

  // Se não requer auth mas tem usuário, não renderizar nada
  // (o redirect já foi acionado)
  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}

// Componente de loading personalizado
export function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-lg font-medium text-gray-700">Verificando autenticação...</p>
        <p className="mt-2 text-sm text-gray-500">Aguarde um momento</p>
      </div>
    </div>
  )
}