import React, { useState } from "react";
import styles from "./Clases.module.css";
import Boton from "../../../../../../components/Boton/Boton";
import { Plus, Loader2, Info, SquarePen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import api from "../../../../../../api/axios";
import { toast } from "react-toastify";

const Clases = ({ materiaId }) => {
  const queryClient = useQueryClient();

  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [fechaNuevaClase, setFechaNuevaClase] = useState("");
  const [tema, setTema] = useState("");
  const [idProfesor, setIdProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);

  const {
    data: clases = [],
    isLoading: cargandoClases,
    isError: errorClases,
  } = useQuery({
    queryKey: ["clases", materiaId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/materia/materia-plan-ciclo/${materiaId}/listar-clases`);
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
      const { data } = await api.get(`/admin/clase/${claseSeleccionada.id}/detalle`);
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
      await api.post("/admin/materia/materia-plan-ciclo/registrar-informacion-clase", {
        idClase,
        tema,
        idProfesor,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["detalleClase", claseSeleccionada?.id] });
      toast.success("Información registrada");
      setModalInfo(false);
      setTema("");
      setIdProfesor("");
    },
    onError: () => toast.error("Error al registrar información"),
  });

  React.useEffect(() => {
    if (modalInfo && claseSeleccionada) {
      api
        .get(`/admin/materia/materia-plan-ciclo/${materiaId}/detalle`)
        .then((res) => setProfesores(res.data.profesores || []))
        .catch(() => setProfesores([]));
    }
  }, [modalInfo, materiaId, claseSeleccionada]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Clases</h2>
        <Boton icono={<Plus />} variant="success" onClick={() => setModalAgregar(true)}>
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
              <Info size={20} style={{ verticalAlign: "middle" }} /> No hay clases registradas.
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
                  <Boton
                    icono={<SquarePen />}
                    variant="onlyIcon"
                    title="Agregar información"
                    onClick={(e) => {
                      e.stopPropagation();
                      setClaseSeleccionada(detalle);
                      setModalInfo(true);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.detalleClase}>
          <h3>Detalle de Clase</h3>
          {!claseSeleccionada ? (
            <div style={{ color: "#888" }}>Selecciona una clase para ver el detalle.</div>
          ) : cargandoDetalle ? (
            <div style={{ textAlign: "center", margin: "2rem" }}>
              <CircularProgress />
            </div>
          ) : errorDetalle ? (
            <div style={{ color: "red" }}>Error al cargar detalle</div>
          ) : detalle ? (
            <div>
              <p>
                <b>Fecha:</b> {detalle.fecha.split("T")[0].split("-").reverse().join("/")}
              </p>
              <p>
                <b>Profesores:</b>{" "}
                {detalle.profesores.length === 0
                  ? "Sin profesores"
                  : detalle.profesores.map((p) => `${p.nombre} ${p.apellido} (${p.rol})`).join(", ")}
              </p>
              <p>
                <b>Temas:</b>{" "}
                {detalle.temas.length === 0
                  ? "Sin temas"
                  : detalle.temas.join(", ")}
              </p>
              <p>
                <b>Alumnos:</b>
              </p>
              <ul>
                {detalle.alumnos.length === 0
                  ? <li>Sin alumnos</li>
                  : detalle.alumnos.map((a, i) => (
                      <li key={i}>
                        {a.nombre} {a.apellido} - {a.asistencia}
                      </li>
                    ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal agregar clase */}
      <Dialog open={modalAgregar} onClose={() => setModalAgregar(false)}>
        <DialogTitle>Agregar nueva clase</DialogTitle>
        <DialogContent>
          <TextField
            label="Fecha"
            type="date"
            value={fechaNuevaClase}
            onChange={(e) => setFechaNuevaClase(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Boton onClick={() => setModalAgregar(false)}>Cancelar</Boton>
          <Boton
            variant="success"
            onClick={() => agregarClase.mutate(fechaNuevaClase)}
            disabled={!fechaNuevaClase || agregarClase.isLoading}
          >
            {agregarClase.isLoading ? <Loader2 className="spin" size={18} /> : "Agregar"}
          </Boton>
        </DialogActions>
      </Dialog>

      {/* Modal agregar info clase */}
      <Dialog open={modalInfo} onClose={() => setModalInfo(false)}>
        <DialogTitle>Agregar información a la clase</DialogTitle>
        <DialogContent>
          <TextField
            label="Tema"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Profesor"
            value={idProfesor}
            onChange={(e) => setIdProfesor(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">Sin profesor</MenuItem>
            {profesores.map((p, i) => (
              <MenuItem key={i} value={p.id_usuario_profesor || p.id_usuario || p.id}>
                {p.nombre} {p.apellido} ({p.rol})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Boton onClick={() => setModalInfo(false)}>Cancelar</Boton>
          <Boton
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
            {agregarInfoClase.isLoading ? <Loader2 className="spin" size={18} /> : "Guardar"}
          </Boton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Clases;