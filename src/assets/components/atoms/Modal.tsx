import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

/**
 * Popup con fondo oscurecido. En el celular sube desde abajo como una hoja
 * (más fácil de alcanzar con el pulgar); en pantallas anchas queda centrado.
 * Clic en el fondo o Escape lo cierran.
 */
export function Modal({ titulo, onCerrar, children }: ModalProps) {
  useEffect(() => {
    function alTeclear(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [onCerrar])

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/45 backdrop-blur-[2px] animate-[desvanecer_160ms_ease-out] sm:items-center sm:px-5 sm:py-6">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="relative z-10 flex max-h-[90%] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-3xl bg-surface p-5 pb-7 shadow-xl animate-[subir_220ms_cubic-bezier(0.2,0.8,0.2,1)] sm:max-w-sm sm:rounded-3xl sm:pb-5"
      >
        <div className="mx-auto -mt-1.5 h-1 w-9 shrink-0 rounded-full bg-border sm:hidden" aria-hidden />
        <div className="font-display text-lg font-semibold">{titulo}</div>
        {children}
      </div>
    </div>
  )
}
