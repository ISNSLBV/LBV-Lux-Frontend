import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RutaPublica } from "./components/RutaPublica/RutaPublica";
import { ToastContainer } from "react-toastify";
import { RutaPublicaSinRedireccion } from "./components/RutaPublica/RutaPublicaSinRedireccion";
import Login from "./screens/Login/Login";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

//=======================
// Lazy loading de componentes
//=======================
const Layout = lazy(() => import("./screens/Layout/Layout"));
const RutaPrivada = lazy(() => import("./components/RutaPrivada/RutaPrivada"));
const Dashboard = lazy(() => import("./screens/Dashboard/Dashboard"));
const Preinscripcion = lazy(() => import("./screens/Preinscripcion/Preinscripcion"));
const Estadisticas = lazy(() => import("./screens/Administrador/Estadisticas/Estadisticas"));
const Perfil = lazy(() => import("./screens/Perfil/Perfil"));
const PreguntasFrecuentes = lazy(() => import("./screens/PreguntasFrecuentes/PreguntasFrecuentes"));
const GestionProfesores = lazy(() => import("./screens/Administrador/GestionProfesores/GestionProfesores"));
const AyudaAlumno = lazy(() => import("./screens/Alumno/AyudaAlumno/AyudaAlumno"));
const GestionMateriasMenu = lazy(() => import("./screens/Administrador/GestionMaterias/Menu/GestionMateriasMenu"));
const GestionMateriasBase = lazy(() => import("./screens/Administrador/GestionMaterias/MateriasBase/GestionMateriasBase"));
const GestionMateriasPlan = lazy(() => import("./screens/Administrador/GestionMaterias/MateriasPlan/GestionMateriasPlan"));
const GestionMateriasPlanCiclo = lazy(() => import("./screens/Administrador/GestionMaterias/MateriasPlanCiclo/GestionMateriasPlanCiclo"));
const GestionPreinscriptos = lazy(() => import("./screens/Administrador/GestionPreinscriptos/GestionPreinscriptos"));
const GestionCarreras = lazy(() => import("./screens/Administrador/GestionCarreras/GestionCarreras"));
const GestionMaterias = lazy(() => import("./screens/Administrador/GestionMaterias/GestionMaterias"));
const GestionPlanes = lazy(() => import("./screens/Administrador/GestionPlanes/GestionPlanes"));
const PanelAdministrador = lazy(() => import("./screens/Administrador/PanelAdministrador/PanelAdministrador"));
const GestionCorrelativas = lazy(() => import("./screens/Administrador/GestionMaterias/Correlativas/GestionCorrelativas"));
const AdministrarMateria = lazy(() => import("./screens/Administrador/GestionMaterias/MateriasPlanCiclo/AdministrarMateria/AdministrarMateria"));
const PanelProfesor = lazy(() => import("./screens/Profesor/PanelProfesor/PanelProfesor"));
const PanelAlumno = lazy(() => import("./screens/Alumno/PanelAlumno/PanelAlumno"));
const ConfiguracionCuenta = lazy(() => import("./screens/ConfiguracionCuenta/ConfiguracionCuenta"));
const GestionAlumnos = lazy(() => import("./screens/Administrador/GestionAlumnos/GestionAlumnos"));
const ConfiguracionSistema = lazy(() => import("./screens/Administrador/ConfiguracionSistema/ConfiguracionSistema"));
const Certificados = lazy(() => import("./screens/Administrador/Certificados/Certificados"));

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
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
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
                <Route path="cuenta" element={<ConfiguracionCuenta />} />
                {/* ---- Ruta Alumno ---- */}
                <Route path="alumno" element={<RutaPrivada rol={["Alumno"]} />}>
                  <Route index element={<PanelAlumno />} />
                  <Route path="ayuda" element={<AyudaAlumno />} />
                  <Route path="mi-perfil" element={<Perfil />} />
                </Route>
                {/* ---- Ruta Profesor ---- */}
                <Route
                  path="profesor"
                  element={<RutaPrivada rol={["Profesor"]} />}
                >
                  <Route index element={<PanelProfesor />} />
                  <Route path="materias-asignadas" element={<GestionMateriasPlanCiclo />}>
                    <Route path=":idMateria" element={<AdministrarMateria />} />
                  </Route>
                </Route>
                {/* ---- Ruta Administrador ---- */}
                <Route
                  path="admin"
                  element={<RutaPrivada rol={["Administrador"]} />}
                >
                  <Route index element={<PanelAdministrador />} />
                  <Route
                    path="preinscripciones"
                    element={<GestionPreinscriptos />}
                  />
                  <Route path="carreras" element={<GestionCarreras />} />
                  <Route path="planes-de-estudio" element={<GestionPlanes />} />
                  <Route path="materias" element={<GestionMaterias />}>
                    <Route index element={<GestionMateriasMenu />} />
                    <Route
                      path="materias-base"
                      element={<GestionMateriasBase />}
                    />
                    <Route
                      path="materias-por-plan"
                      element={<GestionMateriasPlan />}
                    />
                    <Route
                      path="materias-por-ciclo"
                      element={<GestionMateriasPlanCiclo />}
                    >
                      <Route
                        path=":idMateria"
                        element={<AdministrarMateria />}
                      />
                    </Route>
                    <Route
                      path="correlativas"
                      element={<GestionCorrelativas />}
                    />
                  </Route>
                  <Route path="profesores" element={<GestionProfesores />} />
                  <Route path="alumnos" element={<GestionAlumnos />} />
                  <Route path="certificados" element={<Certificados />} />
                  <Route path="estadisticas" element={<Estadisticas />} />
                  <Route
                    path="configuracion-sistema"
                    element={<ConfiguracionSistema />}
                  />
                  <Route path="perfil/:id" element={<Perfil />} />
                </Route>
              </Route>
            </Route>
            {/*<Route path='*' element={<NotFound />}/>*/}
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
