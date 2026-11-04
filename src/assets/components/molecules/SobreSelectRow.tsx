import { CheckIcon, iconoDeSobre } from '../atoms/Icon'
import { IconBadge } from '../atoms/IconBadge'
import { formatPorcentaje } from '../../../lib/format'
import type { SobreColor, SobreIcono } from '../../../types'
import { CLASE_SELECCION, CLASE_SOLIDA } from '../../../lib/colores'

interface SobreSelectRowProps {
  nombre: string
  prioridad: number
  seleccionado: boolean
  onToggle: () => void
  tipo?: 'checkbox' | 'radio'
  /** Color de la marca y del fondo al estar seleccionado. */
  color?: SobreColor
  /** Ícono y color propios del sobre (se muestran como insignia a la izquierda). */
  icono?: SobreIcono
  colorSobre?: SobreColor
  /** Texto principal a la derecha; por defecto el % de prioridad. */
  detalle?: string
  /** Línea secundaria debajo del detalle. */
  subdetalle?: string
}

export function SobreSelectRow({
  nombre,
  prioridad,
  seleccionado,
  onToggle,
  tipo = 'checkbox',
  color = 'green',
  icono,
  colorSobre,
  detalle,
  subdetalle,
}: SobreSelectRowProps) {
  const fondoSeleccionado = CLASE_SELECCION[color]
  const marcaSeleccionada = CLASE_SOLIDA[color]
  const Icono = icono ? iconoDeSobre(icono) : undefined

  return (
    <button
      type="button"
      role={tipo === 'radio' ? 'radio' : 'checkbox'}
      aria-checked={seleccionado}
      onClick={onToggle}
      className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors duration-150 active:scale-[0.99] ${
        seleccionado ? fondoSeleccionado : 'bg-surface border-border'
      }`}
    >
      {tipo === 'checkbox' ? (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
            seleccionado ? marcaSeleccionada : 'border-[1.5px] border-border'
          }`}
        >
          {seleccionado && <CheckIcon size={13} className="text-surface" strokeWidth={2.6} />}
        </span>
      ) : (
        <span
          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
            seleccionado ? marcaSeleccionada : 'border-[1.5px] border-border'
          }`}
        >
          {seleccionado && <span className="h-1.5 w-1.5 rounded-full bg-surface" />}
        </span>
      )}
      {Icono && colorSobre && (
        <IconBadge color={colorSobre} size={30}>
          <Icono size={15} />
        </IconBadge>
      )}
      <span
        className={`min-w-0 flex-1 truncate text-sm ${seleccionado ? 'font-semibold' : 'font-medium text-ink-soft'}`}
      >
        {nombre}
      </span>
      <span className="flex shrink-0 flex-col items-end">
        <span className={`text-[13px] ${seleccionado ? 'font-semibold' : 'text-ink-faint'}`}>
          {detalle ?? formatPorcentaje(prioridad)}
        </span>
        {subdetalle && <span className="text-[10.5px] text-ink-faint">{subdetalle}</span>}
      </span>
    </button>
  )
}
