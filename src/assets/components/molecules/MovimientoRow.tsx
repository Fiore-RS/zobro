import type { Movimiento, Sobre, SobreColor } from '../../../types'
import { formatColones, formatFecha } from '../../../lib/format'
import { IconBadge } from '../atoms/IconBadge'
import { ArrowDownIcon, ArrowUpIcon, LapizIcon, TransferIcon } from '../atoms/Icon'

interface MovimientoRowProps {
  movimiento: Movimiento
  sobres: Sobre[]
  /** Si se da, muestra solo el monto de ese sobre dentro del movimiento (vista de Detalle de sobre). */
  sobreIdFiltro?: string
  onClick?: () => void
}

export function nombreSobre(sobres: Sobre[], id: string | undefined): string {
  return sobres.find((s) => s.id === id)?.nombre ?? 'Sobre eliminado'
}

/** Ícono y color según el tipo de movimiento. */
export function estiloMovimiento(tipo: Movimiento['tipo']): {
  color: SobreColor
  Icono: typeof ArrowDownIcon
} {
  switch (tipo) {
    case 'ingreso_repartido':
      return { color: 'green', Icono: ArrowDownIcon }
    case 'transferencia':
      return { color: 'celeste', Icono: TransferIcon }
    case 'correccion_saldo':
      return { color: 'gris', Icono: LapizIcon }
    default:
      return { color: 'celeste', Icono: ArrowUpIcon }
  }
}

/** Título legible del movimiento ("Ingreso repartido", "Comida → Ocio", etc.). */
export function tituloMovimiento(movimiento: Movimiento, sobres: Sobre[]): string {
  const p = movimiento.sobresParticipantes
  switch (movimiento.tipo) {
    case 'ingreso_repartido':
      return 'Ingreso repartido'
    case 'transferencia': {
      const origen = p.find((x) => x.monto < 0)?.sobreId
      const destino = p.find((x) => x.monto > 0)?.sobreId
      return `${nombreSobre(sobres, origen)} → ${nombreSobre(sobres, destino)}`
    }
    case 'correccion_saldo':
      return `Corrección · ${nombreSobre(sobres, p[0]?.sobreId)}`
    default:
      return nombreSobre(sobres, p[0]?.sobreId)
  }
}

export function MovimientoRow({ movimiento, sobres, sobreIdFiltro, onClick }: MovimientoRowProps) {
  const { color, Icono } = estiloMovimiento(movimiento.tipo)
  const esTransferencia = movimiento.tipo === 'transferencia'

  // En el historial general una transferencia suma 0 (sale de un sobre y
  // entra a otro), así que se muestra el monto movido, sin signo.
  const monto = sobreIdFiltro
    ? movimiento.sobresParticipantes.find((p) => p.sobreId === sobreIdFiltro)?.monto ?? 0
    : esTransferencia
      ? movimiento.montoTotal ?? Math.abs(movimiento.sobresParticipantes[0]?.monto ?? 0)
      : movimiento.sobresParticipantes.reduce((acc, p) => acc + p.monto, 0)
  const neutro = esTransferencia && !sobreIdFiltro

  const titulo = tituloMovimiento(movimiento, sobres)

  const sobresDelIngreso = movimiento.sobresParticipantes
    .map((p) => sobres.find((s) => s.id === p.sobreId)?.nombre)
    .filter(Boolean)
    .join(', ')

  // Dentro del detalle de un sobre específico (sobreIdFiltro) no repetimos la
  // lista de los demás sobres participantes — ya estás viendo ese sobre en
  // particular, y mencionar a los otros solo genera confusión sobre a cuál
  // corresponde el monto mostrado.
  const subtitulo =
    movimiento.tipo === 'ingreso_repartido' && !sobreIdFiltro
      ? [movimiento.nota, sobresDelIngreso].filter(Boolean).join(' · ')
      : movimiento.nota ?? '—'

  const contenido = (
    <>
      <IconBadge color={color} size={34}>
        <Icono size={16} />
      </IconBadge>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-semibold">{titulo}</div>
        <div className="truncate text-[11px] text-ink-faint">
          {subtitulo} &middot; {formatFecha(movimiento.fecha)}
        </div>
      </div>
      <div
        className={`shrink-0 text-sm font-semibold ${
          neutro ? 'text-ink-soft' : monto >= 0 ? 'text-green' : ''
        }`}
      >
        {!neutro && monto >= 0 ? '+' : ''}
        {formatColones(monto)}
      </div>
    </>
  )

  const clases = 'flex w-full items-start gap-3 border-b border-border py-3 text-left last:border-b-0'

  return onClick ? (
    <button type="button" onClick={onClick} className={`${clases} active:bg-surface-2`}>
      {contenido}
    </button>
  ) : (
    <div className={clases}>{contenido}</div>
  )
}
