import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Movimiento, RespaldoSobres, Sobre, Tema } from '../types'
import { calcularReparto, aplicarGasto } from './reparto'
import { formatColones } from './format'
import {
  cargarEstado,
  construirRespaldo,
  guardarEstado,
  migrar,
  pedirAlmacenamientoPersistente,
} from './storage'

interface NuevoSobreInput {
  nombre: string
  color: Sobre['color']
  icono: Sobre['icono']
  prioridad: number
  meta?: number
}

/** Aviso temporal (toast) con opción de deshacer un movimiento recién creado. */
export interface Aviso {
  id: number
  mensaje: string
  movimientoId?: string
}

interface SobresStoreValue {
  sobres: Sobre[]
  movimientos: Movimiento[]
  sumaPrioridadesActivas: number
  prioridadesValidas: boolean

  agregarSobre: (input: NuevoSobreInput) => void
  actualizarSobre: (id: string, cambios: Partial<Omit<Sobre, 'id'>>) => void
  archivarSobre: (id: string) => void
  reactivarSobre: (id: string) => void
  eliminarSobre: (id: string) => boolean
  reordenarSobres: (idsEnOrden: string[]) => void

  /** Todos los registrar* devuelven el id del movimiento creado. */
  registrarIngreso: (montoTotal: number, sobreIds: string[], nota?: string, fecha?: number) => string
  registrarGasto: (sobreId: string, monto: number, nota?: string, fecha?: number) => string
  registrarTransferencia: (
    origenId: string,
    destinoId: string,
    monto: number,
    nota?: string,
    fecha?: number,
  ) => string
  /** Cambia el saldo de un sobre dejando un movimiento "correccion_saldo". No hace nada si el saldo no cambia. */
  corregirSaldo: (sobreId: string, saldoNuevo: number) => void
  /** Borra el movimiento y revierte su efecto en los saldos. */
  eliminarMovimiento: (movimientoId: string) => void
  reiniciarRegistro: () => void

  exportarRespaldo: () => RespaldoSobres
  importarRespaldo: (data: RespaldoSobres) => void
  ultimoRespaldo?: number

  tema: Tema
  setTema: (tema: Tema) => void

  aviso: Aviso | null
  mostrarAviso: (mensaje: string, movimientoId?: string) => void
  cerrarAviso: () => void
}

const SobresStoreContext = createContext<SobresStoreValue | null>(null)

export function SobresStoreProvider({ children }: { children: ReactNode }) {
  const [estadoInicial] = useState(cargarEstado)
  const [sobres, setSobres] = useState<Sobre[]>(estadoInicial.sobres)
  const [movimientos, setMovimientos] = useState<Movimiento[]>(estadoInicial.movimientos)
  const [ultimoRespaldo, setUltimoRespaldo] = useState<number | undefined>(
    estadoInicial.configuracion.ultimoRespaldo,
  )
  const [tema, setTema] = useState<Tema>(estadoInicial.configuracion.tema ?? 'sistema')
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const contadorAvisos = useRef(0)

  useEffect(() => {
    pedirAlmacenamientoPersistente()
  }, [])

  useEffect(() => {
    guardarEstado({
      sobres,
      movimientos,
      configuracion: { moneda: 'CRC', ultimoRespaldo, tema },
    })
  }, [sobres, movimientos, ultimoRespaldo, tema])

  // Aplica la clase .dark al <html> según la preferencia elegida. En modo
  // "sistema" sigue (y escucha cambios de) la preferencia del sistema
  // operativo/navegador en tiempo real.
  useEffect(() => {
    const raiz = document.documentElement
    const medios = window.matchMedia('(prefers-color-scheme: dark)')

    function aplicar() {
      const oscuro = tema === 'oscuro' || (tema === 'sistema' && medios.matches)
      raiz.classList.toggle('dark', oscuro)
    }

    aplicar()

    if (tema === 'sistema') {
      medios.addEventListener('change', aplicar)
      return () => medios.removeEventListener('change', aplicar)
    }
  }, [tema])

  const mostrarAviso = useCallback((mensaje: string, movimientoId?: string) => {
    contadorAvisos.current += 1
    setAviso({ id: contadorAvisos.current, mensaje, movimientoId })
  }, [])

  const cerrarAviso = useCallback(() => setAviso(null), [])

  const sumaPrioridadesActivas = useMemo(
    () => sobres.filter((s) => !s.archivado).reduce((acc, s) => acc + s.prioridad, 0),
    [sobres],
  )

  const value = useMemo<SobresStoreValue>(() => {
    /** Suma `delta` al saldo de cada sobre indicado. */
    function aplicarDeltas(deltas: { sobreId: string; monto: number }[]) {
      setSobres((prev) =>
        prev.map((s) => {
          const total = deltas
            .filter((d) => d.sobreId === s.id)
            .reduce((acc, d) => acc + d.monto, 0)
          return total !== 0 ? { ...s, saldoActual: s.saldoActual + total } : s
        }),
      )
    }

    function agregarMovimiento(mov: Omit<Movimiento, 'id'>): string {
      const id = crypto.randomUUID()
      setMovimientos((prev) => [{ id, ...mov }, ...prev])
      return id
    }

    function agregarSobre(input: NuevoSobreInput) {
      setSobres((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          nombre: input.nombre,
          color: input.color,
          icono: input.icono,
          prioridad: input.prioridad,
          meta: input.meta,
          saldoActual: 0,
          orden: prev.length,
          archivado: false,
          creadoEn: Date.now(),
        },
      ])
    }

    function actualizarSobre(id: string, cambios: Partial<Omit<Sobre, 'id'>>) {
      setSobres((prev) => prev.map((s) => (s.id === id ? { ...s, ...cambios } : s)))
    }

    function archivarSobre(id: string) {
      actualizarSobre(id, { archivado: true })
    }

    function reactivarSobre(id: string) {
      actualizarSobre(id, { archivado: false })
    }

    function eliminarSobre(id: string): boolean {
      const sobre = sobres.find((s) => s.id === id)
      if (!sobre || sobre.saldoActual !== 0) return false
      setSobres((prev) => prev.filter((s) => s.id !== id))
      return true
    }

    function registrarIngreso(
      montoTotal: number,
      sobreIds: string[],
      nota?: string,
      fecha?: number,
    ): string {
      const seleccionados = sobres.filter((s) => sobreIds.includes(s.id))
      const reparto = calcularReparto(montoTotal, seleccionados)
      aplicarDeltas(reparto)
      return agregarMovimiento({
        tipo: 'ingreso_repartido',
        fecha: fecha ?? Date.now(),
        montoTotal,
        sobresParticipantes: reparto,
        nota,
      })
    }

    function registrarGasto(sobreId: string, monto: number, nota?: string, fecha?: number): string {
      setSobres((prev) =>
        prev.map((s) =>
          s.id === sobreId ? { ...s, saldoActual: aplicarGasto(s.saldoActual, monto) } : s,
        ),
      )
      return agregarMovimiento({
        tipo: 'ajuste_manual',
        fecha: fecha ?? Date.now(),
        sobresParticipantes: [{ sobreId, porcentajeAplicado: 100, monto: -Math.round(monto) }],
        nota,
      })
    }

    function registrarTransferencia(
      origenId: string,
      destinoId: string,
      monto: number,
      nota?: string,
      fecha?: number,
    ): string {
      const m = Math.round(monto)
      const participantes = [
        { sobreId: origenId, porcentajeAplicado: 100, monto: -m },
        { sobreId: destinoId, porcentajeAplicado: 100, monto: m },
      ]
      aplicarDeltas(participantes)
      return agregarMovimiento({
        tipo: 'transferencia',
        fecha: fecha ?? Date.now(),
        montoTotal: m,
        sobresParticipantes: participantes,
        nota,
      })
    }

    function corregirSaldo(sobreId: string, saldoNuevo: number) {
      const sobre = sobres.find((s) => s.id === sobreId)
      if (!sobre) return
      const diferencia = Math.round(saldoNuevo) - sobre.saldoActual
      if (diferencia === 0) return
      aplicarDeltas([{ sobreId, monto: diferencia }])
      agregarMovimiento({
        tipo: 'correccion_saldo',
        fecha: Date.now(),
        sobresParticipantes: [{ sobreId, porcentajeAplicado: 100, monto: diferencia }],
        nota: `De ${formatColones(sobre.saldoActual)} a ${formatColones(saldoNuevo)}`,
      })
    }

    function eliminarMovimiento(movimientoId: string) {
      const mov = movimientos.find((m) => m.id === movimientoId)
      if (!mov) return
      aplicarDeltas(mov.sobresParticipantes.map((p) => ({ sobreId: p.sobreId, monto: -p.monto })))
      setMovimientos((prev) => prev.filter((m) => m.id !== movimientoId))
      setAviso((a) => (a?.movimientoId === movimientoId ? null : a))
    }

    function reordenarSobres(idsEnOrden: string[]) {
      // Reasigna 'orden' 0..n-1 según el nuevo orden dado (típicamente tras un
      // drag-and-drop). Sobres que no vengan en la lista (p. ej. archivados)
      // mantienen su 'orden' actual.
      setSobres((prev) =>
        prev.map((s) => {
          const nuevoIndice = idsEnOrden.indexOf(s.id)
          return nuevoIndice === -1 ? s : { ...s, orden: nuevoIndice }
        }),
      )
    }

    function reiniciarRegistro() {
      // Deja los sobres tal cual (nombre, prioridad, color, ícono, meta) pero
      // en saldo cero, y borra todo el historial de movimientos. Pensado para
      // arrancar de cero cuando los datos actuales son de prueba, no reales.
      setSobres((prev) => prev.map((s) => ({ ...s, saldoActual: 0 })))
      setMovimientos([])
      setAviso(null)
    }

    function exportarRespaldo(): RespaldoSobres {
      const respaldo = construirRespaldo({
        sobres,
        movimientos,
        configuracion: { moneda: 'CRC', ultimoRespaldo, tema },
      })
      setUltimoRespaldo(Date.now())
      return respaldo
    }

    function importarRespaldo(data: RespaldoSobres) {
      const estado = migrar(data)
      setSobres(estado.sobres)
      setMovimientos(estado.movimientos)
      setUltimoRespaldo(Date.now())
      setAviso(null)
      if (estado.configuracion.tema) setTema(estado.configuracion.tema)
    }

    return {
      sobres,
      movimientos,
      sumaPrioridadesActivas,
      prioridadesValidas: Math.abs(sumaPrioridadesActivas - 100) < 0.01,
      agregarSobre,
      actualizarSobre,
      archivarSobre,
      reactivarSobre,
      eliminarSobre,
      reordenarSobres,
      registrarIngreso,
      registrarGasto,
      registrarTransferencia,
      corregirSaldo,
      eliminarMovimiento,
      reiniciarRegistro,
      exportarRespaldo,
      importarRespaldo,
      ultimoRespaldo,
      tema,
      setTema,
      aviso,
      mostrarAviso,
      cerrarAviso,
    }
  }, [
    sobres,
    movimientos,
    sumaPrioridadesActivas,
    ultimoRespaldo,
    tema,
    aviso,
    mostrarAviso,
    cerrarAviso,
  ])

  return (
    <SobresStoreContext.Provider value={value}>{children}</SobresStoreContext.Provider>
  )
}

export function useSobresStore(): SobresStoreValue {
  const ctx = useContext(SobresStoreContext)
  if (!ctx) throw new Error('useSobresStore debe usarse dentro de <SobresStoreProvider>')
  return ctx
}
