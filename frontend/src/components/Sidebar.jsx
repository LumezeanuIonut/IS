import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Fiecare item de navigare definit cu rolurile care îl pot vedea
const NAV_ITEMS = [
  {
    key: 'dashboard',
    path: '/',
    label: 'Dashboard',
    roles: ['medic', 'supraveghetor', 'ingrijitor', 'admin', 'pacient'],
  },
  {
    key: 'pacienti',
    path: '/pacienti',
    label: 'Pacienți',
    roles: ['medic', 'admin'],
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const visibleItems = NAV_ITEMS.filter(item =>
    item.roles.includes(user?.rol)
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-200">
        <p className="text-xs font-bold text-gray-900 tracking-widest uppercase">
          SCH
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Smart Care Home</p>
      </div>

      {/* Navigare */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {visibleItems.map(item => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `block px-3 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Utilizator curent și deconectare */}
      <div className="border-t border-gray-200 px-4 py-4">
        <p className="text-xs font-medium text-gray-800 truncate">{user?.email}</p>
        <p className="text-xs text-blue-600 capitalize mt-0.5 mb-3">{user?.rol}</p>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-gray-700 hover:underline"
        >
          Deconectare →
        </button>
      </div>
    </aside>
  )
}
