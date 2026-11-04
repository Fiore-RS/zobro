import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid-green' | 'solid-celeste' | 'outline-green' | 'outline-celeste' | 'solid-red'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
  children: ReactNode
}

const STYLES: Record<Variant, string> = {
  'solid-green': 'bg-green text-surface',
  'solid-celeste': 'bg-celeste text-surface',
  'outline-green': 'border-[1.5px] border-green text-green',
  'outline-celeste': 'border-[1.5px] border-celeste text-celeste',
  'solid-red': 'bg-red-500 text-surface',
}

export function Button({ variant = 'solid-green', icon, children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 px-4 font-semibold text-[15px] transition-[transform,opacity] duration-150 active:scale-[0.98] disabled:active:scale-100 ${STYLES[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
