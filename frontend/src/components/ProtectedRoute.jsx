import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Componenta cu dublu rol:
 * - Fără props  → wrapper de rută (folosește <Outlet />)
 * - Cu children → guard de rol (randează copiii sau redirectează)
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />
  }

  return children ?? <Outlet />
}
