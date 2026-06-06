import { useState, useEffect, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import api from '../api/axios'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import StatCard from '../components/StatCard'

// ─── Utilitare ───────────────────────────────────────────────────────────────

function formatDate(ts) {
  if (!ts) return '–'
  return new Date(ts).toLocaleString('ro-RO', {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function buildChartData(alarme) {
  // Grupează alarmele pe ultimele 7 zile
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  return days.map(dateStr => {
    const dayAlarms = alarme.filter(a =>
      a.timestampDeclansare?.startsWith(dateStr)
    )
    return {
      data: dateStr.slice(5),   // "MM-DD"
      total: dayAlarms.length,
      critice: dayAlarms.filter(a => a.tipAlarma === 'critica').length,
    }
  })
}

// ─── Componente locale ───────────────────────────────────────────────────────

function AlarmaCard({ alarma, onResolve }) {
  const isCritica = alarma.tipAlarma === 'critica'
  return (
    <div
      className={`flex items-start gap-4 px-4 py-4 border-b border-gray-200 last:border-0
        ${isCritica ? 'bg-red-50' : 'bg-yellow-50'}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge type={alarma.tipAlarma} />
          <span className="text-xs text-gray-400">
            Alarmă #{alarma.idAlarma} · Pacient #{alarma.idPacient} · Senzor #{alarma.idSenzor}
          </span>
        </div>
        <p className="text-sm text-gray-800 leading-snug">{alarma.mesaj}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(alarma.timestampDeclansare)}</p>
      </div>
      <button
        onClick={() => onResolve(alarma)}
        className="flex-shrink-0 text-sm border border-blue-600 text-blue-600 px-3 py-1
                   hover:bg-blue-600 hover:text-white"
      >
        Rezolvă
      </button>
    </div>
  )
}

// ─── Dashboard principal ─────────────────────────────────────────────────────

export default function DashboardSupraveghetor() {
  const [alarme, setAlarme] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedAlarma, setSelectedAlarma] = useState(null)
  const [observatie, setObservatie] = useState('')
  const [resolving, setResolving] = useState(false)
  const [resolveMsg, setResolveMsg] = useState('')

  const fetchAlarme = useCallback(async () => {
    setError('')
    try {
      const { data } = await api.get('/alarme/nerezolvate')
      setAlarme(data)
    } catch {
      setError('Nu s-au putut încărca alarmele. Verifică conexiunea la server.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAlarme() }, [fetchAlarme])

  const handleOpenModal = alarma => {
    setSelectedAlarma(alarma)
    setObservatie('')
    setResolveMsg('')
  }

  const handleCloseModal = () => {
    setSelectedAlarma(null)
    setObservatie('')
    setResolveMsg('')
  }

  const handleRezolva = async () => {
    if (!selectedAlarma) return
    setResolving(true)
    setResolveMsg('')
    try {
      await api.put(`/alarme/${selectedAlarma.idAlarma}/rezolva`)
      handleCloseModal()
      fetchAlarme()   // reîncarcă lista
    } catch (err) {
      setResolveMsg(
        err.response?.data?.eroare ?? 'Eroare la rezolvarea alarmei.'
      )
    } finally {
      setResolving(false)
    }
  }

  const critice    = alarme.filter(a => a.tipAlarma === 'critica').length
  const avertizari = alarme.filter(a => a.tipAlarma === 'avertizare').length
  const chartData  = buildChartData(alarme)

  return (
    <div className="p-6 space-y-6">

      {/* ── Header pagină ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard Supraveghetor</h1>
          <p className="text-sm text-gray-500">Monitorizare alarme active în timp real</p>
        </div>
        <button
          onClick={fetchAlarme}
          className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 hover:bg-gray-100"
        >
          Reîncarcă
        </button>
      </div>

      {/* ── Statistici ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total alarme active" value={alarme.length} accent="blue" />
        <StatCard label="Alarme critice"       value={critice}        accent="red" />
        <StatCard label="Avertizări"           value={avertizari}     accent="yellow" />
      </div>

      {/* ── Grafic evoluție ── */}
      <div className="bg-white border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-700">
            Evoluție alarme — ultimele 7 zile
          </h2>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="data"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 0,
                  fontSize: 12,
                  background: '#fff',
                }}
              />
              <Legend iconType="line" wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="critice"
                name="Critice"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#dc2626', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Lista de alarme ── */}
      <div className="bg-white border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">Alarme nerezolvate</h2>
          {!loading && (
            <span className="text-xs text-gray-400">{alarme.length} înregistrări</span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-400 px-4 py-8 text-center">Se încarcă alarmele...</p>
        ) : alarme.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-gray-500">Nicio alarmă activă</p>
            <p className="text-xs text-gray-400 mt-1">Toți parametrii sunt în limite normale.</p>
          </div>
        ) : (
          <div>
            {alarme.map(alarma => (
              <AlarmaCard
                key={alarma.idAlarma}
                alarma={alarma}
                onResolve={handleOpenModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal rezolvare alarmă ── */}
      {selectedAlarma && (
        <Modal
          title={`Rezolvare alarmă #${selectedAlarma.idAlarma}`}
          onClose={handleCloseModal}
        >
          <div className="space-y-4">
            {/* Detalii alarmă */}
            <div className={`border px-3 py-3 text-sm ${
              selectedAlarma.tipAlarma === 'critica'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Badge type={selectedAlarma.tipAlarma} />
                <span className="text-xs">Pacient #{selectedAlarma.idPacient}</span>
              </div>
              <p className="text-xs leading-relaxed">{selectedAlarma.mesaj}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(selectedAlarma.timestampDeclansare)}
              </p>
            </div>

            {/* Observații */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observații <span className="text-gray-400 font-normal">(opțional)</span>
              </label>
              <textarea
                value={observatie}
                onChange={e => setObservatie(e.target.value)}
                rows={3}
                placeholder="Descrieți acțiunile întreprinse, observațiile clinice..."
                className="w-full border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Eroare rezolvare */}
            {resolveMsg && (
              <div className="text-sm bg-red-50 border border-red-200 text-red-700 px-3 py-2">
                {resolveMsg}
              </div>
            )}

            {/* Acțiuni */}
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                onClick={handleRezolva}
                disabled={resolving}
                className="px-4 py-2 text-sm bg-blue-600 text-white
                           hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resolving ? 'Se procesează...' : 'Confirmă rezolvarea'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
