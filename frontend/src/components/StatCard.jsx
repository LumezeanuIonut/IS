const VALUE_COLOR = {
  red:    'text-red-600',
  yellow: 'text-yellow-600',
  blue:   'text-blue-600',
  green:  'text-green-600',
  gray:   'text-gray-700',
}

/**
 * Card statistic plat – fără shadow, separator prin border.
 * Props: label (string), value (number|string), accent ('red'|'yellow'|'blue'|'green'|'gray')
 */
export default function StatCard({ label, value, accent = 'gray' }) {
  const valueColor = VALUE_COLOR[accent] ?? VALUE_COLOR.gray
  return (
    <div className="bg-white border border-gray-200 px-5 py-4">
      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
      <p className={`text-3xl font-semibold mt-1 tabular-nums ${valueColor}`}>
        {value ?? '–'}
      </p>
    </div>
  )
}
