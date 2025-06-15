import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './screens/Login/Login'
import Layout from './components/Layout/Layout'
import Preinscripcion from './screens/Preinscripcion/Preinscripcion'
import RutaPrivada from './components/RutaPrivada/RutaPrivada'
import PanelAdministrador from './screens/Administrador/PanelAdministrador/PanelAdministrador'
import Dashboard from './screens/Dashboard/Dashboard'
import Perfil from './screens/Perfil/Perfil'
import GestionPreinscriptos from './screens/Administrador/GestionPreinscriptos/GestionPreinscriptos'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path='/preinscripcion' element={<Preinscripcion />} />
          <Route path='/login' element={<Login />} />
          {/* Rutas privadas */}
          <Route element={<RutaPrivada />}>
            {/* Index */}
            <Route element={<Layout />}>
              {/* ---- Ruta usuario ---- */}
              <Route index element={<Dashboard />} />
              <Route path='mi-perfil' element={<Perfil />} />
              {/* ---- Ruta Administrador ---- */}
              <Route path='admin' element={<RutaPrivada roles={['Administrador']} />}>
                <Route index element={<PanelAdministrador />} />
                <Route path='gestion-preinscriptos' element={<GestionPreinscriptos />} />
              </Route>
            </Route>
          </Route>
          {/*<Route path='*' element={<NotFound />}/>*/}
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
