'use client'

import { useAuth } from '@/contexts/AuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAdminPermissions } from '@/components/ProtectedAdminRoute'
import { AdminDashboardContent } from '@/components/admin/AdminDashboard'
import { UserDashboardContent } from '@/components/UserDashboard'

function DashboardContent() {
  const { isAdmin, loading } = useAdminPermissions()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    )
  }

  return isAdmin ? <AdminDashboardContent /> : <UserDashboardContent />
}

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <DashboardContent />
    </ProtectedRoute>
  )
}