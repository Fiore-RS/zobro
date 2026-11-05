import { HashRouter, Route, Routes, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { SobresStoreProvider } from './lib/store'
import { BottomNav } from './assets/components/organisms/BottomNav'
import { Inicio } from './pages/Inicio'
import { NuevoIngreso } from './pages/NuevoIngreso'
import { GestionSobres } from './pages/GestionSobres'
import { DetalleSobre } from './pages/DetalleSobre'
import { NuevoGasto } from './pages/NuevoGasto'
import { Historial } from './pages/Historial'
import { Configuracion } from './pages/Configuracion'
import { Transferir } from './pages/Transferir'
import { Toast } from './assets/components/organisms/Toast'
import { PantallaCarga } from './assets/components/organisms/PantallaCarga'

/**
 * Marco fijo al viewport (fixed inset-0): así el documento nunca puede
 * hacer scroll por su cuenta, sin importar la altura del contenido — todo
 * el scroll queda contenido dentro de esta tarjeta. En pantallas anchas se
 * ve como una tarjeta centrada con ancho de celular; en el celular ocupa
 * toda la pantalla.
 */
function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex justify-center bg-surface-2 sm:py-6">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-bg sm:rounded-3xl">
        {children}
        <Toast />
      </div>
    </div>
  )
}

/**
 * Envuelve cada pantalla con una animación corta de entrada. La `key` por
 * ruta hace que React la vuelva a montar (y a animar) en cada navegación.
 */
function PantallaAnimada() {
  const { pathname } = useLocation()
  return (
    <div key={pathname} className="flex min-h-0 flex-1 flex-col animate-[entrar_200ms_ease-out]">
      <Outlet />
    </div>
  )
}

function LayoutConNav() {
  return (
    <AppFrame>
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
        <PantallaAnimada />
      </div>
      <BottomNav />
    </AppFrame>
  )
}

function LayoutSinNav() {
  return (
    <AppFrame>
      <PantallaAnimada />
    </AppFrame>
  )
}

function App() {
  return (
    <SobresStoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<LayoutConNav />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/sobres" element={<GestionSobres />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
          <Route element={<LayoutSinNav />}>
            <Route path="/nuevo-ingreso" element={<NuevoIngreso />} />
            <Route path="/nuevo-gasto" element={<NuevoGasto />} />
            <Route path="/transferir" element={<Transferir />} />
            <Route path="/sobres/:id" element={<DetalleSobre />} />
          </Route>
        </Routes>
      </HashRouter>
      <PantallaCarga />
    </SobresStoreProvider>
  )
}

export default App
