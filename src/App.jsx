import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RutaPublica } from "./components/RutaPublica/RutaPublica";
import { ToastContainer } from "react-toastify";
import { RutaPublicaSinRedireccion } from "./components/RutaPublica/RutaPublicaSinRedireccion";
import Login from "./screens/Login/Login";
import Layout from "./screens/Layout/Layout";
import Preinscripcion from "./screens/Preinscripcion/Preinscripcion";
import RutaPrivada from "./components/RutaPrivada/RutaPrivada";
// import PanelAdministrador from "./screens/Administrador/PanelAdministrador/PanelAdministrador";
// const Dashboard = lazy(() => import('./screens/Dashboard/Dashboard'))
import Dashboard from "./screens/Dashboard/Dashboard";
import Perfil from "./screens/Perfil/Perfil";
import PreguntasFrecuentes from "./screens/PreguntasFrecuentes/PreguntasFrecuentes";
import AyudaAlumno from "./screens/AyudaAlumno/AyudaAlumno";
import GestionProfesores from "./screens/Administrador/GestionProfesores/GestionProfesores";
import GestionMateriasMenu from "./screens/Administrador/GestionMaterias/Menu/GestionMateriasMenu";
import GestionMateriasGenericas from "./screens/Administrador/GestionMaterias/MateriasGenericas/GestionMateriasGenericas";
import GestionMateriasPlan from "./screens/Administrador/GestionMaterias/MateriasPlan/GestionMateriasPlan";
import GestionMateriasPlanCiclo from "./screens/Administrador/GestionMaterias/MateriasPlanCiclo/GestionMateriasPlanCiclo";
import GestionPreinscriptos from "./screens/Administrador/GestionPreinscriptos/GestionPreinscriptos";
import GestionCarreras from "./screens/Administrador/GestionCarreras/GestionCarreras";
import GestionMaterias from "./screens/Administrador/GestionMaterias/GestionMaterias";
import GestionPlanes from "./screens/Administrador/GestionPlanes/GestionPlanes";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

function delayForDemo(promise, ms = 1500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      promise().then(resolve);
    }, ms);
  });
}

const PanelAdministrador = lazy(() =>
  delayForDemo(() =>
    import("./screens/Administrador/PanelAdministrador/PanelAdministrador")
  )
);

function App() {
  return (
    <Router basename="/alumnos2025">
      <AuthProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          hideProgressBar={false}
          theme="dark"
          closeOnClick={true}
        />
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/preinscripcion"
            element={
              <RutaPublica>
                <Preinscripcion />
              </RutaPublica>
            }
          />
          <Route
            path="/login"
            element={
              <RutaPublica>
                <Login />
              </RutaPublica>
            }
          />
          <Route
            path="/preguntas-frecuentes"
            element={
              <RutaPublicaSinRedireccion>
                <PreguntasFrecuentes />
              </RutaPublicaSinRedireccion>
            }
          />
          {/* Rutas privadas */}
          <Route element={<RutaPrivada />}>
            {/* Index */}
            <Route element={<Layout />}>
              {/* ---- Ruta usuario ---- */}
              <Route index element={<Dashboard />} />
              <Route path="mi-perfil" element={<Perfil />} />
              {/* ---- Ruta Alumno ---- */}
              <Route path="alumno" element={<RutaPrivada rol={["Alumno"]} />}>
                <Route path="ayuda" element={<AyudaAlumno />} />
              </Route>
              {/* ---- Ruta Profesor ---- */}
              <Route
                path="profesor"
                element={<RutaPrivada rol={["Profesor"]} />}
              ></Route>
              {/* ---- Ruta Administrador ---- */}
              <Route
                path="admin"
                element={<RutaPrivada rol={["Administrador"]} />}
              >
                <Route
                  index
                  element={
                    <Suspense
                      fallback={
                        <Box
                          sx={{
                            width: "100vw",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "fixed",
                            top: 0,
                            left: 0,
                            zIndex: 2000,
                            background: "rgba(255,255,255,0.7)", // opcional, para deshabilitar fondo
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      }
                    >
                      <PanelAdministrador />
                    </Suspense>
                  }
                />
                <Route
                  path="gestion-preinscriptos"
                  element={<GestionPreinscriptos />}
                />
                <Route path="gestion-carreras" element={<GestionCarreras />} />
                <Route path="gestion-planes" element={<GestionPlanes />} />
                <Route path="gestion-materias" element={<GestionMaterias />}>
                  <Route index element={<GestionMateriasMenu />} />
                  <Route
                    path="materias-base"
                    element={<GestionMateriasGenericas />}
                  />
                  <Route
                    path="materias-por-plan"
                    element={<GestionMateriasPlan />}
                  />
                  <Route
                    path="materias-por-ciclo"
                    element={<GestionMateriasPlanCiclo />}
                  />
                </Route>
                <Route
                  path="gestion-profesores"
                  element={<GestionProfesores />}
                />
              </Route>
            </Route>
          </Route>
          {/*<Route path='*' element={<NotFound />}/>*/}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
