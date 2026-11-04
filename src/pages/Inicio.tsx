import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { formatColones } from '../lib/format'
import { delMesActual, resumir } from '../lib/resumen'
import { SobreCard } from '../assets/components/molecules/SobreCard'
import { ArrowUpIcon, PlusIcon, TransferIcon, XIcon } from '../assets/components/atoms/Icon'

const DIAS_AVISO_RESPALDO = 14
const DIA_MS = 24 * 60 * 60 * 1000

export function Inicio() {
  const navigate = useNavigate()
  const { sobres, movimientos, ultimoRespaldo } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)
  const total = activos.reduce((acc, s) => acc + s.saldoActual, 0)
  const mes = resumir(delMesActual(movimientos))
  const nombreMes = new Date().toLocaleDateString('es-CR', { month: 'long' })

  // Modo "sumar sobres": tocar tarjetas para ver cuánto suman juntas.
  const [sumando, setSumando] = useState(false)
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set())
  const seleccionados = activos.filter((s) => seleccion.has(s.id))
  const totalSeleccion = seleccionados.reduce((acc, s) => acc + s.saldoActual, 0)

  function toggle(id: string) {
    setSeleccion((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function salirDeSuma() {
    setSumando(false)
    setSeleccion(new Set())
  }

  // Aviso de respaldo: solo si ya hay datos reales que perder. Se puede
  // ocultar por esta vez; vuelve a aparecer la próxima vez que se abra la app.
  const [avisoOculto, setAvisoOculto] = useState(false)
  const diasSinRespaldo = ultimoRespaldo
    ? Math.floor((Date.now() - ultimoRespaldo) / DIA_MS)
    : undefined
  const mostrarAvisoRespaldo =
    !avisoOculto &&
    movimientos.length > 0 &&
    (diasSinRespaldo === undefined || diasSinRespaldo >= DIAS_AVISO_RESPALDO)

  return (
    <div className="flex h-full flex-col">
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="font-display text-sm font-semibold tracking-[0.14em] text-green">
              SOBRES
            </div>
            <div className="text-[12px] text-ink-faint first-letter:uppercase">
              {new Date().toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>

          {/* Tarjeta principal: total y resumen del mes */}
          <div className="overflow-hidden rounded-3xl bg-green px-5 pb-5 pt-4.5 text-surface shadow-[0_10px_30px_-12px] shadow-green/60">
            <div className="relative">
              <div className="flex items-baseline justify-between gap-3">
                <div className="shrink-0 text-[12.5px] opacity-80">Total en tus sobres</div>
                {/* Resumen del mes en curso */}
                <div className="flex min-w-0 gap-2.5 text-[11.5px]" title={`Movimientos de ${nombreMes}`}>
                  <span className="whitespace-nowrap">
                    <span className="opacity-75">Entró </span>
                    <span className="font-semibold">{formatColones(mes.entro)}</span>
                  </span>
                  <span className="whitespace-nowrap">
                    <span className="opacity-75">Salió </span>
                    <span className="font-semibold">{formatColones(mes.salio)}</span>
                  </span>
                </div>
              </div>
              <div className="mt-0.5 font-display text-[36px] font-semibold leading-tight">
                {formatColones(total)}
              </div>
              {/* Acciones principales, integradas en la tarjeta del total */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(
                  [
                    { etiqueta: 'Ingreso', Icono: PlusIcon, ruta: '/nuevo-ingreso', deshabilitado: false },
                    {
                      etiqueta: 'Gasto',
                      Icono: ArrowUpIcon,
                      ruta: '/nuevo-gasto',
                      deshabilitado: activos.length === 0,
                    },
                    {
                      etiqueta: 'Mover',
                      Icono: TransferIcon,
                      ruta: '/transferir',
                      deshabilitado: activos.length < 2,
                    },
                  ] as const
                ).map(({ etiqueta, Icono, ruta, deshabilitado }) => (
                  <button
                    key={ruta}
                    type="button"
                    onClick={() => navigate(ruta)}
                    disabled={deshabilitado}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-surface/15 py-2.5 text-[13.5px] font-semibold transition hover:bg-surface/20 active:scale-[0.97] active:bg-surface/25 disabled:opacity-40"
                  >
                    <Icono size={15} strokeWidth={2.2} />
                    {etiqueta}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {mostrarAvisoRespaldo && (
            <div className="flex items-start gap-2.5 rounded-xl bg-celeste-soft px-3.5 py-2.5">
              <Link to="/configuracion" className="flex-1 text-[12.5px] leading-snug text-celeste">
                <span className="font-semibold">
                  {diasSinRespaldo === undefined
                    ? 'Todavía no respaldaste tus datos.'
                    : `Hace ${diasSinRespaldo} días que no respaldás tus datos.`}
                </span>{' '}
                Exportá un respaldo en Ajustes por si se borra el navegador.
              </Link>
              <button
                type="button"
                onClick={() => setAvisoOculto(true)}
                aria-label="Ocultar aviso"
                className="mt-0.5 text-celeste opacity-70"
              >
                <XIcon size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="font-display text-[16px] font-semibold">
              {sumando ? 'Tocá los sobres a sumar' : 'Tus sobres'}
            </div>
            {activos.length > 1 && (
              <button
                type="button"
                onClick={() => (sumando ? salirDeSuma() : setSumando(true))}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                  sumando ? 'bg-ink text-surface' : 'bg-surface-2 text-ink-soft'
                }`}
              >
                {sumando ? 'Listo' : 'Sumar sobres'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {activos.length === 0 && (
              <div className="col-span-2 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-ink-faint">
                Creá tu primer sobre en la pestaña{' '}
                <Link to="/sobres" className="font-semibold text-green">
                  Sobres
                </Link>
                .
              </div>
            )}
            {activos.map((sobre) => (
              <SobreCard
                key={sobre.id}
                sobre={sobre}
                seleccionable={sumando}
                seleccionado={seleccion.has(sobre.id)}
                onToggle={() => toggle(sobre.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {sumando && (
        <div className="shrink-0 border-t border-border bg-surface px-5 py-3 animate-[aparecer_180ms_ease-out]">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11.5px] text-ink-faint">
                {seleccionados.length === 0
                  ? 'Ningún sobre seleccionado'
                  : `${seleccionados.length} ${seleccionados.length === 1 ? 'sobre' : 'sobres'} · ${seleccionados
                      .map((s) => s.nombre)
                      .join(', ')}`}
              </div>
              <div className="font-display text-[24px] font-semibold leading-tight">
                {formatColones(totalSeleccion)}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setSeleccion(
                  seleccion.size === activos.length ? new Set() : new Set(activos.map((s) => s.id)),
                )
              }
              className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-[12.5px] font-semibold text-ink-soft"
            >
              {seleccion.size === activos.length ? 'Ninguno' : 'Todos'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
