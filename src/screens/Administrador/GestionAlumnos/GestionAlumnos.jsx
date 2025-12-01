import React, { useState } from "react";
import Boton from "../../../components/Boton/Boton";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./GestionAlumnos.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import api from "../../../api/axios";
import { formatearFecha } from "../../../utils/dateUtils";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Eye, ChevronDown, ChevronUp, UserX, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";

const fetchAlumnos = async (filtros) => {
  const params = new URLSearchParams();

  if (filtros.activo !== null) {
    params.append("activo", filtros.activo);
  }

  if (filtros.carrera) {
    params.append("carrera", filtros.carrera);
  }

  const { data } = await api.get(
    `/usuario/listar-alumnos?${params.toString()}`
  );
  return data;
};

const fetchCarreras = async () => {
  const { data } = await api.get("/admin/carrera/listar-carreras");
  return data;
};

export default function GestionAlumnos() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  const [filtroActivo, setFiltroActivo] = useState(null); // null = todos, true = activos, false = inactivos
  const [filtroCarrera, setFiltroCarrera] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [alumnoExpandido, setAlumnoExpandido] = useState(null);
  const [showModalPlan, setShowModalPlan] = useState(false);
  const [showModalBaja, setShowModalBaja] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [planSeleccionado, setPlanSeleccionado] = useState("");
  const ALUMNOS_POR_PAGINA = 10;

  const {
    data: alumnos = [],
    isLoading: isLoadingAlumnos,
    isError: isErrorAlumnos,
    refetch: refetchAlumnos,
  } = useQuery({
    queryKey: ["alumnos", { activo: filtroActivo, carrera: filtroCarrera }],
    queryFn: () =>
      fetchAlumnos({ activo: filtroActivo, carrera: filtroCarrera }),
  });

  const { data: carreras = [], isLoading: isLoadingCarreras } = useQuery({
    queryKey: ["carreras"],
    queryFn: fetchCarreras,
  });

  // Formatear fecha para mostrar
  const formatearFechaLocal = (fecha) => {
    if (!fecha) return "—";
    try {
      return formatearFecha(fecha);
    } catch (error) {
      return "—";
    }
  };

  // Filtrar alumnos por texto de búsqueda
  const alumnosFiltrados = alumnos.filter((alumno) => {
    const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`.toLowerCase();
    const dniString = alumno.dni?.toString() || "";
    const busqueda = filtro.toLowerCase();

    return (
      nombreCompleto.includes(busqueda) ||
      dniString.includes(busqueda) ||
      alumno.email?.toLowerCase().includes(busqueda)
    );
  });

  // Calcular paginación
  const totalPaginas = Math.ceil(alumnosFiltrados.length / ALUMNOS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * ALUMNOS_POR_PAGINA;
  const indiceFin = indiceInicio + ALUMNOS_POR_PAGINA;
  const alumnosPaginados = alumnosFiltrados.slice(indiceInicio, indiceFin);

  // Resetear a página 1 cuando cambien los filtros
  React.useEffect(() => {
    setPaginaActual(1);
  }, [filtro, filtroActivo, filtroCarrera]);

  const irAPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const paginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 1));
  };

  const paginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  };

  const handleFiltroActivoChange = (valor) => {
    setFiltroActivo(valor);
  };

  const handleFiltroCarreraChange = (e) => {
    setFiltroCarrera(e.target.value);
  };

  const toggleAlumnoExpandido = (alumnoId) => {
    setAlumnoExpandido(alumnoExpandido === alumnoId ? null : alumnoId);
  };

  const handleAbrirModalPlan = (alumno) => {
    setAlumnoSeleccionado(alumno);
    const carrera = alumno.carreraSeleccionada || alumno.carreras?.[0];
    setPlanSeleccionado(carrera?.idPlanEstudioAsignado || "");
    setShowModalPlan(true);
  };

  const handleAbrirModalBaja = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setShowModalBaja(true);
  };

  const handleCerrarModales = () => {
    setShowModalPlan(false);
    setShowModalBaja(false);
    setAlumnoSeleccionado(null);
    setPlanSeleccionado("");
  };

  const { data: planesDisponibles = [] } = useQuery({
    queryKey: ["planes", alumnoSeleccionado?.carreraSeleccionada?.id || alumnoSeleccionado?.carreras?.[0]?.id],
    queryFn: async () => {
      const carreraId = alumnoSeleccionado?.carreraSeleccionada?.id || alumnoSeleccionado?.carreras?.[0]?.id;
      if (!carreraId) return [];
      const { data } = await api.get(`/usuario/carrera/${carreraId}/planes`);
      return data;
    },
    enabled: showModalPlan && !!(alumnoSeleccionado?.carreraSeleccionada?.id || alumnoSeleccionado?.carreras?.[0]?.id),
  });

  const handleModificarPlan = async () => {
    if (!planSeleccionado) {
      toast.error("Debes seleccionar un plan de estudios");
      return;
    }

    try {
      const carreraId = alumnoSeleccionado?.carreraSeleccionada?.id || alumnoSeleccionado?.carreras?.[0]?.id;
      await api.put(
        `/usuario/${alumnoSeleccionado.id}/carrera/${carreraId}/modificar-plan`,
        { idPlanEstudio: planSeleccionado }
      );
      toast.success("Plan de estudios actualizado correctamente");
      handleCerrarModales();
      refetchAlumnos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al modificar el plan de estudios");
    }
  };

  const handleDarDeBaja = async () => {
    try {
      const carreraId = alumnoSeleccionado?.carreraSeleccionada?.id || alumnoSeleccionado?.carreras?.[0]?.id;
      await api.put(
        `/usuario/${alumnoSeleccionado.id}/carrera/${carreraId}/dar-baja`
      );
      toast.success("Alumno dado de baja correctamente");
      handleCerrarModales();
      refetchAlumnos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al dar de baja al alumno");
    }
  };

  const handleReactivar = async (alumno) => {
    try {
      const carreraId = alumno?.carreraSeleccionada?.id || alumno?.carreras?.[0]?.id;
      await api.put(
        `/usuario/${alumno.id}/carrera/${carreraId}/reactivar`
      );
      toast.success("Alumno reactivado correctamente");
      refetchAlumnos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al reactivar al alumno");
    }
  };

  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Alumnos</h1>
        <p>Gestioná los alumnos del instituto</p>
      </div>

      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
          <SearchBar
            placeholder="Buscar por nombre, DNI o email..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className={styles.filtros}>
          <div className={styles.filtroEstado}>
            <select
              id="filtroActivo"
              value={filtroActivo === null ? "" : filtroActivo.toString()}
              onChange={(e) => {
                const valor =
                  e.target.value === "" ? null : e.target.value === "true";
                handleFiltroActivoChange(valor);
              }}
              className={styles.selectFiltro}
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          <div className={styles.filtroCarrera}>
            <select
              id="filtroCarrera"
              value={filtroCarrera}
              onChange={handleFiltroCarreraChange}
              className={styles.selectFiltro}
              disabled={isLoadingCarreras}
            >
              <option value="">Todas las carreras</option>
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.listaAlumnos}>
        <h2>Listado de alumnos</h2>

        {/* Tabla para desktop */}
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th></th>
              <th>DNI</th>
              <th>Nombre completo</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingAlumnos ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32 }}>
                  <CircularProgress color="inherit" />
                </td>
              </tr>
            ) : isErrorAlumnos ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: 32, color: "red" }}
                >
                  Error al cargar los alumnos
                </td>
              </tr>
            ) : alumnosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32 }}>
                  No se encontraron alumnos con los filtros seleccionados
                </td>
              </tr>
            ) : (
              alumnosPaginados.map((alumno) => (
                <React.Fragment key={alumno.id}>
                  <tr className={styles.tablaFila}>
                    <td>
                      <button
                        className={styles.botonExpandir}
                        onClick={() => toggleAlumnoExpandido(alumno.id)}
                        title={alumnoExpandido === alumno.id ? "Contraer" : "Expandir"}
                      >
                        {alumnoExpandido === alumno.id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </td>
                    <td>{alumno.dni}</td>
                    <td>{`${alumno.nombre} ${alumno.apellido}`}</td>
                    <td>
                      <div className={styles.contactoInfo}>
                        <div>{alumno.email || "—"}</div>
                        <div className={styles.telefono}>{alumno.telefono || "—"}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.acciones}>
                        <Boton
                          variant="onlyIcon"
                          icono={<Eye />}
                          onClick={() => navigate(`/admin/perfil/${alumno.id}`)}
                          title="Ver perfil"
                        />
                      </div>
                    </td>
                  </tr>
                  
                  {/* Fila expandible con detalles */}
                  {alumnoExpandido === alumno.id && (
                    <tr className={styles.filaExpandida}>
                      <td colSpan={5}>
                        <div className={styles.detallesAlumno}>
                          <div className={styles.infoGeneral}>
                            <div className={styles.estadoAlumno}>
                              <span className={styles.estadoLabel}>Estado del alumno:</span>
                              <span
                                className={`${styles.estadoBadge} ${
                                  alumno.carreras?.some(c => c.activo) ? styles.activo : styles.inactivo
                                }`}
                              >
                                {alumno.carreras?.some(c => c.activo) ? "Activo" : "Inactivo"}
                              </span>
                            </div>
                          </div>

                          <div className={styles.seccionDetalles}>
                            <h4>Carreras inscriptas</h4>
                            <div className={styles.listaCarreras}>
                              {alumno.carreras && alumno.carreras.length > 0 ? (
                                alumno.carreras.map((carrera, index) => (
                                  <div key={index} className={styles.carreraDetalle}>
                                    <div className={styles.carreraInfo}>
                                      <span className={styles.carreraNombre}>
                                        {carrera.nombre}
                                      </span>
                                      <span className={styles.carreraFecha}>
                                        Inscripción: {formatearFecha(carrera.fechaInscripcion)}
                                      </span>
                                      <span className={styles.carreraPlan}>
                                        Plan de estudios asignado: {carrera.resolucionPlanAsignado || "No asignado"}
                                      </span>
                                      <span
                                        className={`${styles.estadoBadge} ${
                                          carrera.activo ? styles.activo : styles.inactivo
                                        }`}
                                        style={{ marginTop: '8px', display: 'inline-block' }}
                                      >
                                        {carrera.activo ? "Activa" : "Inactiva"}
                                      </span>
                                    </div>
                                    <div className={styles.carreraAcciones}>
                                      {carrera.activo ? (
                                        <>
                                          <Boton
                                            variant="primary"
                                            icono={<Edit />}
                                            onClick={() => handleAbrirModalPlan({
                                              ...alumno,
                                              carreraSeleccionada: carrera
                                            })}
                                          >
                                            Modificar plan
                                          </Boton>
                                          <Boton
                                            variant="cancel"
                                            icono={<UserX />}
                                            onClick={() => handleAbrirModalBaja({
                                              ...alumno,
                                              carreraSeleccionada: carrera
                                            })}
                                          >
                                            Dar de baja
                                          </Boton>
                                        </>
                                      ) : (
                                        <Boton
                                          variant="success"
                                          onClick={() => handleReactivar({
                                            ...alumno,
                                            carreraSeleccionada: carrera
                                          })}
                                        >
                                          Reactivar
                                        </Boton>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No tiene carreras asignadas</p>
                              )}
                            </div>
                          </div>
                          
                          <div className={styles.accionesRapidas}>
                            <Boton
                              variant="primary"
                              icono={<Eye />}
                              onClick={() => navigate(`/admin/perfil/${alumno.id}`)}
                            >
                              Ver perfil completo
                            </Boton>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* Cards para móvil */}
        <div className={styles.cards}>
          {isLoadingAlumnos ? (
            <div className={styles.loadingCard}>
              <CircularProgress color="inherit" />
            </div>
          ) : isErrorAlumnos ? (
            <div className={styles.errorCard}>
              <p>Error al cargar los alumnos</p>
            </div>
          ) : alumnosFiltrados.length === 0 ? (
            <div className={styles.emptyCard}>
              <p>No se encontraron alumnos con los filtros seleccionados</p>
            </div>
          ) : (
            alumnosPaginados.map((alumno) => (
              <div key={alumno.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardNombre}>
                    <h3>{`${alumno.nombre} ${alumno.apellido}`}</h3>
                    <span className={styles.cardDni}>DNI: {alumno.dni}</span>
                  </div>
                  <span
                    className={`${styles.estado} ${
                      alumno.carreras?.some(c => c.activo) ? styles.activo : styles.inactivo
                    }`}
                  >
                    {alumno.carreras?.some(c => c.activo) ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>Email:</span>
                      <span className={styles.cardValue}>
                        {alumno.email || "—"}
                      </span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>Teléfono:</span>
                      <span className={styles.cardValue}>
                        {alumno.telefono || "—"}
                      </span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>Carreras:</span>
                      <span className={styles.cardValue}>
                        {alumno.carreras && alumno.carreras.length > 0
                          ? `${alumno.carreras.length} carrera${alumno.carreras.length > 1 ? 's' : ''}`
                          : 'Sin carreras'}
                      </span>
                    </div>
                    {alumno.carreras && alumno.carreras.length > 0 && (
                      <div className={styles.cardField}>
                        <span className={styles.cardLabel}>
                          Primera inscripción:
                        </span>
                        <span className={styles.cardValue}>
                          {formatearFecha(alumno.carreras[0].fechaInscripcion)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    <Boton
                      variant="primary"
                      icono={<Eye />}
                      onClick={() => navigate(`/admin/perfil/${alumno.id}`)}
                      size="sm"
                    >
                      Ver perfil
                    </Boton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Controles de paginación */}
        {!isLoadingAlumnos && !isErrorAlumnos && alumnosFiltrados.length > 0 && (
          <div className={styles.paginacion}>
            <div className={styles.paginacionInfo}>
              Mostrando {indiceInicio + 1} a{" "}
              {Math.min(indiceFin, alumnosFiltrados.length)} de{" "}
              {alumnosFiltrados.length} alumnos
            </div>

            <div className={styles.paginacionControles}>
              <button
                className={styles.botonPaginacion}
                onClick={paginaAnterior}
                disabled={paginaActual === 1}
              >
                ← Anterior
              </button>

              <div className={styles.numeroPaginas}>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (numero) => (
                    <button
                      key={numero}
                      className={`${styles.botonNumero} ${
                        paginaActual === numero ? styles.paginaActiva : ""
                      }`}
                      onClick={() => irAPagina(numero)}
                    >
                      {numero}
                    </button>
                  )
                )}
              </div>

              <button
                className={styles.botonPaginacion}
                onClick={paginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Modificar Plan */}
      {showModalPlan && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Modificar Plan de Estudios</h3>
            <p className={styles.modalSubtitle}>
              Alumno: {alumnoSeleccionado?.nombre} {alumnoSeleccionado?.apellido}
            </p>
            <p className={styles.modalSubtitle}>
              Carrera: {alumnoSeleccionado?.carreraSeleccionada?.nombre || alumnoSeleccionado?.carreras?.[0]?.nombre}
            </p>
            
            <div className={styles.modalField}>
              <label htmlFor="planSelect">Selecciona el nuevo plan de estudios:</label>
              <select
                id="planSelect"
                value={planSeleccionado}
                onChange={(e) => setPlanSeleccionado(e.target.value)}
                className={styles.selectModal}
              >
                <option value="">-- Seleccionar plan --</option>
                {planesDisponibles.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.resolucion} {plan.vigente ? "(Vigente)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.modalActions}>
              <Boton variant="success" onClick={handleModificarPlan}>
                Confirmar cambio
              </Boton>
              <Boton variant="cancel" onClick={handleCerrarModales}>
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Dar de Baja */}
      {showModalBaja && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Dar de Baja al Alumno</h3>
            <p className={styles.modalSubtitle}>
              ¿Estás seguro que deseas dar de baja a{" "}
              <strong>
                {alumnoSeleccionado?.nombre} {alumnoSeleccionado?.apellido}
              </strong>{" "}
              de la carrera <strong>{alumnoSeleccionado?.carreraSeleccionada?.nombre || alumnoSeleccionado?.carreras?.[0]?.nombre}</strong>?
            </p>
            
            <div className={styles.warningBox}>
              <p><strong>⚠️ Atención:</strong></p>
              <p>El alumno dado de baja no podrá:</p>
              <ul>
                <li>Inscribirse a materias de esta carrera</li>
                <li>Inscribirse a exámenes finales de esta carrera</li>
                <li>Solicitar equivalencias (si esta es su única carrera activa)</li>
              </ul>
            </div>

            <div className={styles.modalActions}>
              <Boton variant="cancel" onClick={handleDarDeBaja}>
                Confirmar baja
              </Boton>
              <Boton variant="primary" onClick={handleCerrarModales}>
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
