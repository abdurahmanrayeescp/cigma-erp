import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-navy-950">
        <Loader2 className="w-10 h-10 animate-spin text-maroon-600" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a default dashboard if they don't have access to this specific portal
    if (['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return <Navigate to="/portal/admin" replace />
    if (user.role === 'TEACHER') return <Navigate to="/portal/teacher" replace />
    if (user.role === 'PARENT') return <Navigate to="/portal/parent" replace />
    if (user.role === 'STUDENT') return <Navigate to="/portal/student" replace />
    
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
