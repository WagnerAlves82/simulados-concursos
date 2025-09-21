import { ProtectedRoute } from '@/components/ProtectedRoute'
import LoginPage from '@/components/LoginPage' 
export default function LoginPageWrapper() {
  return (
    <ProtectedRoute requireAuth={false}>
      <LoginPage />
    </ProtectedRoute>
  )
}