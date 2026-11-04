import { colonesEnLetras, formatMiles } from '../../../lib/format'

interface MontoInputProps {
  /** Solo dígitos, ej. "250000" (o "" si está vacío). */
  valor: string
  onChange: (valor: string) => void
  /** Clase del borde del recuadro, ej. "border-green". */
  borde?: string
  /** Variante grande (pantallas de ingreso/gasto) o compacta (formularios en modales). */
  tamano?: 'grande' | 'compacto'
  placeholder?: string
  /** Muestra el monto en letras debajo (para detectar un cero de más). */
  mostrarLetras?: boolean
  /** Permite montos negativos (solo para corregir saldo). */
  permitirNegativo?: boolean
  autoFocus?: boolean
}

/**
 * Input de montos en colones con separador de miles mientras escribís
 * ("250,000") y, opcionalmente, el monto en letras debajo. Internamente el
 * valor siempre es una cadena de solo dígitos para que `Number(valor)`
 * funcione sin más.
 */
export function MontoInput({
  valor,
  onChange,
  borde = 'border-border',
  tamano = 'grande',
  placeholder = '0',
  mostrarLetras = tamano === 'grande',
  permitirNegativo = false,
  autoFocus,
}: MontoInputProps) {
  const negativo = permitirNegativo && valor.startsWith('-')
  const digitos = valor.replace(/\D/g, '')
  const numero = Number(digitos) || 0
  const mostrado = digitos === '' ? (negativo ? '-' : '') : `${negativo ? '-' : ''}${formatMiles(numero)}`

  function cambiar(texto: string) {
    const neg = permitirNegativo && texto.trim().startsWith('-')
    // Quita ceros a la izquierda y limita a 12 dígitos (hasta ₡999 mil millones).
    const limpio = texto.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 12)
    onChange(`${neg ? '-' : ''}${limpio}`)
  }

  const grande = tamano === 'grande'
  // Anillo suave al enfocar, del mismo color que el borde.
  const anillo =
    borde === 'border-green'
      ? 'focus-within:ring-4 focus-within:ring-green-soft'
      : borde === 'border-celeste'
        ? 'focus-within:ring-4 focus-within:ring-celeste-soft'
        : 'focus-within:border-ink-faint'

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`flex items-center gap-1 bg-surface transition-shadow ${anillo} ${
          grande ? `rounded-2xl border-[1.5px] px-4.5 py-4 ${borde}` : `rounded-xl border px-3 py-2.5 ${borde}`
        }`}
      >
        <span
          className={
            grande ? 'font-display font-semibold text-[28px] text-ink-faint' : 'text-sm text-ink-faint'
          }
        >
          ₡
        </span>
        <input
          type="text"
          inputMode={permitirNegativo ? 'text' : 'numeric'}
          autoComplete="off"
          value={mostrado}
          onChange={(e) => cambiar(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full min-w-0 bg-transparent outline-none placeholder:text-ink-faint ${
            grande ? 'font-display font-semibold text-[28px]' : 'text-sm'
          }`}
        />
      </div>
      {mostrarLetras && numero > 0 && (
        <div className="px-1 text-[11.5px] text-ink-faint first-letter:uppercase">
          {negativo ? 'menos ' : ''}
          {colonesEnLetras(numero)}
        </div>
      )}
    </div>
  )
}
