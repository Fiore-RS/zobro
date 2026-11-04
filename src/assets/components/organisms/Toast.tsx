import { useEffect } from 'react'
import { useSobresStore } from '../../../lib/store'
import { XIcon } from '../atoms/Icon'

const DURACION_MS = 6000

/**
 * Aviso flotante que aparece tras registrar un movimiento, con un botón
 * "Deshacer" que lo elimina y revierte los saldos. Se cierra solo a los
 * pocos segundos.
 */
export function Toast() {
  const { aviso, cerrarAviso, eliminarMovimiento } = useSobresStore()

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(cerrarAviso, DURACION_MS)
    return () => clearTimeout(t)
  }, [aviso, cerrarAviso])

  if (!aviso) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[88px] z-40 flex justify-center px-4">
      <div
        key={aviso.id}
        role="status"
        className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-ink py-2.5 pl-4 pr-2 text-surface shadow-lg animate-[aparecer_180ms_ease-out]"
      >
        <span className="flex-1 text-[13px] font-medium">{aviso.mensaje}</span>
        {aviso.movimientoId && (
          <button
            type="button"
            onClick={() => eliminarMovimiento(aviso.movimientoId!)}
            className="rounded-xl px-3 py-1.5 text-[13px] font-semibold text-celeste-soft"
          >
            Deshacer
          </button>
        )}
        <button
          type="button"
          onClick={cerrarAviso}
          aria-label="Cerrar aviso"
          className="flex h-7 w-7 items-center justify-center rounded-full opacity-70"
        >
          <XIcon size={14} />
        </button>
      </div>
    </div>
  )
}
