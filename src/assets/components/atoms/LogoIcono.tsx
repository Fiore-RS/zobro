interface LogoIconoProps {
  /** Ancho en px (el alto sale de la proporción del dibujo). */
  size?: number
  className?: string
  /**
   * Con fondo (por defecto) es el ícono instalable completo, con el cuadro
   * verde redondeado. Sin fondo es solo el logo (sobre + billetes), recortado
   * a su tamaño, para ponerlo sobre otro fondo como la pantalla de carga.
   */
  fondo?: boolean
}

/** Recorte del dibujo sin el cuadro de fondo: x 80–432, y 104–420. */
const VIEWBOX_SOLO_LOGO = { x: 80, y: 104, w: 352, h: 316 }

/**
 * Ícono de la app: un sobre abierto con tres billetes saliendo en abanico.
 * Es el mismo dibujo de public/icons/*.png y de las pantallas de arranque,
 * con colores fijos para que se vea igual en modo claro y oscuro.
 */
export function LogoIcono({ size = 96, className, fondo = true }: LogoIconoProps) {
  const v = fondo ? { x: 0, y: 0, w: 512, h: 512 } : VIEWBOX_SOLO_LOGO
  return (
    <svg
      width={size}
      height={(size * v.h) / v.w}
      viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`}
      role="img"
      aria-label="Zobro"
      className={className}
    >
      {fondo && <rect width="512" height="512" rx="112" fill="#2f5a42" />}
      {/* Solapa abierta e interior del sobre */}
      <path
        d="M104 250 L256 134 L408 250 Z"
        fill="#e3ded2"
        stroke="#e3ded2"
        strokeWidth="16"
        strokeLinejoin="round"
      />
      <rect x="96" y="242" width="320" height="170" rx="24" fill="#cfc9bc" />
      {/* Billetes en abanico */}
      <Billete color="#4a8fb3" opacidad={0.55} transform="rotate(-15 256 392)" y={150} />
      <Billete color="#78bb91" opacidad={0.6} y={112} />
      <Billete color="#7ab8d6" opacidad={0.65} transform="rotate(14 256 392)" y={150} />
      {/* Bolsillo del frente */}
      <path
        d="M96 286 L256 350 L416 286 V388 A24 24 0 0 1 392 412 H120 A24 24 0 0 1 96 388 Z"
        fill="#f7f5f0"
      />
    </svg>
  )
}

function Billete({
  color,
  opacidad,
  transform,
  y,
}: {
  color: string
  opacidad: number
  transform?: string
  y: number
}) {
  return (
    <g transform={transform}>
      <rect x="146" y={y} width="220" height="130" rx="12" fill={color} />
      <rect
        x="160"
        y={y + 14}
        width="192"
        height="102"
        rx="7"
        fill="none"
        stroke="#f7f5f0"
        strokeOpacity={opacidad}
        strokeWidth="6"
      />
      <circle
        cx="314"
        cy={y + 54}
        r="20"
        fill="none"
        stroke="#f7f5f0"
        strokeOpacity={opacidad}
        strokeWidth="6"
      />
    </g>
  )
}
