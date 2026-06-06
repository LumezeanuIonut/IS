import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import api from '../api/axios'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'

// ─── Formular: Adaugă măsurătoare ────────────────────────────────────────────

function MasurareForm({ pacienti, onSuccess }) {
  const [form, setForm] = useState({ idPacient: '', idSenzor: '', valoare: '' })
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const { data } = await api.post('/masurari', {
        idPacient: Number(form.idPacient),
        idSenzor:  Number(form.idSenzor),
        valoare:   Number(form.valoare),
      })
      const alarmaTxt = data.alarmaGenerata
        ? ` — Alarmă ${data.alarmaGenerata.tipAlarma} generată!`
        : ''
      setMsg({ ok: true, text: `Măsurătoare #${data.idMasurare} salvată.${alarmaTxt}` })
      setForm({ idPacient: '', idSenzor: '', valoare: '' })
      if (onSuccess) onSuccess()
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.eroare ?? 'Eroare la salvare.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pacient *</label>
        <select
          value={form.idPacient}
          onChange={e => set('idPacient', e.target.value)}
          required
          className="w-full border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none focus:border-blue-500 bg-white"
        >
          <option value="">Selectează pacient...</option>
          {pacienti.map(p => (
            <option key={p.idPacient} value={p.idPacient}>
              {p.numeComplet || `Pacient #${p.idPacient}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ID Senzor *</label>
        <input
          type="number"
          min={1}
          value={form.idSenzor}
          onChange={e => set('idSenzor', e.target.value)}
          required
          placeholder="ex: 1"
          className="w-full border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Valoare *</label>
        <input
          type="number"
          step="0.01"
          value={form.valoare}
          onChange={e => set('valoare', e.target.value)}
          required
          placeholder="ex: 98.6"
          className="w-full border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none focus:border-blue-500"
        />
      </div>

      {msg && (
        <div className={`text-sm px-3 py-2 border ${
          msg.ok
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {msg.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 text-sm font-medium
                   hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Se salvează...' : 'Salvează măsurătoare'}
      </button>
    </form>
  )
}

// ─── Formular: Înregistrează pacient ─────────────────────────────────────────

const EMPTY_PACIENT = {
  nume: '', prenume: '', email: '', telefon: '', parola: '',
}

function PacientForm({ onSuccess }) {
  const [form, setForm] = useState(EMPTY_PACIENT)
  const [msg, setMsg]   = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      await api.post('/auth/register', { ...form, rol: 'pacient' })
      setMsg({ ok: true, text: `Pacientul ${form.prenume} ${form.nume} a fost înregistrat.` })
      setForm(EMPTY_PACIENT)
      if (onSuccess) onSuccess()
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.eroare ?? 'Eroare la înregistrare.' })
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-500'
  const disabledCls = 'w-full border border-gray-200 px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed'

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* ── Secțiunea 1: Date cont ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-6 bg-blue-600 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">
            1
          </span>
          <h3 className="text-sm font-semibold text-gray-900">Date cont</h3>
          <div className="flex-1 border-t border-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume *</label>
            <input
              value={form.nume}
              onChange={e => set('nume', e.target.value)}
              required maxLength={100}
              className={inputCls}
              placeholder="Popescu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prenume *</label>
            <input
              value={form.prenume}
              onChange={e => set('prenume', e.target.value)}
              required maxLength={100}
              className={inputCls}
              placeholder="Ion"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required maxLength={150}
              className={inputCls}
              placeholder="pacient@email.ro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              value={form.telefon}
              onChange={e => set('telefon', e.target.value)}
              maxLength={20}
              className={inputCls}
              placeholder="07xx xxx xxx"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parolă * <span className="text-xs text-gray-400 font-normal">min. 8 caractere</span>
            </label>
            <input
              type="password"
              value={form.parola}
              onChange={e => set('parola', e.target.value)}
              required minLength={8}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* ── Secțiunea 2: Date identificare (editabile post-creare) ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-6 bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-semibold flex-shrink-0">
            2
          </span>
          <h3 className="text-sm font-semibold text-gray-400">Date de identificare</h3>
          <span className="text-xs text-gray-400 italic">disponibile după creare</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">CNP</label>
            <input disabled placeholder="1234567890123" className={disabledCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Vârstă</label>
            <input disabled type="number" className={disabledCls} />
          </div>
        </div>
      </section>

      {/* ── Secțiunea 3: Adresă ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-6 bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-semibold flex-shrink-0">
            3
          </span>
          <h3 className="text-sm font-semibold text-gray-400">Adresă</h3>
          <span className="text-xs text-gray-400 italic">disponibilă după creare</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">Stradă</label>
            <input disabled placeholder="Str. Exemplu, nr. 1" className={disabledCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Oraș</label>
            <input disabled className={disabledCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Județ</label>
            <input disabled className={disabledCls} />
          </div>
        </div>
      </section>

      {/* ── Secțiunea 4: Date profesionale ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-6 h-6 bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-semibold flex-shrink-0">
            4
          </span>
          <h3 className="text-sm font-semibold text-gray-400">Date profesionale</h3>
          <span className="text-xs text-gray-400 italic">disponibile după creare</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Profesie</label>
            <input disabled className={disabledCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Loc de muncă</label>
            <input disabled className={disabledCls} />
          </div>
        </div>
      </section>

      {/* Mesaj și buton */}
      {msg && (
        <div className={`text-sm px-3 py-2 border ${
          msg.ok
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {msg.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2.5 text-sm font-medium
                   hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Se înregistrează...' : 'Înregistrează pacient nou'}
      </button>
    </form>
  )
}

// ─── Dashboard principal ──────────────────────────────────────────────────────

export default function DashboardMedic() {
  const [pacienti, setPacienti] = useState([])
  const [alarme,   setAlarme]   = useState([])
  const [activeTab, setActiveTab] = useState('pacient')

  const fetchData = () => {
    api.get('/pacienti').then(r => setPacienti(r.data)).catch(console.error)
    api.get('/alarme/nerezolvate').then(r => setAlarme(r.data)).catch(console.error)
  }

  useEffect(() => { fetchData() }, [])

  // Date grafic: distribuție alarme pe tip (ultimele active)
  const chartData = [
    { tip: 'Critice',    count: alarme.filter(a => a.tipAlarma === 'critica').length },
    { tip: 'Avertizări', count: alarme.filter(a => a.tipAlarma === 'avertizare').length },
  ]

  const tabs = [
    { key: 'pacient',   label: 'Înregistrează pacient' },
    { key: 'masurare',  label: 'Adaugă măsurătoare' },
  ]

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Dashboard Medic</h1>
        <p className="text-sm text-gray-500">Gestionare pacienți, măsurători și alarme</p>
      </div>

      {/* ── Statistici ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard label="Pacienți înregistrați" value={pacienti.length} accent="blue" />
        <StatCard label="Alarme active"          value={alarme.length}   accent="red" />
        <StatCard label="Alarme critice"
          value={alarme.filter(a => a.tipAlarma === 'critica').length}
          accent="red"
        />
        <StatCard label="Avertizări"
          value={alarme.filter(a => a.tipAlarma === 'avertizare').length}
          accent="yellow"
        />
      </div>

      {/* ── Grafic distribuție alarme ── */}
      <div className="bg-white border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-700">Distribuție alarme active</h2>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="tip" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 0, fontSize: 12 }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Bar dataKey="count" name="Alarme" fill="#2563eb" radius={0} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Tab-uri formulare ── */}
      <div className="bg-white border border-gray-200">
        {/* Tab header */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'pacient' ? (
            <PacientForm onSuccess={fetchData} />
          ) : (
            <MasurareForm pacienti={pacienti} onSuccess={fetchData} />
          )}
        </div>
      </div>

      {/* ── Tabel alarme recente ── */}
      {alarme.length > 0 && (
        <div className="bg-white border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Alarme nerezolvate</h2>
            <span className="text-xs text-gray-400">{alarme.length} active</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['#', 'Pacient', 'Senzor', 'Tip', 'Mesaj', 'Data'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alarme.map(a => (
                <tr key={a.idAlarma} className="border-b border-gray-200 last:border-0">
                  <td className="px-4 py-2.5 text-gray-400 text-xs">#{a.idAlarma}</td>
                  <td className="px-4 py-2.5 text-gray-700">#{a.idPacient}</td>
                  <td className="px-4 py-2.5 text-gray-700">#{a.idSenzor}</td>
                  <td className="px-4 py-2.5"><Badge type={a.tipAlarma} /></td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{a.mesaj}</td>
                  <td className="px-4 py-2.5 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(a.timestampDeclansare).toLocaleString('ro-RO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
