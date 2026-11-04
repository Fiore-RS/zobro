import { useState } from 'react'
import type { Movimiento } from '../../../types'
import { useSobresStore } from '../../../lib/store'
import { formatColones, formatFecha, formatPorcentaje } from '../../../lib/format'
import { Modal } from '../atoms/Modal'
import { Button } from '../atoms/Button'
import { IconBadge } from '../atoms/IconBadge'
import { TrashIcon } from '../atoms/Icon'
import { estiloMovimiento, nombreSobre, tituloMovimiento } from '../molecules/MovimientoRow'

interface Props {
  movimiento: Movimiento
  onCerrar: () => void
}

/**
 * Detalle de un movimiento (al tocarlo en el historial o en el detalle de
 * un sobre), con la opción de eliminarlo. Eliminar revierte su efecto en
 * los saldos de todos los sobres participantes.
 */
export function MovimientoDetalleModal({ movimiento, onCerrar }: Props) {
  const { sobres, eliminarMovimiento } = useSobresStore()
  const [confirmando, setConfirmando] = useState(false)
  const { color, Icono } = estiloMovimiento(movimiento.tipo)
  const esIngreso = movimiento.tipo === 'ingreso_repartido'

  function eliminar() {
    eliminarMovimiento(movimiento.id)
    onCerrar()
  }

  return (
    <Modal titulo={tituloMovimiento(movimiento, sobres)} onCerrar={onCerrar}>
      <div className="flex items-center gap-3">
        <IconBadge color={color} size={38}>
          <Icono size={18} />
        </IconBadge>
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] text-ink-faint">{formatFecha(movimiento.fecha)}</div>
          {movimiento.nota && <div className="text-sm">{movimiento.nota}</div>}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 rounded-2xl border border-border p-3.5">
        {esIngreso && movimiento.montoTotal !== undefined && (
          <>
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-semibold">Total del ingreso</div>
              <div className="text-sm font-bold">{formatColones(movimiento.montoTotal)}</div>
            </div>
            <div className="h-px bg-border" />
          </>
        )}
        {movimiento.sobresParticipantes.map((p) => (
          <div key={p.sobreId} className="flex items-center justify-between">
            <div>
              <div className="text-[13px]">{nombreSobre(sobres, p.sobreId)}</div>
              {esIngreso && (
                <div className="text-[11px] text-ink-faint">
                  {formatPorcentaje(p.porcentajeAplicado, 1)} del ingreso
                </div>
              )}
            </div>
            <div className={`text-[13.5px] font-semibold ${p.monto >= 0 ? 'text-green' : ''}`}>
              {p.monto >= 0 ? '+' : ''}
              {formatColones(p.monto)}
            </div>
          </div>
        ))}
      </div>

      {confirmando ? (
        <div className="flex flex-col gap-3">
          <div className="text-[13px] leading-relaxed text-ink-soft">
            Se borra del historial y los saldos de{' '}
            {movimiento.sobresParticipantes.length > 1 ? 'estos sobres' : 'este sobre'} vuelven a
            como estaban antes de este movimiento.
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline-green" className="flex-1" onClick={() => setConfirmando(false)}>
              Cancelar
            </Button>
            <Button variant="solid-red" className="flex-1" onClick={eliminar}>
              Sí, eliminar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2.5">
          <Button variant="outline-green" className="flex-1" onClick={onCerrar}>
            Cerrar
          </Button>
          <button
            type="button"
            onClick={() => setConfirmando(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-[1.5px] border-red-400 px-4 py-3.5 text-[15px] font-semibold text-red-500"
          >
            <TrashIcon size={16} />
            Eliminar
          </button>
        </div>
      )}
    </Modal>
  )
}
