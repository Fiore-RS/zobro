export interface Sobre {
  id: string
  nombre: string
  color: SobreColor
  icono: SobreIcono
  prioridad: number // porcentaje, 0-100, hasta 1 decimal
  saldoActual: number // colones
  meta?: number // monto objetivo opcional
  orden: number
  archivado: boolean
  creadoEn: number // timestamp
}

export type SobreColor =
  | 'green'
  | 'celeste'
  | 'azul'
  | 'morado'
  | 'rosa'
  | 'rojo'
  | 'naranja'
  | 'amarillo'
  | 'oliva'
  | 'gris'

export type SobreIcono =
  | 'graduacion'
  | 'avion'
  | 'hoja'
  | 'escudo'
  | 'casa'
  | 'estrella'
  | 'corazon'
  | 'carrito'
  | 'comida'
  | 'auto'
  | 'regalo'
  | 'maleta'
  | 'cruz'
  | 'musica'
  | 'libro'
  | 'mascota'

/**
 * - ingreso_repartido: un ingreso dividido entre varios sobres.
 * - ajuste_manual: un gasto/retiro de un solo sobre (se mantiene el nombre
 *   original para que los respaldos viejos sigan siendo compatibles).
 * - transferencia: dinero movido de un sobre a otro (2 participantes, uno
 *   negativo y uno positivo; la suma siempre da 0).
 * - correccion_saldo: corrección manual del saldo de un sobre desde
 *   "Gestión de sobres", para que quede rastro de por qué cambió.
 */
export type TipoMovimiento =
  | 'ingreso_repartido'
  | 'ajuste_manual'
  | 'transferencia'
  | 'correccion_saldo'

export interface MovimientoParticipante {
  sobreId: string
  porcentajeAplicado: number // el % ya recalculado para este movimiento
  monto: number // positivo (ingreso) o negativo (retiro/gasto)
}

export interface Movimiento {
  id: string
  tipo: TipoMovimiento
  fecha: number // timestamp
  montoTotal?: number // solo para tipo "ingreso_repartido"
  sobresParticipantes: MovimientoParticipante[]
  nota?: string
}

export type Tema = 'claro' | 'oscuro' | 'sistema'

export interface Configuracion {
  moneda: 'CRC'
  ultimoRespaldo?: number // timestamp
  tema?: Tema // por defecto 'sistema' si no está definido
}

/** Versión actual del formato de datos (localStorage y respaldos). */
export const VERSION_DATOS = 2

export interface RespaldoSobres {
  /** Ausente en respaldos de la v0.1 (equivale a 1). */
  version?: number
  sobres: Sobre[]
  movimientos: Movimiento[]
  configuracion: Configuracion
  exportadoEn: number
}
