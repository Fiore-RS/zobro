import { Link } from 'react-router-dom'
import type { Sobre } from '../../../types'
import { formatColones, formatPorcentaje } from '../../../lib/format'
import { CLASE_SELECCION, CLASE_SOLIDA, CLASE_SUAVE, CLASE_TEXTO } from '../../../lib/colores'
import { ProgressBar } from '../atoms/ProgressBar'
import { CheckIcon, iconoDeSobre } from '../atoms/Icon'

interface SobreCardProps {
  sobre: Sobre
  /** Modo "sumar sobres": la tarjeta se vuelve un botón que se marca/desmarca. */
  seleccionable?: boolean
  seleccionado?: boolean
  onToggle?: () => void
}

/**
 * Tarjeta de un sobre en Inicio. La franja superior en el color del sobre
 * termina en una "solapa" (el triángulo de un sobre de papel), para que
 * cada tarjeta se lea como un sobre y no como una caja genérica.
 */
export function SobreCard({ sobre, seleccionable, seleccionado, onToggle }: SobreCardProps) {
  const Icono = iconoDeSobre(sobre.icono)
  const progreso = sobre.meta ? (sobre.saldoActual / sobre.meta) * 100 : undefined
  const negativo = sobre.saldoActual < 0

  const contenido = (
    <>
      <div className={`relative h-[54px] ${CLASE_SUAVE[sobre.color]}`}>
        {/* Solapa del sobre */}
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="absolute inset-x-0 -bottom-px h-4 w-full text-surface"
          aria-hidden
        >
          <path d="M0 20 L0 0 L50 18 L100 0 L100 20 Z" fill="currentColor" />
        </svg>
        <div className="absolute left-3 top-2.5">
          <Icono size={17} />
        </div>
        <div className="absolute right-3 top-2.5 text-[11px] font-semibold">
          {seleccionable ? (
            <span
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full ${
                seleccionado ? CLASE_SOLIDA[sobre.color] : 'border-[1.5px] border-current opacity-60'
              }`}
            >
              {seleccionado && <CheckIcon size={13} strokeWidth={2.8} className="text-surface" />}
            </span>
          ) : (
            formatPorcentaje(sobre.prioridad)
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-3.5 pb-3.5 pt-1">
        <div className="truncate font-display text-[14.5px] font-semibold">{sobre.nombre}</div>
        <div
          className={`text-[19px] font-semibold tracking-tight ${negativo ? CLASE_TEXTO.rojo : ''}`}
        >
          {formatColones(sobre.saldoActual)}
        </div>
        <div className="mt-auto pt-1.5">
          {sobre.meta ? (
            <div className="flex flex-col gap-1.5">
              <ProgressBar porcentaje={progreso ?? 0} color={sobre.color} />
              <div className="flex justify-between text-[10px] text-ink-faint">
                <span>Meta {formatColones(sobre.meta)}</span>
                <span>{formatPorcentaje(Math.max(0, progreso ?? 0))}</span>
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-ink-faint">Sin meta · uso libre</div>
          )}
        </div>
      </div>
    </>
  )

  const base =
    'flex flex-col overflow-hidden rounded-2xl border bg-surface text-left transition-[transform,box-shadow,border-color] duration-150 active:scale-[0.98]'

  if (seleccionable) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={seleccionado}
        className={`${base} ${
          // Solo el borde "mid" del color (el fondo de la tarjeta no cambia, así la solapa sigue calzando).
          seleccionado ? `${CLASE_SELECCION[sobre.color].split(' ')[1]} border-2 shadow-md` : 'border-border border-2 opacity-80'
        }`}
      >
        {contenido}
      </button>
    )
  }

  return (
    <Link to={`/sobres/${sobre.id}`} className={`${base} border-border hover:shadow-sm`}>
      {contenido}
    </Link>
  )
}
