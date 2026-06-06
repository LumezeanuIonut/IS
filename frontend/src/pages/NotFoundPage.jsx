import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <p className="text-7xl font-bold text-gray-200 select-none">404</p>
      <p className="text-lg font-semibold text-gray-700 mt-3">Pagina nu a fost găsită</p>
      <p className="text-sm text-gray-400 mt-1">Ruta accesată nu există în aplicație.</p>
      <Link
        to="/"
        className="mt-6 inline-block border border-blue-600 text-blue-600 px-5 py-2 text-sm
                   hover:bg-blue-600 hover:text-white"
      >
        ← Înapoi la dashboard
      </Link>
    </div>
  )
}
