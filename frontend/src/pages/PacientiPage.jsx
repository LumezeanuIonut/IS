import { useState, useEffect, useMemo } from 'react'
import api from '../api/axios'

export default function PacientiPage() {
  const [pacienti, setPacienti] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    api.get('/pacienti')
      .then(r => setPacienti(r.data))
      .catch(() => setError('Nu s-au putut încărca datele pacienților.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return pacienti
    const q = search.toLowerCase()
    return pacienti.filter(p =>
      p.numeComplet?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.cnp?.includes(q) ||
      p.adresaOras?.toLowerCase().includes(q)
    )
  }, [pacienti, search])

  return (
    <div className="p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Pacienți</h1>
          <p className="text-sm text-gray-500">
            {pacienti.length} pacienți înregistrați în sistem
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Caută după nume, email, CNP, oraș..."
          className="border border-gray-300 px-3 py-2 text-sm w-full sm:w-72
                     focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* ── Tabel ── */}
      <div className="bg-white border border-gray-200">
        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-400 px-4 py-10 text-center">
            Se încarcă lista de pacienți...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  {['#', 'Nume complet', 'Email', 'CNP', 'Vârstă', 'Oraș', 'Profesie'].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                      {search
                        ? `Niciun pacient nu corespunde căutării „${search}"`
                        : 'Niciun pacient înregistrat'}
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr
                      key={p.idPacient}
                      className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">#{p.idPacient}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
                        {p.numeComplet || <span className="text-gray-400 italic">Necunoscut</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.email || '–'}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {p.cnp || '–'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.varsta != null ? `${p.varsta} ani` : '–'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.adresaOras || '–'}</td>
                      <td className="px-4 py-3 text-gray-600">{p.profesie || '–'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer cu număr de rezultate */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400">
          {filtered.length} din {pacienti.length} pacienți afișați
        </p>
      )}
    </div>
  )
}
