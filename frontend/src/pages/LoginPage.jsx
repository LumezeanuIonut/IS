import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', parola: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Dacă utilizatorul este deja autentificat, redirecționează
  if (user) return <Navigate to="/" replace />

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.parola)
      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.eroare ??
        err.response?.data?.error ??
        'Email sau parolă incorecte. Încearcă din nou.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      {/* Brand header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SCH</h1>
        <p className="text-sm text-gray-500 mt-1">Smart Care Home – Portal Personal Medical</p>
      </div>

      {/* Card de login – fără shadow, doar border */}
      <div className="w-full max-w-sm bg-white border border-gray-200">

        {/* Header card */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-700">Autentificare</h2>
        </div>

        {/* Formular */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adresă email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="utilizator@sch.ro"
              className="w-full border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:border-blue-500
                         placeholder:text-gray-300"
            />
          </div>

          <div>
            <label
              htmlFor="parola"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Parolă
            </label>
            <input
              id="parola"
              name="parola"
              type="password"
              autoComplete="current-password"
              required
              value={form.parola}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Mesaj eroare */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 text-sm font-medium
                       hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Se autentifică...' : 'Intră în cont'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Contul este creat de administratorul sistemului.
      </p>
    </div>
  )
}
