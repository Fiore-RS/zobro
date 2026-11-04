import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { fechaAInput, formatColones, inputAFecha } from '../lib/format'
import { CLASE_TEXTO } from '../lib/colores'
import { Header } from '../assets/components/organisms/Header'
import { SobreSelectRow } from '../assets/components/molecules/SobreSelectRow'
import { Button } from '../assets/components/atoms/Button'
import { IconBadge } from '../assets/components/atoms/IconBadge'
import { iconoDeSobre } from '../assets/components/atoms/Icon'
import { MontoInput } from '../assets/components/atoms/MontoInput'
import { FechaInput } from '../assets/components/atoms/FechaInput'
import { BarraAccion, Campo } from '../assets/components/atoms/Campo'

export function NuevoGasto() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sobres, registrarGasto, mostrarAviso } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)

  const preseleccionado = (location.state as { sobreId?: string } | null)?.sobreId
  // Si se entró desde un sobre específico (Detalle de sobre), ese sobre queda fijo:
  // no tendría sentido dejar elegir otro distinto al que originó la acción.
  const sobreFijo = activos.find((s) => s.id === preseleccionado)

  // Desde Inicio no se preselecciona ninguno: así no se registra un gasto
  // en el primer sobre de la lista por no haberse fijado.
  const [sobreId, setSobreId] = useState<string | undefined>(sobreFijo?.id)
  const [monto, setMonto] = useState('')
  const [nota, setNota] = useState('')
  const [fecha, setFecha] = useState(() => fechaAInput(Date.now()))

  const sobre = activos.find((s) => s.id === sobreId)
  const montoNumero = Number(monto) || 0
  const saldoNuevo = sobre ? sobre.saldoActual - montoNumero : 0
  const puedeConfirmar = !!sobre && montoNumero > 0
  const IconoFijo = sobreFijo ? iconoDeSobre(sobreFijo.icono) : undefined

  function confirmar() {
    if (!sobre || montoNumero <= 0) return
    const id = registrarGasto(sobre.id, montoNumero, nota || undefined, inputAFecha(fecha))
    mostrarAviso(`Gasto de ${formatColones(montoNumero)} en ${sobre.nombre}`, id)
    navigate(-1)
  }

  return (
    <>
      <Header titulo="Nuevo gasto" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-6 flex flex-col gap-6">
        <Campo etiqueta="¿Cuánto gastaste?">
          <MontoInput valor={monto} onChange={setMonto} borde="border-celeste" autoFocus />
        </Campo>

        {sobreFijo ? (
          <Campo etiqueta="Sale de">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5">
              <IconBadge color={sobreFijo.color} size={38}>
                {IconoFijo && <IconoFijo size={18} />}
              </IconBadge>
              <div className="min-w-0 flex-1">
                <div className="font-display font-semibold text-sm">{sobreFijo.nombre}</div>
                <div className="text-[11px] text-ink-faint">
                  Saldo {formatColones(sobreFijo.saldoActual)}
                </div>
              </div>
            </div>
          </Campo>
        ) : (
          <Campo etiqueta="¿De qué sobre sale?">
            <div className="flex flex-col gap-2">
              {activos.length === 0 && (
                <div className="text-sm text-ink-faint">Todavía no tenés sobres creados.</div>
              )}
              {activos.map((s) => (
                <SobreSelectRow
                  key={s.id}
                  nombre={s.nombre}
                  prioridad={s.prioridad}
                  detalle={formatColones(s.saldoActual)}
                  seleccionado={sobreId === s.id}
                  onToggle={() => setSobreId(s.id)}
                  tipo="radio"
                  color="celeste"
                  icono={s.icono}
                  colorSobre={s.color}
                />
              ))}
            </div>
          </Campo>
        )}

        <Campo etiqueta="Nota (opcional)">
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej. renta de setiembre"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none placeholder:text-ink-faint focus:border-celeste-mid"
          />
        </Campo>

        <FechaInput valor={fecha} onChange={setFecha} />
      </div>

      <BarraAccion
        resumen={
          sobre && montoNumero > 0 ? (
            <>
              {sobre.nombre}: {formatColones(sobre.saldoActual)} →{' '}
              <span className={`font-semibold ${saldoNuevo < 0 ? CLASE_TEXTO.rojo : 'text-ink'}`}>
                {formatColones(saldoNuevo)}
              </span>
              {saldoNuevo < 0 && <span className="block text-[11px] text-ink-faint">Va a quedar en negativo — podés cubrirlo después moviendo plata de otro sobre.</span>}
            </>
          ) : !sobre ? (
            'Elegí de qué sobre sale'
          ) : undefined
        }
      >
        <Button
          variant="solid-celeste"
          className="w-full disabled:opacity-40"
          disabled={!puedeConfirmar}
          onClick={confirmar}
        >
          Confirmar gasto
        </Button>
      </BarraAccion>
    </>
  )
}
