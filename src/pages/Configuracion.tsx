import { useRef, useState } from 'react'
import { useSobresStore } from '../lib/store'
import { respaldoValido } from '../lib/storage'
import { Header } from '../assets/components/organisms/Header'
import { DownloadIcon, UploadIcon } from '../assets/components/atoms/Icon'
import { Modal } from '../assets/components/atoms/Modal'
import { Button } from '../assets/components/atoms/Button'
import { formatFecha } from '../lib/format'
import type { RespaldoSobres } from '../types'

function formatearFechaRelativa(timestamp?: number): string {
  if (!timestamp) return 'Todavía no hiciste ningún respaldo'
  const dias = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000))
  if (dias <= 0) return 'Último respaldo: hoy'
  if (dias === 1) return 'Último respaldo: hace 1 día'
  return `Último respaldo: hace ${dias} días`
}

const OPCIONES_TEMA = [
  ['claro', 'Claro'],
  ['oscuro', 'Oscuro'],
  ['sistema', 'Sistema'],
] as const

export function Configuracion() {
  const {
    sobres,
    movimientos,
    exportarRespaldo,
    importarRespaldo,
    ultimoRespaldo,
    reiniciarRegistro,
    tema,
    setTema,
  } = useSobresStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmarReinicioAbierto, setConfirmarReinicioAbierto] = useState(false)
  const [respaldoPendiente, setRespaldoPendiente] = useState<RespaldoSobres | null>(null)
  const [errorImportar, setErrorImportar] = useState<string | null>(null)

  function confirmarReinicio() {
    reiniciarRegistro()
    setConfirmarReinicioAbierto(false)
  }

  function exportar() {
    const respaldo = exportarRespaldo()
    const blob = new Blob([JSON.stringify(respaldo, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zobro-respaldo-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function elegirArchivoImportar() {
    inputRef.current?.click()
  }

  async function onArchivoSeleccionado(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const texto = await file.text()
      const data = JSON.parse(texto)
      if (!respaldoValido(data)) {
        setErrorImportar('Ese archivo no tiene el formato de un respaldo de Zobro.')
        return
      }
      setRespaldoPendiente(data)
    } catch {
      setErrorImportar('No se pudo leer ese archivo.')
    }
  }

  function confirmarImportar() {
    if (respaldoPendiente) importarRespaldo(respaldoPendiente)
    setRespaldoPendiente(null)
  }

  return (
    <>
      <Header titulo="Configuración" />
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Apariencia</div>
          <div className="flex gap-2">
            {OPCIONES_TEMA.map(([valor, etiqueta]) => (
              <button
                key={valor}
                type="button"
                onClick={() => setTema(valor)}
                className={`flex-1 rounded-full px-3.5 py-2 text-[12.5px] ${
                  tema === valor
                    ? 'bg-green font-semibold text-surface'
                    : 'border border-border bg-surface font-medium text-ink-soft'
                }`}
              >
                {etiqueta}
              </button>
            ))}
          </div>
          <div className="px-0.5 text-[11.5px] text-ink-faint">
            "Sistema" sigue el modo claro/oscuro configurado en tu teléfono o navegador.
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Respaldo</div>

          <button
            type="button"
            onClick={exportar}
            className="flex items-center gap-3 rounded-2xl border-[1.5px] border-green px-4 py-3.5 text-green"
          >
            <UploadIcon size={17} />
            <span className="text-sm font-semibold">Exportar respaldo</span>
          </button>

          <button
            type="button"
            onClick={elegirArchivoImportar}
            className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3.5"
          >
            <DownloadIcon size={17} />
            <span className="text-sm font-semibold">Importar respaldo</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onArchivoSeleccionado}
          />

          <div className="px-0.5 text-[11.5px] text-ink-faint">
            Importar reemplaza por completo tus datos actuales. Antes de continuar vas a ver
            qué trae el archivo.
          </div>
          <div className="px-0.5 text-[11.5px] text-ink-faint">
            {formatearFechaRelativa(ultimoRespaldo)}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Zona de peligro</div>

          <button
            type="button"
            onClick={() => setConfirmarReinicioAbierto(true)}
            className="flex items-center gap-3 rounded-2xl border-[1.5px] border-red-400 px-4 py-3.5 text-red-500"
          >
            <span className="text-sm font-semibold">Reiniciar registro</span>
          </button>

          <div className="px-0.5 text-[11.5px] text-ink-faint">
            Borra todos los movimientos y deja los sobres en ₡0, sin tocar sus nombres,
            prioridades ni colores. Útil si los datos actuales son de prueba.
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2.5">
          <div className="text-[12.5px] text-ink-faint">Acerca de</div>
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4.5">
            <div className="font-display font-semibold text-base text-green">Zobro</div>
            <div className="text-[13px] leading-relaxed text-ink-soft">
              Guía visual para repartir tus ingresos por sobres, según tus propias
              prioridades. No se conecta a tu banco ni a ninguna cuenta — todos los datos
              quedan en este dispositivo.
            </div>
            <div className="mt-1 text-[11.5px] text-ink-faint">v0.2</div>
          </div>
        </div>
      </div>

      {confirmarReinicioAbierto && (
        <Modal
          titulo="¿Reiniciar registro?"
          onCerrar={() => setConfirmarReinicioAbierto(false)}
        >
          <div className="text-sm leading-relaxed text-ink-soft">
            Esto borra todo el historial de movimientos y deja el saldo de todos los sobres
            en ₡0. Los sobres (nombres, prioridades, colores) se mantienen. Esta acción no
            se puede deshacer.
          </div>
          <div className="flex gap-2.5">
            <Button
              variant="outline-green"
              className="flex-1"
              onClick={() => setConfirmarReinicioAbierto(false)}
            >
              Cancelar
            </Button>
            <Button variant="solid-red" className="flex-1" onClick={confirmarReinicio}>
              Sí, reiniciar
            </Button>
          </div>
        </Modal>
      )}
      {respaldoPendiente && (
        <Modal titulo="¿Importar este respaldo?" onCerrar={() => setRespaldoPendiente(null)}>
          <div className="flex flex-col gap-2 rounded-2xl border border-border p-3.5 text-[13px]">
            <div className="flex justify-between">
              <span className="text-ink-faint">Exportado el</span>
              <span className="font-semibold">
                {respaldoPendiente.exportadoEn ? formatFecha(respaldoPendiente.exportadoEn) : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-faint">Sobres</span>
              <span className="font-semibold">
                {respaldoPendiente.sobres.filter((s) => !s.archivado).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-faint">Movimientos</span>
              <span className="font-semibold">{respaldoPendiente.movimientos.length}</span>
            </div>
          </div>
          <div className="text-sm leading-relaxed text-ink-soft">
            Esto reemplaza por completo tus datos actuales ({sobres.filter((s) => !s.archivado).length}{' '}
            sobres y {movimientos.length} movimientos). Si no estás segura, exportá un
            respaldo de lo que tenés ahora antes de importar.
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline-green" className="flex-1" onClick={() => setRespaldoPendiente(null)}>
              Cancelar
            </Button>
            <Button variant="solid-green" className="flex-1" onClick={confirmarImportar}>
              Importar
            </Button>
          </div>
        </Modal>
      )}

      {errorImportar && (
        <Modal titulo="No se pudo importar" onCerrar={() => setErrorImportar(null)}>
          <div className="text-sm leading-relaxed text-ink-soft">{errorImportar}</div>
          <Button variant="solid-green" onClick={() => setErrorImportar(null)}>
            Entendido
          </Button>
        </Modal>
      )}
    </>
  )
}
