import { useEffect } from 'react'

/**
 * Modal plat, fără umbre.
 * Separare vizuală exclusiv prin borduri și overlay semi-transparent.
 */
export default function Modal({ title, onClose, children }) {
  // Închide cu Escape
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Blochează scroll-ul pe body când modalul e deschis
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-40"
        onClick={onClose}
      />

      {/* Cutia modalului – fără shadow, doar border */}
      <div className="relative z-10 bg-white border border-gray-200 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-xl leading-none text-gray-400 hover:text-gray-700 w-6 h-6 flex items-center justify-center"
            aria-label="Închide"
          >
            ×
          </button>
        </div>

        {/* Conținut */}
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
