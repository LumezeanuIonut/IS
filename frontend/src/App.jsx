import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardMedic from './pages/DashboardMedic'
import DashboardSupraveghetor from './pages/DashboardSupraveghetor'
import PacientiPage from './pages/PacientiPage'
import NotFoundPage from './pages/NotFoundPage'

// Redirecționează utilizatorul la dashboard-ul specific rolului său
function RoleDashboard() {
  const { user } = useAuth()
  if (!user) return null
  return ['medic', 'admin'].includes(user.rol)
    ? <DashboardMedic />
    : <DashboardSupraveghetor />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta publică */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rute protejate – necesită autentificare */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<RoleDashboard />} />

              {/* Doar medic și admin pot accesa lista de pacienți */}
              <Route
                path="/pacienti"
                element={
                  <ProtectedRoute allowedRoles={['medic', 'admin']}>
                    <PacientiPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
