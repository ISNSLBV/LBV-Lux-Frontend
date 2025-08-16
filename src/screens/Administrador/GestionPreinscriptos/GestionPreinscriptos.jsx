import { useMemo, useState } from "react";
import api from "../../../api/axios";
import PreinscriptoCard from "../../../components/preinscripcion/PreinscriptoCard/PreinscriptoCard";
import styles from "./GestionPreinscriptos.module.css";
import Boton from "../../../components/Boton/Boton";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {toast} from 'react-toastify'

export default function GestionPreinscriptos() {
  const [form, setForm] = useState({});
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
    mutationFn: async ({ id, tipoAlumnoId, carreraId }) =>
      await api.post(`/admin/preinscripcion/${id}/aceptar`, {
        tipoAlumnoId,
        carreraId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["preinscriptos"]);
    },
    onError: () => toast.error('Error al realizar la inscripción')
  });

  const ocultarMutation = useMutation({
    mutationFn: async (id) =>
      await api.post(`/admin/preinscripcion/${id}/ocultar`),
    onSuccess: () => {
      queryClient.invalidateQueries(["preinscriptos"]);
    },
    onError: () => toast.error('Error al ocultar')
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

  const aceptar = (tipoAlumnoId) => {
    if (!personaSeleccionada) return;
    const carreraId = personaSeleccionada.preinscripciones?.[0]?.id_carrera;
    aceptarMutation.mutate({
      id: personaSeleccionada.id,
      tipoAlumnoId,
      carreraId,
    });
  };

  const ocultar = (p) => {
    ocultarMutation.mutate(p.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Panel de preinscriptos</h1>
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

      {personasFiltradas.map((p) => (
        <PreinscriptoCard
          key={p.id}
          persona={p}
          onAceptar={() => {
            setPersonaSeleccionada(p);
            setShowAceptarModal(true);
          }}
          onOcultar={() => ocultar(p)}
        />
      ))}

      {showAceptarModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p className={styles.modalHeader}>Inscribir a {personaSeleccionada.nombre} {personaSeleccionada.apellido} como alumno/a</p>
            <select
              value={form.tipoAlumnoId || ""}
              onChange={(e) =>
                setForm({ ...form, tipoAlumnoId: Number(e.target.value) })
              }
            >
              <option value="" disabled>
                Seleccioná una opción
              </option>
              <option value={1}>Regular</option>
              <option value={2}>Libre</option>
              <option value={3}>Oyente</option>
              <option value={4}>Itinerante</option>
            </select>
            <div className={styles.modalActions}>
              <Boton
                variant="success"
                onClick={() => {
                  aceptar(form.tipoAlumnoId);
                  setShowAceptarModal(false);
                  setPersonaSeleccionada(null);
                  toast.success('Inscripción realizada')
                }}
                disabled={!form.tipoAlumnoId}
                fullWidth
              >
                Confirmar
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
    </div>
  );
}
