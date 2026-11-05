import { useEffect, useState } from 'react'
import { LogoIcono } from '../atoms/LogoIcono'

/** Lo que dura la pantalla de carga al abrir la app (igual que en Teleo). */
const DURACION_MS = 2000
/** Lo que tarda en desvanecerse al terminar. */
const SALIDA_MS = 250

/**
 * Pantalla de carga al abrir la app: el ícono (sobre con billetes) pulsando sobre el degradado
 * verde → celeste de la marca. Se muestra encima de todo (la app ya está
 * montada debajo), y a los 2 segundos se desvanece y se quita.
 *
 * Usa los colores de marca fijos (--color-marca*), no los del tema, para
 * verse igual en modo claro y oscuro — y es el mismo dibujo que las
 * pantallas de arranque de iOS (public/splash), así el paso de una a la
 * otra no se nota.
 */
export function PantallaCarga() {
  const [fase, setFase] = useState<'visible' | 'saliendo' | 'fuera'>('visible')

  useEffect(() => {
    const t1 = setTimeout(() => setFase('saliendo'), DURACION_MS)
    const t2 = setTimeout(() => setFase('fuera'), DURACION_MS + SALIDA_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (fase === 'fuera') return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-marca to-marca-2 transition-opacity duration-250 ${
        fase === 'saliendo' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <LogoIcono size={96} className="animate-pulse" />
    </div>
  )
}
