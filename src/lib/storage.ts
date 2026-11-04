import { VERSION_DATOS } from '../types'
import type { Configuracion, Movimiento, RespaldoSobres, Sobre } from '../types'

const STORAGE_KEY = 'sobres:data:v1'

export interface EstadoAlmacenado {
  version: number
  sobres: Sobre[]
  movimientos: Movimiento[]
  configuracion: Configuracion
}

/**
 * Estado con el que arranca cualquier dispositivo nuevo: sin sobres, sin
 * movimientos. La app debe verse igual de "recién instalada" para cualquier
 * usuario nuevo, sin datos de ejemplo precargados.
 */
function estadoVacio(): EstadoAlmacenado {
  return {
    version: VERSION_DATOS,
    sobres: [],
    movimientos: [],
    configuracion: { moneda: 'CRC' },
  }
}

/**
 * Lleva datos de cualquier versión anterior al formato actual. Se usa tanto
 * al cargar desde localStorage como al importar un respaldo, así un archivo
 * exportado con una versión vieja de la app sigue funcionando.
 *
 * v1 → v2: solo se agregaron tipos de movimiento nuevos (transferencia y
 * correccion_saldo); los datos viejos son válidos tal cual.
 */
export function migrar(data: {
  version?: number
  sobres: Sobre[]
  movimientos: Movimiento[]
  configuracion: Configuracion
}): EstadoAlmacenado {
  const version = data.version ?? 1
  const estado: EstadoAlmacenado = {
    version,
    sobres: data.sobres,
    movimientos: data.movimientos,
    configuracion: data.configuracion,
  }

  if (estado.version < 2) {
    estado.version = 2
  }

  return estado
}

export function cargarEstado(): EstadoAlmacenado {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return estadoVacio()
    const parsed = JSON.parse(raw)
    if (!parsed.sobres || !parsed.movimientos || !parsed.configuracion) {
      return estadoVacio()
    }
    return migrar(parsed)
  } catch {
    return estadoVacio()
  }
}

export function guardarEstado(estado: Omit<EstadoAlmacenado, 'version'>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION_DATOS, ...estado }))
  } catch {
    // localStorage puede fallar (modo privado, cuota llena, etc.) — no rompemos la app por esto.
  }
}

/**
 * Le pide al navegador que no borre los datos de la app aunque el
 * dispositivo se quede sin espacio o la app no se abra por un tiempo
 * (especialmente importante en iPhone). El navegador puede decir que no;
 * en ese caso no pasa nada, solo seguimos como antes.
 */
export function pedirAlmacenamientoPersistente(): void {
  try {
    void navigator.storage?.persist?.()
  } catch {
    // no soportado — ignorar
  }
}

export function construirRespaldo(estado: Omit<EstadoAlmacenado, 'version'>): RespaldoSobres {
  return { version: VERSION_DATOS, ...estado, exportadoEn: Date.now() }
}

export function respaldoValido(data: unknown): data is RespaldoSobres {
  if (!data || typeof data !== 'object') return false
  const d = data as RespaldoSobres
  return Array.isArray(d.sobres) && Array.isArray(d.movimientos) && !!d.configuracion
}
