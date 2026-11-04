const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

/** Formatea un monto en colones enteros, ej. 86000 -> "₡86,000". */
export function formatColones(monto: number): string {
  const signo = monto < 0 ? '-' : ''
  return `${signo}₡${numberFormatter.format(Math.abs(Math.round(monto)))}`
}

/** Formatea un número entero con separador de miles, sin símbolo: 250000 -> "250,000". */
export function formatMiles(monto: number): string {
  return numberFormatter.format(Math.round(monto))
}

export function formatPorcentaje(pct: number, decimales = 0): string {
  return `${pct.toFixed(decimales)}%`
}

const dateFormatter = new Intl.DateTimeFormat('es-CR', {
  day: 'numeric',
  month: 'long',
})

const dateFormatterConAnio = new Intl.DateTimeFormat('es-CR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** "4 de noviembre" si es de este año; "4 de noviembre de 2025" si no. */
export function formatFecha(timestamp: number): string {
  const d = new Date(timestamp)
  const esteAnio = d.getFullYear() === new Date().getFullYear()
  return (esteAnio ? dateFormatter : dateFormatterConAnio).format(d)
}

const mesFormatter = new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric' })

/** "Noviembre 2026" (con mayúscula inicial, sin "de"). */
export function formatMes(timestamp: number): string {
  const texto = mesFormatter.format(new Date(timestamp)).replace(' de ', ' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** Clave estable de mes para agrupar: "2026-11". */
export function claveMes(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/* ---------- Fechas para <input type="date"> ---------- */

/** Fecha local en formato "YYYY-MM-DD" (lo que usa <input type="date">). */
export function fechaAInput(timestamp: number): string {
  const d = new Date(timestamp)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/**
 * Convierte el valor de un <input type="date"> a timestamp. Si la fecha es
 * hoy, usa la hora actual (para que el orden dentro del día sea el real); si
 * es otro día, usa las 12:00 de ese día.
 */
export function inputAFecha(valor: string): number {
  if (!valor || valor === fechaAInput(Date.now())) return Date.now()
  const [y, m, d] = valor.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0).getTime()
}

/* ---------- Montos en letras ---------- */

const UNIDADES = [
  '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
  'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés',
  'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
]
const DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
const CENTENAS = [
  '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
  'seiscientos', 'setecientos', 'ochocientos', 'novecientos',
]

/** 0–999 en letras. */
function hastaMil(n: number): string {
  if (n === 0) return ''
  if (n === 100) return 'cien'
  const c = Math.floor(n / 100)
  const resto = n % 100
  let texto = CENTENAS[c]
  if (resto > 0) {
    let r: string
    if (resto < 30) r = UNIDADES[resto]
    else {
      const d = Math.floor(resto / 10)
      const u = resto % 10
      r = DECENAS[d] + (u ? ` y ${UNIDADES[u]}` : '')
    }
    texto = texto ? `${texto} ${r}` : r
  }
  return texto
}

/** "uno" → "un" al final de un grupo que va antes de "mil"/"millones". */
function apocopar(texto: string): string {
  if (texto.endsWith('veintiuno')) return texto.replace(/veintiuno$/, 'veintiún')
  return texto.replace(/uno$/, 'un')
}

/**
 * Número entero en letras, en español: 250000 → "doscientos cincuenta mil".
 * Soporta hasta 999,999,999,999.
 */
export function numeroALetras(monto: number): string {
  const n = Math.floor(Math.abs(monto))
  if (n === 0) return 'cero'

  const millones = Math.floor(n / 1_000_000)
  const miles = Math.floor((n % 1_000_000) / 1000)
  const unidades = n % 1000
  const partes: string[] = []

  if (millones > 0) {
    if (millones === 1) partes.push('un millón')
    else partes.push(`${apocopar(numeroALetras(millones))} millones`)
  }
  if (miles > 0) {
    partes.push(miles === 1 ? 'mil' : `${apocopar(hastaMil(miles))} mil`)
  }
  if (unidades > 0) partes.push(hastaMil(unidades))

  return partes.join(' ')
}

/** "doscientos cincuenta mil colones", "un colón", "un millón de colones". */
export function colonesEnLetras(monto: number): string {
  const n = Math.floor(Math.abs(monto))
  if (n === 1) return 'un colón'
  let texto = apocopar(numeroALetras(n))
  // "un millón de colones", "dos millones de colones" (pero "un millón cien mil colones")
  if (n % 1_000_000 === 0) texto += ' de'
  return `${texto} colones`
}
