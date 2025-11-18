import React, { useState, useEffect } from "react";
import styles from "./Clases.module.css";
import Boton from "../../../../../../components/Boton/Boton";
import { Plus, Loader2, Info, SquarePen, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import api from "../../../../../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../../../../contexts/AuthContext";

const Clases = ({ materiaId }) => {
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [fechaNuevaClase, setFechaNuevaClase] = useState("");
  const [tema, setTema] = useState("");
  const [idProfesor, setIdProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [modalRegistrarAsistencia, setModalRegistrarAsistencia] =
    useState(false);

  const {
    data: clases = [],
    isLoading: cargandoClases,
    isError: errorClases,
  } = useQuery({
    queryKey: ["clases", materiaId],
    queryFn: async () => {
      const { data } = await api.get(
        `/admin/materia/materia-plan-ciclo/${materiaId}/listar-clases`
      );
      return data;
    },
    enabled: !!materiaId,
  });

  const {
    data: detalle,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
  } = useQuery({
    queryKey: ["detalleClase", claseSeleccionada?.id],
    queryFn: async () => {
      if (!claseSeleccionada) return null;
      const { data } = await api.get(
        `/admin/clase/${claseSeleccionada.id}/detalle`
      );
      return data;
    },
    enabled: !!claseSeleccionada,
  });

  const agregarClase = useMutation({
    mutationFn: async (fecha) => {
      await api.post("/admin/materia/materia-plan-ciclo/crear-clase", {
        idMateriaPlanCicloLectivo: materiaId,
        fecha,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clases", materiaId] });
      toast.success("Clase agregada");
      setModalAgregar(false);
      setFechaNuevaClase("");
    },
    onError: () => toast.error("Error al agregar la clase"),
  });

  const agregarInfoClase = useMutation({
    mutationFn: async ({ idClase, tema, idProfesor }) => {
      await api.post(
        "/admin/materia/materia-plan-ciclo/registrar-informacion-clase",
        {
          idClase,
          tema,
          idProfesor,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detalleClase", claseSeleccionada?.id],
      });
      toast.success("Información registrada");
      setModalInfo(false);
      setTema("");
      setIdProfesor("");
    },
    onError: () => toast.error("Error al registrar información"),
  });

  const registrarAsistencia = useMutation({
    mutationFn: async ({ claseId, alumnoId, estado }) =>
      api.post("/admin/asistencia/registrar-asistencia", {
        claseId,
        alumnoId,
        estado,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detalleClase", claseSeleccionada?.id],
      });
      setModalRegistrarAsistencia(false);
      setAsistencia({});
      setSelectAll(false);
    },
    onError: () => toast.error("Error al registrar asistencia"),
  });

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    if (detalle?.alumnos) {
      const updated = {};
      detalle.alumnos.forEach((a) => {
        updated[a.id_usuario] = newValue;
      });
      setAsistencia(updated);
    }
  };

  const handleRegistrarAsistencia = () => {
    if (!claseSeleccionada) return;
    const alumnos = detalle.alumnos || [];
    Promise.all(
      alumnos.map((a) =>
        registrarAsistencia.mutateAsync({
          claseId: claseSeleccionada.id,
          alumnoId: a.id_usuario,
          estado: asistencia[a.id_usuario] ? "Presente" : "Ausente",
        })
      )
    ).then(() => {
      setModalRegistrarAsistencia(false);
      setAsistencia({});
      setSelectAll(false);
      toast.success("Asistencia registrada");
    });
  };

  useEffect(() => {
    if (modalRegistrarAsistencia && detalle?.alumnos) {
      const initial = {};
      detalle.alumnos.forEach((alumno) => {
        // Marcar como presente solo si el estado es explícitamente "Presente"
        initial[alumno.id_usuario] = alumno.asistencia === "Presente";
      });
      setAsistencia(initial);
      setSelectAll(false);
    }
  }, [modalRegistrarAsistencia, detalle]);

  useEffect(() => {
    if (modalInfo && claseSeleccionada) {
      api
        .get(`/admin/materia/materia-plan-ciclo/${materiaId}/detalle`)
        .then((res) => setProfesores(res.data.profesores || []))
        .catch(() => setProfesores([]));
    }
  }, [modalInfo, materiaId, claseSeleccionada]);

  const asistenciaYaRegistrada = detalle?.alumnos?.some(
    (a) => a.asistencia !== undefined && a.asistencia !== null
  );

  const puedeRegistrar =
    user.rol === "Administrador" ||
    (user.rol === "Profesor" && !asistenciaYaRegistrada);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Clases</h2>
        <Boton
          icono={<Plus />}
          variant="success"
          onClick={() => setModalAgregar(true)}
        >
          Agregar clase
        </Boton>
      </div>
      <div className={styles.containerClases}>
        <div className={styles.listaClases}>
          <h3>Lista de Clases</h3>
          {cargandoClases ? (
            <div style={{ textAlign: "center", margin: "2rem" }}>
              <CircularProgress />
            </div>
          ) : errorClases ? (
            <div style={{ color: "red" }}>Error al cargar clases</div>
          ) : clases.length === 0 ? (
            <div style={{ color: "#888", margin: "2rem" }}>
              <Info size={20} style={{ verticalAlign: "middle" }} /> No hay
              clases registradas.
            </div>
          ) : (
            <ul className={styles.lista}>
              {clases.map((detalle) => (
                <li
                  key={detalle.id}
                  className={styles.claseCard}
                  onClick={() => setClaseSeleccionada(detalle)}
                >
                  <span className={styles.fecha}>
                    {detalle.fecha.split("T")[0].split("-").reverse().join("/")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.detalleClase}>
          {!claseSeleccionada ? (
            <div style={{ color: "#888" }}>
              Selecciona una clase para ver el detalle.
            </div>
          ) : cargandoDetalle ? (
            <div style={{ textAlign: "center", margin: "2rem" }}>
              <CircularProgress />
            </div>
          ) : errorDetalle ? (
            <div style={{ color: "red" }}>Error al cargar detalle</div>
          ) : detalle ? (
            <div className={styles.detalleContainer}>
              <h3>
                Detalle de la clase del{" "}
                {claseSeleccionada?.fecha
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
              </h3>
              <div className={styles.infoProfesor}>
                <p>
                  <b>Profesor/a:</b>{" "}
                  {detalle.profesores.length === 0
                    ? "Sin profesor/a"
                    : detalle.profesores
                        .map((p) => `${p.nombre} ${p.apellido}`)
                        .join(", ")}
                </p>
              </div>
              <div className={styles.infoTemas}>
                <div className={styles.infoTemasHeader}>
                  <p>
                    <b>Tema/s</b>
                  </p>
                  <Boton
                    variant="success"
                    onClick={() => setModalInfo(true)}
                  >
                    Agregar tema
                  </Boton>
                </div>
                <p>
                  {detalle.temas.length === 0
                    ? "Sin temas registrados"
                    : detalle.temas.join(", ")}
                </p>
              </div>
              <div className={styles.infoAlumnos}>
                <div className={styles.infoAlumnosHeader}>
                  <p>
                    <b>Asistencia</b>
                  </p>
                  <Boton
                    onClick={() => setModalRegistrarAsistencia(true)}
                    variant="success"
                  >
                    Registrar asistencia
                  </Boton>
                </div>
                <ul className={styles.listaAlumnos}>
                  {detalle.alumnos.length === 0 ? (
                    <li>No hay alumnos inscriptos en esta materia</li>
                  ) : (
                    detalle.alumnos.map((a, i) => (
                      <li key={i}>
                        {a.nombre} {a.apellido} - {a.asistencia || "Sin registrar"}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal agregar clase */}
      {modalAgregar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Agregar nueva clase</h3>
              <button
                className={styles.closeButton}
                onClick={() => setModalAgregar(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.label}>
                Fecha
                <input
                  type="date"
                  className={styles.input}
                  value={fechaNuevaClase}
                  onChange={(e) => setFechaNuevaClase(e.target.value)}
                />
              </label>
            </div>
            <div className={styles.modalActions}>
              <Boton
                fullWidth
                variant="success"
                onClick={() => agregarClase.mutate(fechaNuevaClase)}
                disabled={!fechaNuevaClase || agregarClase.isLoading}
              >
                {agregarClase.isLoading ? (
                  <Loader2 className="spin" size={18} />
                ) : (
                  "Agregar"
                )}
              </Boton>
              <Boton fullWidth onClick={() => setModalAgregar(false)}>
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}

      {/* Modal agregar info clase */}
      {modalInfo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Agregar información a la clase</h3>
              <button
                className={styles.closeButton}
                onClick={() => setModalInfo(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.label}>
                Tema
                <input
                  type="text"
                  className={styles.input}
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                />
              </label>
              <label className={styles.label}>
                Profesor
                <select
                  className={styles.select}
                  value={idProfesor}
                  onChange={(e) => setIdProfesor(e.target.value)}
                >
                  <option value="">Sin profesor</option>
                  {profesores.map((p, i) => (
                    <option
                      key={i}
                      value={p.id_usuario}
                    >
                      {p.nombre} {p.apellido} ({p.rol})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.modalActions}>
              <Boton
                fullWidth
                variant="success"
                onClick={() =>
                  agregarInfoClase.mutate({
                    idClase: claseSeleccionada.id,
                    tema,
                    idProfesor: idProfesor || undefined,
                  })
                }
                disabled={!tema || agregarInfoClase.isLoading}
              >
                {agregarInfoClase.isLoading ? (
                  <Loader2 className="spin" size={18} />
                ) : (
                  "Guardar"
                )}
              </Boton>
              <Boton fullWidth onClick={() => setModalInfo(false)}>
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}

      {/* Modal registrar asistencia */}
      {modalRegistrarAsistencia && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>
                Registrar asistencia del día{" "}
                {claseSeleccionada?.fecha
                  ? claseSeleccionada.fecha
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")
                  : ""}
              </h3>
              <button
                className={styles.closeButton}
                onClick={() => setModalRegistrarAsistencia(false)}
              >
                <X size={20} />
              </button>
            </div>
            {asistenciaYaRegistrada && user.rol === "Profesor" && (
              <div className={styles.warningMessage}>
                Ya registraste la asistencia para esta clase. En caso de error
                contactá a un administrador.
              </div>
            )}
            <div className={styles.modalBody}>
              {cargandoDetalle ? (
                <div style={{ textAlign: "center", margin: "2rem" }}>
                  <CircularProgress />
                </div>
              ) : (detalle?.alumnos || []).length === 0 ? (
                <div style={{ color: "#888", textAlign: "center", padding: "2rem" }}>
                  No hay alumnos inscriptos en esta materia
                </div>
              ) : (
                <>
                  <div className={styles.selectAllRow}>
                    <label>Marcar todos como presentes</label>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      disabled={!puedeRegistrar}
                    />
                  </div>
                  <ul className={styles.listaAlumnosAsistencia}>
                    {(detalle?.alumnos || []).map((a) => (
                      <li key={a.id_usuario} className={styles.asistenciaItem}>
                        <label>
                          {a.nombre} {a.apellido}
                        </label>
                        <input
                          type="checkbox"
                          checked={asistencia[a.id_usuario] === true}
                          onChange={() =>
                            setAsistencia((prev) => ({
                              ...prev,
                              [a.id_usuario]: !prev[a.id_usuario],
                            }))
                          }
                          disabled={!puedeRegistrar}
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className={styles.modalActions}>
              <Boton
                fullWidth
                variant="success"
                onClick={handleRegistrarAsistencia}
                disabled={!puedeRegistrar || registrarAsistencia.isLoading}
              >
                {registrarAsistencia.isLoading ? (
                  <Loader2 className="spin" size={18} />
                ) : user.rol === "Administrador" ? (
                  "Actualizar asistencia"
                ) : (
                  "Registrar asistencia"
                )}
              </Boton>
              <Boton
                fullWidth
                onClick={() => setModalRegistrarAsistencia(false)}
              >
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clases;
