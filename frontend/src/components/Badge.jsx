const STYLES = {
  critica:     'bg-red-50 text-red-700 border border-red-200',
  avertizare:  'bg-yellow-50 text-yellow-700 border border-yellow-200',
  default:     'bg-gray-100 text-gray-600 border border-gray-200',
}

export default function Badge({ type }) {
  const cls = STYLES[type] ?? STYLES.default
  return (
    <span className={`inline-block text-xs px-2 py-0.5 font-medium uppercase tracking-wide ${cls}`}>
      {type ?? '–'}
    </span>
  )
}
