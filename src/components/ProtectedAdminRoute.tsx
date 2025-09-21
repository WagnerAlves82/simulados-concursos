'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { AuthSecurityService, UserPermissions } from '@/lib/authSecurity'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, AlertTriangle, ArrowLeft } from 'lucide-react'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
  requiredPermission?: keyof UserPermissions
  fallback?: React.ReactNode
}

export function ProtectedAdminRoute({ 
  children, 
  requiredPermission = 'canViewAdmin',
  fallback 
}: ProtectedAdminRouteProps) {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    checkAccess()
  }, [user, requiredPermission])

  const checkAccess = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const authService = new AuthSecurityService()
      const userPermissions = await authService.getUserPermissions(user.id)
      
      setPermissions(userPermissions)
      setHasAccess(userPermissions[requiredPermission])
      
      // Log da tentativa de acesso
      await authService.logAction(user.id, 'admin_access_attempt', {
        permission: requiredPermission,
        granted: userPermissions[requiredPermission]
      })
      
    } catch (error) {
      console.error('Erro ao verificar permissões:', error)
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Verificando Permissões</h2>
            <p className="text-gray-600">Validando acesso administrativo...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Não logado
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-600" />
            <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado para acessar esta área.
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full">
                  Fazer Login
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sem permissão
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar esta área administrativa.
            </p>
            
            {permissions && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">Suas Permissões:</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Visualizar Admin:</span>
                    <span className={permissions.canViewAdmin ? 'text-green-600' : 'text-red-600'}>
                      {permissions.canViewAdmin ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Criar Questões:</span>
                    <span className={permissions.canCreateQuestoes ? 'text-green-600' : 'text-red-600'}>
                      {permissions.canCreateQuestoes ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upload em Lote:</span>
                    <span className={permissions.canUploadBulk ? 'text-green-600' : 'text-red-600'}>
                      {permissions.canUploadBulk ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Entre em contato com o administrador para solicitar acesso.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tem acesso - renderizar conteúdo
  return <>{children}</>
}

// Hook para usar em componentes específicos
export function useAdminPermissions() {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<UserPermissions | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      checkPermissions()
    } else {
      setLoading(false)
    }
  }, [user])

  const checkPermissions = async () => {
    if (!user) return

    try {
      const authService = new AuthSecurityService()
      const userPermissions = await authService.getUserPermissions(user.id)
      setPermissions(userPermissions)
    } catch (error) {
      console.error('Erro ao verificar permissões:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions?.[permission] || false
  }

  return {
    permissions,
    loading,
    hasPermission,
    isAdmin: permissions?.canViewAdmin || false
  }
}