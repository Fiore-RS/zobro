import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { fechaAInput, formatColones, inputAFecha } from '../lib/format'
import { CLASE_TEXTO } from '../lib/colores'
import { Header } from '../assets/components/organisms/Header'
import { SobreSelectRow } from '../assets/components/molecules/SobreSelectRow'
import { Button } from '../assets/components/atoms/Button'
import { MontoInput } from '../assets/components/atoms/MontoInput'
import { FechaInput } from '../assets/components/atoms/FechaInput'
import { BarraAccion, Campo } from '../assets/components/atoms/Campo'

/**
 * Mover dinero de un sobre a otro sin que cuente como gasto ni ingreso
 * (ej. "me pasé en Comida, saco ₡10,000 de Ocio"). Queda en el historial
 * como un solo movimiento de tipo "transferencia".
 */
export function Transferir() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sobres, registrarTransferencia, mostrarAviso } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)

  const estado = location.state as { origenId?: string; destinoId?: string } | null
  const [origenId, setOrigenId] = useState<string | undefined>(estado?.origenId)
  const [destinoId, setDestinoId] = useState<string | undefined>(estado?.destinoId)
  const [monto, setMonto] = useState('')
  const [nota, setNota] = useState('')
  const [fecha, setFecha] = useState(() => fechaAInput(Date.now()))

  const origen = activos.find((s) => s.id === origenId)
  const destino = activos.find((s) => s.id === destinoId && s.id !== origenId)
  const montoNumero = Number(monto) || 0
  const puedeConfirmar = !!origen && !!destino && montoNumero > 0
  const origenQueda = origen ? origen.saldoActual - montoNumero : 0

  function elegirOrigen(id: string) {
    setOrigenId(id)
    if (destinoId === id) setDestinoId(undefined)
  }

  function confirmar() {
    if (!origen || !destino || montoNumero <= 0) return
    const id = registrarTransferencia(
      origen.id,
      destino.id,
      montoNumero,
      nota || undefined,
      inputAFecha(fecha),
    )
    mostrarAviso(`${formatColones(montoNumero)} de ${origen.nombre} a ${destino.nombre}`, id)
    navigate(-1)
  }

  return (
    <>
      <Header titulo="Mover entre sobres" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-6 flex flex-col gap-6">
        <Campo etiqueta="¿Cuánto vas a mover?">
          <MontoInput valor={monto} onChange={setMonto} borde="border-celeste" autoFocus />
        </Campo>

        <Campo etiqueta="Sale de">
          <div className="flex flex-col gap-2">
            {activos.map((s) => (
              <SobreSelectRow
                key={s.id}
                nombre={s.nombre}
                prioridad={s.prioridad}
                detalle={formatColones(s.saldoActual)}
                seleccionado={origenId === s.id}
                onToggle={() => elegirOrigen(s.id)}
                tipo="radio"
                color="celeste"
                icono={s.icono}
                colorSobre={s.color}
              />
            ))}
          </div>
        </Campo>

        {origen && (
          <Campo etiqueta="Entra a">
            <div className="flex flex-col gap-2">
              {activos
                .filter((s) => s.id !== origen.id)
                .map((s) => (
                  <SobreSelectRow
                    key={s.id}
                    nombre={s.nombre}
                    prioridad={s.prioridad}
                    detalle={formatColones(s.saldoActual)}
                    seleccionado={destinoId === s.id}
                    onToggle={() => setDestinoId(s.id)}
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
            placeholder="Ej. cubrir súper de la semana"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none placeholder:text-ink-faint focus:border-celeste-mid"
          />
        </Campo>

        <FechaInput valor={fecha} onChange={setFecha} />
      </div>

      <BarraAccion
        resumen={
          puedeConfirmar ? (
            <div className="flex flex-col gap-0.5">
              <div>
                {origen.nombre}: {formatColones(origen.saldoActual)} →{' '}
                <span className={`font-semibold ${origenQueda < 0 ? CLASE_TEXTO.rojo : 'text-ink'}`}>
                  {formatColones(origenQueda)}
                </span>
              </div>
              <div>
                {destino.nombre}: {formatColones(destino.saldoActual)} →{' '}
                <span className="font-semibold text-ink">
                  {formatColones(destino.saldoActual + montoNumero)}
                </span>
              </div>
            </div>
          ) : !origen ? (
            'Elegí de qué sobre sale'
          ) : !destino ? (
            'Elegí a qué sobre entra'
          ) : undefined
        }
      >
        <Button
          variant="solid-celeste"
          className="w-full disabled:opacity-40"
          disabled={!puedeConfirmar}
          onClick={confirmar}
        >
          Confirmar movimiento
        </Button>
      </BarraAccion>
    </>
  )
}
