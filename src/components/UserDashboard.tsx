'use client'

import { useAuth } from '@/contexts/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function UserDashboardContent() {
  const { user, profile } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bem-vindo, {profile?.nome || user?.email}!</p>
            <p>Aqui você pode acessar seus simulados e estatísticas.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}