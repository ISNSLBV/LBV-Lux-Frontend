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
import { FilePen } from "lucide-react";

export default function GestionPreinscriptos() {
  const [preinscripcionSeleccionada, setPreinscripcionSeleccionada] = useState(null);
  const [showAceptarModal, setShowAceptarModal] = useState(false);
  const [fichaCompletada, setFichaCompletada] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pendiente");
  const [visibilityFilter, setVisibilityFilter] = useState("1");

  const queryClient = useQueryClient();

  // Transformar personas con múltiples preinscripciones en items individuales
  const transformarPreinscripciones = (personas) => {
    const preinscripciones = [];
    personas.forEach(persona => {
      persona.preinscripciones?.forEach(preinscripcion => {
        preinscripciones.push({
          ...persona,
          preinscripcion: preinscripcion,
          // ID único combinando persona y preinscripción
          uniqueId: `${persona.id}-${preinscripcion.id}`,
          preinscripcionId: preinscripcion.id
        });
      });
    });
    return preinscripciones;
  };

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
    
    // Transformar a items individuales por preinscripción
    const items = transformarPreinscripciones(allPersonas);
    
    return items.filter((item) => {
      const fullName = `${item.nombre} ${item.apellido}`.toLowerCase();
      const dni = item.dni?.toLowerCase() ?? "";
      const estado = item.preinscripcion?.estado;
      const visible = item.preinscripcion?.visible;
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
    if (!preinscripcionSeleccionada) return;
    const carreraId = preinscripcionSeleccionada.preinscripcion?.id_carrera;
    const carreraNombre = preinscripcionSeleccionada.preinscripcion?.carrera?.nombre || 'la carrera seleccionada';
    
    aceptarMutation.mutate({
      id: preinscripcionSeleccionada.id,
      carreraId,
    });
    
    setShowAceptarModal(false);
    setPreinscripcionSeleccionada(null);
    setFichaCompletada(false);
  };

  const ocultar = (item) => {
    ocultarMutation.mutate(item.id);
  };

  const descargarFicha = async () => {
    if (!preinscripcionSeleccionada) return;
    
    const url = `${import.meta.env.VITE_API_URL}/admin/preinscripcion/${preinscripcionSeleccionada.id}/ficha`;
    window.open(url, '_blank');
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
          personasFiltradas.map((item) => (
            <PreinscriptoCard
              key={item.uniqueId}
              persona={item}
              onAceptar={() => {
                setPreinscripcionSeleccionada(item);
                setShowAceptarModal(true);
              }}
              onOcultar={() => ocultar(item)}
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
                {preinscripcionSeleccionada.nombre} {preinscripcionSeleccionada.apellido}
              </strong>{" "}
              a la carrera {" "}
              <strong>
                {preinscripcionSeleccionada.preinscripcion?.carrera?.nombre || "No especificada"}
              </strong>
              ?
            </p>
            <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.7)", marginTop: "8px" }}>
              El alumno será inscripto en el plan de estudios vigente de la carrera.
            </p>
            
            <div className={styles.fichaSection}>
              <Boton
                icono={<FilePen />}
                variant="primary"
                onClick={descargarFicha}
                fullWidth
              >
                 Imprimir ficha de inscripción
              </Boton>
              
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={fichaCompletada}
                  onChange={(e) => setFichaCompletada(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>El alumno completó y entregó la ficha de inscripción</span>
              </label>
            </div>
            
            <div className={styles.modalActions}>
              <Boton
                variant="success"
                onClick={aceptar}
                fullWidth
                disabled={!fichaCompletada}
              >
                Confirmar inscripción
              </Boton>
              <Boton
                variant="cancel"
                onClick={() => {
                  setShowAceptarModal(false);
                  setPersonaSeleccionada(null);
                  setFichaCompletada(false);
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
