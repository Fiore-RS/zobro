import { NavLink } from 'react-router-dom'
import { CasaIcon, ClockIcon, SlidersIcon, SobresIcon } from '../atoms/Icon'

const ITEMS = [
  { to: '/', label: 'Inicio', Icon: CasaIcon },
  { to: '/sobres', label: 'Sobres', Icon: SobresIcon },
  { to: '/historial', label: 'Historial', Icon: ClockIcon },
  { to: '/configuracion', label: 'Ajustes', Icon: SlidersIcon },
]

export function BottomNav() {
  return (
    <nav className="flex h-[74px] shrink-0 items-center justify-around border-t border-border bg-surface pb-2.5 pt-2">
      {ITEMS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex min-w-16 flex-col items-center gap-1 transition-colors ${isActive ? 'text-green' : 'text-ink-faint'}`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors duration-200 ${
                  isActive ? 'bg-green-soft' : ''
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.1 : 1.8} />
              </span>
              <span className={`text-[10.5px] ${isActive ? 'font-semibold' : ''}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
