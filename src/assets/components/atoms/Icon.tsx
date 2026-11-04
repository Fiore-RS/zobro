import type { SVGProps } from 'react'
import type { SobreIcono } from '../../../types'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 16, ...props }: IconProps, children: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function GraduacionIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M2 9L12 4.5L22 9L12 13.5L2 9Z" />
      <path d="M6.5 11.2V16c0 1.4 2.8 2.7 5.5 2.7s5.5-1.3 5.5-2.7v-4.8" />
      <path d="M20 9.5v5.3" />
    </>
  ))
}

export function AvionIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M21 3L3 10.5l7 2.5 2.5 7L21 3Z" />
      <path d="M10 13l3.4 3.4" />
    </>
  ))
}

export function HojaIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 21V12" />
      <path d="M12 12c0-4.5 3.4-8 7.8-8 0 4.5-3.4 8-7.8 8Z" />
      <path d="M12 15.2c0-3-2.4-5.4-5.4-5.4 0 3 2.4 5.4 5.4 5.4Z" />
    </>
  ))
}

export function EscudoIcon(props: IconProps) {
  return base(props, <path d="M12 3l7 3v5c0 5-3.4 8.3-7 9.6-3.6-1.3-7-4.6-7-9.6V6l7-3Z" />)
}

export function CasaIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ))
}

export function EstrellaIcon(props: IconProps) {
  return base(props, (
    <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6L12 3Z" />
  ))
}

export function PlusIcon(props: IconProps) {
  return base(props, <path d="M12 5v14M5 12h14" />)
}

export function CheckIcon(props: IconProps) {
  return base(props, <path d="M5 13l4 4L19 7" />)
}

export function ChevronLeftIcon(props: IconProps) {
  return base(props, <path d="M15 6l-6 6 6 6" />)
}

export function ClockIcon(props: IconProps) {
  return base(props, (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.3 2" />
    </>
  ))
}

export function SlidersIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 7h10M18 7h2" />
      <circle cx="14" cy="7" r="2" />
      <path d="M4 12h4M12 12h8" />
      <circle cx="8" cy="12" r="2" />
      <path d="M4 17h10M18 17h2" />
      <circle cx="14" cy="17" r="2" />
    </>
  ))
}

export function DotsIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  )
}

export function DragHandleIcon(props: IconProps) {
  return base(props, (
    <path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" strokeWidth={2.2} />
  ))
}

export function ArrowUpIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </>
  ))
}

export function ArrowDownIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </>
  ))
}

export function CorazonIcon(props: IconProps) {
  return base(props, (
    <path d="M12 20.5C6.5 16.8 3 13.2 3 9.3 3 6.4 5.3 4 8.1 4c1.8 0 3.3 1 3.9 2.4C12.6 5 14.1 4 15.9 4 18.7 4 21 6.4 21 9.3c0 3.9-3.5 7.5-9 11.2Z" />
  ))
}

export function CarritoIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M3 4h2.2l2.4 11a2 2 0 0 0 2 1.6h7a2 2 0 0 0 2-1.6L20.5 8H6.3" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </>
  ))
}

export function ComidaIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M6 2v6a1.5 1.5 0 0 0 3 0V2" />
      <path d="M7.5 2v20" />
      <path d="M16.5 2c-1.7 0-3 2-3 5s1.3 5 3 5" />
      <path d="M16.5 2v20" />
    </>
  ))
}

export function AutoIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 16V11.5l2-4.5a2 2 0 0 1 1.8-1h8.4a2 2 0 0 1 1.8 1l2 4.5V16" />
      <path d="M4 16h16v3H4Z" />
      <path d="M4 11.5h16" />
      <circle cx="7.5" cy="16" r="1.3" />
      <circle cx="16.5" cy="16" r="1.3" />
    </>
  ))
}

export function RegaloIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 9h16v4H4Z" />
      <path d="M5 13h14v8H5Z" />
      <path d="M12 9v12" />
      <path d="M12 9c-1-2.5-3-4-4.5-3S6 9 8 9" />
      <path d="M12 9c1-2.5 3-4 4.5-3S18 9 16 9" />
    </>
  ))
}

export function MaletaIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M4 13h16" />
    </>
  ))
}

export function CruzIcon(props: IconProps) {
  return base(props, (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ))
}

export function MusicaIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M9 18V4.5L20 3v13.5" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16.5" r="2.5" />
    </>
  ))
}

export function LibroIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 5.5S6 4 12 4s8 1.5 8 1.5v14S18 18 12 18s-8 1.5-8 1.5Z" />
      <path d="M12 4v14" />
    </>
  ))
}

export function MascotaIcon(props: IconProps) {
  return base(props, (
    <>
      <ellipse cx="12" cy="16.6" rx="4.4" ry="3.5" />
      <circle cx="6.6" cy="10" r="1.7" />
      <circle cx="9.7" cy="6.3" r="1.4" />
      <circle cx="14.3" cy="6.3" r="1.4" />
      <circle cx="17.4" cy="10" r="1.7" />
    </>
  ))
}

export function LapizIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 20l1-4L16 5l3 3L8 19l-4 1Z" />
      <path d="M13.5 7.5l3 3" />
    </>
  ))
}

export function SobresIcon(props: IconProps) {
  return base(props, (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </>
  ))
}

export function DownloadIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 4v11" />
      <path d="M7.5 11l4.5 4.5 4.5-4.5" />
      <path d="M5 19h14" />
    </>
  ))
}

export function UploadIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M12 15V4" />
      <path d="M7.5 8l4.5-4.5L16.5 8" />
      <path d="M5 19h14" />
    </>
  ))
}

export function TransferIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4 8h14" />
      <path d="M14.5 4.5L18 8l-3.5 3.5" />
      <path d="M20 16H6" />
      <path d="M9.5 12.5L6 16l3.5 3.5" />
    </>
  ))
}

export function TrashIcon(props: IconProps) {
  return base(props, (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V4.5h5V7" />
      <path d="M6.5 7l.8 12.5h9.4L17.5 7" />
    </>
  ))
}

export function XIcon(props: IconProps) {
  return base(props, <path d="M6 6l12 12M18 6L6 18" />)
}

const ICONOS: Record<SobreIcono, (props: IconProps) => React.ReactElement> = {
  graduacion: GraduacionIcon,
  avion: AvionIcon,
  hoja: HojaIcon,
  escudo: EscudoIcon,
  casa: CasaIcon,
  estrella: EstrellaIcon,
  corazon: CorazonIcon,
  carrito: CarritoIcon,
  comida: ComidaIcon,
  auto: AutoIcon,
  regalo: RegaloIcon,
  maleta: MaletaIcon,
  cruz: CruzIcon,
  musica: MusicaIcon,
  libro: LibroIcon,
  mascota: MascotaIcon,
}

/** Devuelve el componente de ícono correspondiente a un SobreIcono. */
export function iconoDeSobre(icono: SobreIcono) {
  return ICONOS[icono]
}
