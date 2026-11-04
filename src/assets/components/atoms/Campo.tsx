import type { ReactNode } from 'react'

interface CampoProps {
  etiqueta: string
  /** Contenido opcional a la derecha de la etiqueta (ej. "Todos / Ninguno"). */
  accion?: ReactNode
  children: ReactNode
}

/** Bloque de formulario con etiqueta: mantiene el mismo ritmo en todas las pantallas. */
export function Campo({ etiqueta, accion, children }: CampoProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-0.5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
          {etiqueta}
        </div>
        {accion}
      </div>
      {children}
    </section>
  )
}

/** Barra fija al pie de los formularios, con un resumen opcional arriba del botón. */
export function BarraAccion({ resumen, children }: { resumen?: ReactNode; children: ReactNode }) {
  return (
    <div className="shrink-0 border-t border-border bg-surface/95 px-5 pb-6 pt-3 backdrop-blur">
      {resumen && <div className="pb-2.5 text-center text-[12.5px] text-ink-soft">{resumen}</div>}
      {children}
    </div>
  )
}
