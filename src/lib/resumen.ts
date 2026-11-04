import type { Movimiento } from '../types'
import { claveMes } from './format'

export interface ResumenPeriodo {
  /** Total que entró por ingresos repartidos (o, si se filtra por sobre, también por transferencias recibidas). */
  entro: number
  /** Total que salió por gastos (o, si se filtra por sobre, también por transferencias enviadas). Positivo. */
  salio: number
}

/**
 * Suma lo que entró y salió en una lista de movimientos.
 *
 * - Sin `sobreId` (vista general): solo cuentan ingresos y gastos. Las
 *   transferencias suman 0 en total y las correcciones no son plata "real"
 *   entrando o saliendo, así que se ignoran.
 * - Con `sobreId`: cuenta todo lo que movió el saldo de ESE sobre, incluidas
 *   transferencias (entrantes y salientes), pero no las correcciones.
 */
export function resumir(movimientos: Movimiento[], sobreId?: string): ResumenPeriodo {
  let entro = 0
  let salio = 0
  for (const m of movimientos) {
    if (m.tipo === 'correccion_saldo') continue
    if (!sobreId && m.tipo === 'transferencia') continue
    for (const p of m.sobresParticipantes) {
      if (sobreId && p.sobreId !== sobreId) continue
      if (p.monto >= 0) entro += p.monto
      else salio += -p.monto
    }
  }
  return { entro, salio }
}

/** Movimientos del mes calendario actual. */
export function delMesActual(movimientos: Movimiento[]): Movimiento[] {
  const clave = claveMes(Date.now())
  return movimientos.filter((m) => claveMes(m.fecha) === clave)
}
