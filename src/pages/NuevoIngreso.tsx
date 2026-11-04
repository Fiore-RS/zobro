import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSobresStore } from '../lib/store'
import { calcularReparto } from '../lib/reparto'
import { fechaAInput, formatColones, formatPorcentaje, inputAFecha } from '../lib/format'
import { Header } from '../assets/components/organisms/Header'
import { SobreSelectRow } from '../assets/components/molecules/SobreSelectRow'
import { Button } from '../assets/components/atoms/Button'
import { MontoInput } from '../assets/components/atoms/MontoInput'
import { FechaInput } from '../assets/components/atoms/FechaInput'
import { BarraAccion, Campo } from '../assets/components/atoms/Campo'

export function NuevoIngreso() {
  const navigate = useNavigate()
  const { sobres, registrarIngreso, mostrarAviso } = useSobresStore()
  const activos = sobres.filter((s) => !s.archivado).sort((a, b) => a.orden - b.orden)

  const [monto, setMonto] = useState('')
  const [seleccionados, setSeleccionados] = useState<Set<string>>(
    () => new Set(activos.map((s) => s.id)),
  )
  const [nota, setNota] = useState('')
  const [fecha, setFecha] = useState(() => fechaAInput(Date.now()))

  const montoNumero = Number(monto) || 0

  const seleccion = activos.filter((s) => seleccionados.has(s.id))
  const reparto = useMemo(
    () => calcularReparto(montoNumero, seleccion),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [montoNumero, seleccionados],
  )
  const repartoPorSobre = new Map(reparto.map((r) => [r.sobreId, r]))
  const sumaRepartida = reparto.reduce((acc, r) => acc + r.monto, 0)

  function toggle(id: string) {
    setSeleccionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const todos = seleccionados.size === activos.length

  function confirmar() {
    if (montoNumero <= 0 || seleccion.length === 0) return
    const id = registrarIngreso(
      montoNumero,
      seleccion.map((s) => s.id),
      nota || undefined,
      inputAFecha(fecha),
    )
    mostrarAviso(`Ingreso de ${formatColones(montoNumero)} repartido`, id)
    navigate('/')
  }

  const puedeConfirmar = montoNumero > 0 && seleccion.length > 0

  return (
    <>
      <Header titulo="Nuevo ingreso" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-6 flex flex-col gap-6">
        <Campo etiqueta="¿Cuánto ingresó?">
          <MontoInput valor={monto} onChange={setMonto} borde="border-green" autoFocus />
        </Campo>

        <Campo
          etiqueta="Repartir entre"
          accion={
            activos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setSeleccionados(todos ? new Set() : new Set(activos.map((s) => s.id)))
                }
                className="text-[12px] font-semibold text-green"
              >
                {todos ? 'Ninguno' : 'Todos'}
              </button>
            )
          }
        >
          <div className="flex flex-col gap-2">
            {activos.map((s) => {
              const r = repartoPorSobre.get(s.id)
              const conMonto = r && montoNumero > 0
              return (
                <SobreSelectRow
                  key={s.id}
                  nombre={s.nombre}
                  prioridad={s.prioridad}
                  seleccionado={seleccionados.has(s.id)}
                  onToggle={() => toggle(s.id)}
                  color="green"
                  icono={s.icono}
                  colorSobre={s.color}
                  // Con monto escrito, cada fila muestra lo que le toca; si no, su prioridad.
                  detalle={conMonto ? `+${formatColones(r.monto)}` : formatPorcentaje(s.prioridad)}
                  subdetalle={conMonto ? `${formatPorcentaje(r.porcentajeAplicado, 1)}` : undefined}
                />
              )
            })}
          </div>
        </Campo>

        <Campo etiqueta="Nota (opcional)">
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej. quincena de setiembre"
            className="rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none placeholder:text-ink-faint focus:border-green-mid"
          />
        </Campo>

        <FechaInput valor={fecha} onChange={setFecha} />
      </div>

      <BarraAccion
        resumen={
          puedeConfirmar ? (
            <>
              <span className="font-semibold text-ink">{formatColones(sumaRepartida)}</span> en{' '}
              {seleccion.length} {seleccion.length === 1 ? 'sobre' : 'sobres'} · cuadra exacto
            </>
          ) : seleccion.length === 0 ? (
            'Elegí al menos un sobre'
          ) : undefined
        }
      >
        <Button
          variant="solid-green"
          className="w-full disabled:opacity-40"
          disabled={!puedeConfirmar}
          onClick={confirmar}
        >
          Confirmar reparto
        </Button>
      </BarraAccion>
    </>
  )
}
