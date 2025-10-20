import { useMemo, useState } from "react";
import api from "../../../api/axios";
import PreinscriptoCard from "../../../components/preinscripcion/PreinscriptoCard/PreinscriptoCard";
import styles from "./GestionPreinscriptos.module.css";
import Boton from "../../../components/Boton/Boton";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";

export default function GestionPreinscriptos() {
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [showAceptarModal, setShowAceptarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pendiente");
  const [visibilityFilter, setVisibilityFilter] = useState("1");

  const queryClient = useQueryClient();

  const {
    data: allPersonas = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["preinscriptos"],
    queryFn: async () => (await api.get("/admin/preinscripcion")).data,
  });

  const aceptarMutation = useMutation({
    mutationFn: async ({ id, carreraId }) =>
      await api.post(`/admin/preinscripcion/${id}/aceptar`, {
        carreraId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["preinscriptos"]);
      toast.success("Inscripción realizada exitosamente");
    },
    onError: (error) => {
      const mensaje = error?.response?.data?.error || "Error al realizar la inscripción";
      toast.error(mensaje);
    },
  });

  const ocultarMutation = useMutation({
    mutationFn: async (id) =>
      await api.post(`/admin/preinscripcion/${id}/ocultar`),
    onSuccess: () => {
      queryClient.invalidateQueries(["preinscriptos"]);
    },
    onError: () => toast.error("Error al ocultar"),
  });

  const personasFiltradas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allPersonas.filter((p) => {
      const fullName = `${p.nombre} ${p.apellido}`.toLowerCase();
      const dni = p.dni?.toLowerCase() ?? "";
      const estado = p.preinscripciones[0]?.estado;
      const visible = p.preinscripciones[0]?.visible;
      const matchesSearch =
        !term || fullName.includes(term) || dni.includes(term);
      const matchesStatus = !statusFilter || estado === statusFilter;
      const matchesVisibility =
        !visibilityFilter ||
        (visibilityFilter === "1" ? visible === 1 : visible === 0);
      return matchesSearch && matchesStatus && matchesVisibility;
    });
  }, [searchTerm, statusFilter, visibilityFilter, allPersonas]);

  const aceptar = () => {
    if (!personaSeleccionada) return;
    const carreraId = personaSeleccionada.preinscripciones?.[0]?.id_carrera;
    const carreraNombre = personaSeleccionada.preinscripciones?.[0]?.carrera?.nombre || 'la carrera seleccionada';
    
    aceptarMutation.mutate({
      id: personaSeleccionada.id,
      carreraId,
    });
    
    setShowAceptarModal(false);
    setPersonaSeleccionada(null);
  };

  const ocultar = (p) => {
    ocultarMutation.mutate(p.id);
  };

  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Preinscripciones</h1>
      </div>
      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscá por nombre o DNI"
          />
        </div>
        <div className={styles.filtros}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Aprobada">Aprobadas</option>
          </select>

          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="1">Visibles</option>
            <option value="0">Ocultas</option>
          </select>
        </div>
      </div>
      <div className={styles.containerLista}>
        {isLoading ? (
          <CircularProgress />
        ) : personasFiltradas.length === 0 ? (
          <p className={styles.listaSinResultados}>
            No se encontraron resultados para los filtros utilizados
          </p>
        ) : (
          personasFiltradas.map((p) => (
            <PreinscriptoCard
              key={p.id}
              persona={p}
              onAceptar={() => {
                setPersonaSeleccionada(p);
                setShowAceptarModal(true);
              }}
              onOcultar={() => ocultar(p)}
            />
          ))
        )}
      </div>
      {showAceptarModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p className={styles.modalHeader}>Confirmar inscripción</p>
            <p>
              ¿Estás seguro que deseas inscribir a{" "}
              <strong>
                {personaSeleccionada.nombre} {personaSeleccionada.apellido}
              </strong>{" "}
              en la carrera de{" "}
              <strong>
                {personaSeleccionada.preinscripciones?.[0]?.carrera?.nombre || "No especificada"}
              </strong>
              ?
            </p>
            <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)", marginTop: "8px" }}>
              El alumno será inscripto como <strong>Regular</strong> en el plan de estudios vigente de la carrera.
            </p>
            <div className={styles.modalActions}>
              <Boton
                variant="success"
                onClick={aceptar}
                fullWidth
              >
                Confirmar inscripción
              </Boton>
              <Boton
                variant="cancel"
                onClick={() => {
                  setShowAceptarModal(false);
                  setPersonaSeleccionada(null);
                }}
                fullWidth
              >
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
