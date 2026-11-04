import { fechaAInput } from '../../../lib/format'
import { Campo } from './Campo'

interface FechaInputProps {
  /** "YYYY-MM-DD" */
  valor: string
  onChange: (valor: string) => void
}

/**
 * Selector de fecha del movimiento. Por defecto es hoy; no permite fechas
 * futuras (un movimiento siempre es algo que ya pasó).
 */
export function FechaInput({ valor, onChange }: FechaInputProps) {
  const hoy = fechaAInput(Date.now())
  const ayerTs = new Date()
  ayerTs.setDate(ayerTs.getDate() - 1)
  const ayer = fechaAInput(ayerTs.getTime())
  const otra = valor !== hoy && valor !== ayer

  const chip = (v: string, etiqueta: string) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      aria-pressed={valor === v}
      className={`rounded-full px-3.5 py-1.5 text-[12.5px] transition-colors ${
        valor === v
          ? 'bg-ink font-semibold text-surface'
          : 'border border-border bg-surface font-medium text-ink-soft'
      }`}
    >
      {etiqueta}
    </button>
  )

  return (
    <Campo etiqueta="Fecha">
      <div className="flex flex-wrap items-center gap-2">
        {chip(hoy, 'Hoy')}
        {chip(ayer, 'Ayer')}
        <input
          type="date"
          value={valor}
          max={hoy}
          onChange={(e) => onChange(e.target.value || hoy)}
          aria-label="Elegir otra fecha"
          className={`rounded-full border px-3 py-1.5 text-[12.5px] outline-none transition-colors ${
            otra
              ? 'border-ink bg-ink font-semibold text-surface'
              : 'border-border bg-surface text-ink-soft'
          }`}
        />
      </div>
    </Campo>
  )
}
