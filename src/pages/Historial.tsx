import { useMemo, useState } from 'react'
import type { Movimiento } from '../types'
import { useSobresStore } from '../lib/store'
import { claveMes, formatColones, formatFecha, formatMes } from '../lib/format'
import { resumir } from '../lib/resumen'
import { Header } from '../assets/components/organisms/Header'
import { MovimientoRow } from '../assets/components/molecules/MovimientoRow'
import { MovimientoDetalleModal } from '../assets/components/organisms/MovimientoDetalleModal'

type Filtro = 'todos' | 'ingresos' | 'gastos' | 'otros'

const FILTROS: [Filtro, string][] = [
  ['todos', 'Todos'],
  ['ingresos', 'Ingresos'],
  ['gastos', 'Gastos'],
  ['otros', 'Movimientos'],
]

function etiquetaDia(fecha: number): string {
  const hoy = new Date()
  const d = new Date(fecha)
  const mismoDia = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  if (mismoDia(d, hoy)) return 'Hoy'
  const ayer = new Date(hoy)
  ayer.setDate(hoy.getDate() - 1)
  if (mismoDia(d, ayer)) return 'Ayer'
  return formatFecha(fecha)
}

function cumpleFiltro(m: Movimiento, filtro: Filtro): boolean {
  switch (filtro) {
    case 'ingresos':
      return m.tipo === 'ingreso_repartido'
    case 'gastos':
      return m.tipo === 'ajuste_manual'
    case 'otros':
      return m.tipo === 'transferencia' || m.tipo === 'correccion_saldo'
    default:
      return true
  }
}

interface GrupoMes {
  clave: string
  titulo: string
  entro: number
  salio: number
  dias: [string, Movimiento[]][]
}

export function Historial() {
  const { movimientos, sobres } = useSobresStore()
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null)
  const seleccionado = movimientos.find((m) => m.id === seleccionadoId)

  const meses = useMemo<GrupoMes[]>(() => {
    const ordenados = [...movimientos].sort((a, b) => b.fecha - a.fecha)
    const porMes = new Map<string, Movimiento[]>()
    for (const m of ordenados) {
      const clave = claveMes(m.fecha)
      if (!porMes.has(clave)) porMes.set(clave, [])
      porMes.get(clave)!.push(m)
    }

    const resultado: GrupoMes[] = []
    for (const [clave, movsMes] of porMes) {
      // El resumen del mes siempre usa TODOS los movimientos del mes, aunque
      // la lista de abajo esté filtrada.
      const { entro, salio } = resumir(movsMes)
      const visibles = movsMes.filter((m) => cumpleFiltro(m, filtro))
      if (visibles.length === 0) continue

      const porDia = new Map<string, Movimiento[]>()
      for (const m of visibles) {
        const etiqueta = etiquetaDia(m.fecha)
        if (!porDia.has(etiqueta)) porDia.set(etiqueta, [])
        porDia.get(etiqueta)!.push(m)
      }
      resultado.push({
        clave,
        titulo: formatMes(movsMes[0].fecha),
        entro,
        salio,
        dias: [...porDia.entries()],
      })
    }
    return resultado
  }, [movimientos, filtro])

  return (
    <>
      <Header titulo="Historial" />
      <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-5 pb-3 pt-4">
        {FILTROS.map(([valor, etiqueta]) => (
          <button
            key={valor}
            type="button"
            onClick={() => setFiltro(valor)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] ${
              filtro === valor
                ? 'bg-green font-semibold text-surface'
                : 'border border-border bg-surface font-medium text-ink-soft'
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
        {meses.length === 0 && (
          <div className="pt-6 text-center text-sm text-ink-faint">Todavía no hay movimientos.</div>
        )}
        {meses.map((mes) => (
          <div key={mes.clave} className="pb-3">
            <div className="mt-2 flex items-baseline justify-between rounded-xl bg-surface-2 px-3.5 py-2.5">
              <div className="font-display text-[14.5px] font-semibold">{mes.titulo}</div>
              <div className="text-[11.5px] text-ink-soft">
                <span className="font-semibold text-green">{mes.entro > 0 ? '+' : ''}{formatColones(mes.entro)}</span>
                <span className="px-1.5 text-ink-faint">·</span>
                <span className="font-semibold">{mes.salio > 0 ? '-' : ''}{formatColones(mes.salio)}</span>
              </div>
            </div>
            {mes.dias.map(([etiqueta, movs]) => (
              <div key={etiqueta}>
                <div className="pb-0.5 pt-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">
                  {etiqueta}
                </div>
                {movs.map((m) => (
                  <MovimientoRow
                    key={m.id}
                    movimiento={m}
                    sobres={sobres}
                    onClick={() => setSeleccionadoId(m.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
        {meses.length > 0 && (
          <div className="pt-1 text-center text-[11px] text-ink-faint">
            Tocá un movimiento para ver el detalle o eliminarlo.
          </div>
        )}
      </div>

      {seleccionado && (
        <MovimientoDetalleModal
          movimiento={seleccionado}
          onCerrar={() => setSeleccionadoId(null)}
        />
      )}
    </>
  )
}
