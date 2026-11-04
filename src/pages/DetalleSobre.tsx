import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { formatColones, formatPorcentaje } from '../lib/format'
import { delMesActual, resumir } from '../lib/resumen'
import { Header } from '../assets/components/organisms/Header'
import { IconBadge } from '../assets/components/atoms/IconBadge'
import { Pill } from '../assets/components/atoms/Pill'
import { ProgressBar } from '../assets/components/atoms/ProgressBar'
import { MovimientoRow } from '../assets/components/molecules/MovimientoRow'
import { MovimientoDetalleModal } from '../assets/components/organisms/MovimientoDetalleModal'
import { ArrowUpIcon, TransferIcon, iconoDeSobre } from '../assets/components/atoms/Icon'
import { CLASE_TEXTO } from '../lib/colores'

export function DetalleSobre() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { sobres, movimientos } = useSobresStore()
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null)
  const sobre = sobres.find((s) => s.id === id)

  if (!sobre) return <Navigate to="/" replace />

  const Icono = iconoDeSobre(sobre.icono)
  const progreso = sobre.meta ? (sobre.saldoActual / sobre.meta) * 100 : undefined
  const movimientosDeSobre = movimientos
    .filter((m) => m.sobresParticipantes.some((p) => p.sobreId === sobre.id))
    .sort((a, b) => b.fecha - a.fecha)
  const delMes = resumir(delMesActual(movimientosDeSobre), sobre.id)
  const seleccionado = movimientos.find((m) => m.id === seleccionadoId)
  const mesActual = new Date().toLocaleDateString('es-CR', { month: 'long' })
  const hayOtrosSobres = sobres.some((s) => !s.archivado && s.id !== sobre.id)

  return (
    <>
      <Header titulo={sobre.nombre} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3.5 py-5">
          <IconBadge color={sobre.color} size={56}>
            <Icono size={28} />
          </IconBadge>
          <div className="flex flex-col items-center gap-1">
            <div className="text-[12.5px] text-ink-faint">Saldo actual</div>
            <div className="font-display font-semibold text-[34px]">
              {formatColones(sobre.saldoActual)}
            </div>
          </div>
          <Pill color={sobre.color}>{formatPorcentaje(sobre.prioridad)} de prioridad</Pill>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-0.5 rounded-2xl border border-border bg-surface p-3.5">
            <div className="text-[11.5px] text-ink-faint">Entró en {mesActual}</div>
            <div className="text-[16px] font-semibold text-green">{delMes.entro > 0 ? '+' : ''}{formatColones(delMes.entro)}</div>
          </div>
          <div className="flex flex-col gap-0.5 rounded-2xl border border-border bg-surface p-3.5">
            <div className="text-[11.5px] text-ink-faint">Salió en {mesActual}</div>
            <div className="text-[16px] font-semibold">{delMes.salio > 0 ? '-' : ''}{formatColones(delMes.salio)}</div>
          </div>
        </div>

        {sobre.meta && (
          <div className="flex flex-col gap-2.5 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-baseline justify-between">
              <div className="text-[13.5px] font-semibold">Meta de ahorro</div>
              <div className="text-xs text-ink-faint">{formatPorcentaje(progreso ?? 0)}</div>
            </div>
            <ProgressBar porcentaje={progreso ?? 0} color={sobre.color} height={8} />
            <div className="flex items-center justify-between">
              <div className="text-xs text-ink-faint">
                {formatColones(sobre.saldoActual)} de {formatColones(sobre.meta)}
              </div>
              {sobre.saldoActual < sobre.meta && (
                <div className={`text-xs font-semibold ${CLASE_TEXTO[sobre.color]}`}>
                  Faltan {formatColones(sobre.meta - sobre.saldoActual)}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/nuevo-gasto', { state: { sobreId: sobre.id } })}
            className="flex items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-celeste py-3.5 text-center font-semibold text-sm text-celeste"
          >
            <ArrowUpIcon size={15} />
            Registrar gasto
          </button>
          <button
            type="button"
            disabled={!hayOtrosSobres}
            onClick={() => navigate('/transferir', { state: { origenId: sobre.id } })}
            className="flex items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-celeste py-3.5 text-center font-semibold text-sm text-celeste disabled:opacity-40"
          >
            <TransferIcon size={15} />
            Mover a otro
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <div className="mb-1.5 text-[12.5px] text-ink-faint">Movimientos recientes</div>
          {movimientosDeSobre.length === 0 && (
            <div className="text-sm text-ink-faint">Todavía no hay movimientos.</div>
          )}
          {movimientosDeSobre.map((m) => (
            <MovimientoRow
              key={m.id}
              movimiento={m}
              sobres={sobres}
              sobreIdFiltro={sobre.id}
              onClick={() => setSeleccionadoId(m.id)}
            />
          ))}
        </div>
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
