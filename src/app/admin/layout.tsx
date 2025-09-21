import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedAdminRoute requiredPermission="canViewAdmin">
      {children}
    </ProtectedAdminRoute>
  )
}