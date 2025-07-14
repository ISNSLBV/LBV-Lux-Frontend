import { useEffect, useState } from "react";
import api from "../../../api/axios";
import PreinscriptoCard from "../../../components/preinscripcion/PreinscriptoCard/PreinscriptoCard";
import styles from "./GestionPreinscriptos.module.css";
import Boton from "../../../components/Boton/Boton";
import DatoCard from "../../../components/Dato/DatoCard";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { Users, Calendar, TrendingUp, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function GestionPreinscriptos() {
  const queryClient = useQueryClient();
  const { data: allPersonas = [] } = useQuery({
    queryKey: ["preinscriptos"],
    queryFn: async () => {
      const { data } = await api.get("/admin/preinscripcion");
      return data;
    },
  });
  const [personasFiltradas, setPersonasFiltradas] = useState([]);
  const [form, setForm] = useState({});
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [showAceptarModal, setShowAceptarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pendiente");
  const [visibilityFilter, setVisibilityFilter] = useState("1");

  useEffect(() => {
    setPersonasFiltradas(allPersonas);
  }, [allPersonas]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtradas = allPersonas.filter((p) => {
      const fullName = `${p.nombre} ${p.apellido}`.toLowerCase();
      const dni = p.dni?.toLowerCase() ?? "";

      const matchesSearch =
        !term || fullName.includes(term) || dni.includes(term);

      const estado = p.preinscripcions[0]?.estado;
      const visible = p.preinscripcions[0]?.visible;

      const matchesStatus = !statusFilter || estado === statusFilter;

      const matchesVisibility =
        !visibilityFilter ||
        (visibilityFilter === "1" ? visible === 1 : visible === 0);

      return matchesSearch && matchesStatus && matchesVisibility;
    });

    setPersonasFiltradas(filtradas);
  }, [searchTerm, statusFilter, visibilityFilter, allPersonas]);

  const añoActual = new Date().getFullYear();

  const datos = [
    {
      titulo: "Total histórico",
      icono: <Users />,
      dato: allPersonas.length,
    },
    {
      titulo: "Este año",
      icono: <Calendar />,
      dato: allPersonas.filter(
        (p) =>
          new Date(p.preinscripcions[0]?.fecha_creacion).getFullYear() ===
          añoActual
      ).length,
    },
    {
      titulo: "Pendientes",
      icono: <TrendingUp />,
      dato: allPersonas.filter(
        (p) => p.preinscripcions[0]?.estado === "Pendiente"
      ).length,
    },
    {
      titulo: "Aprobadas",
      icono: <Check />,
      dato: allPersonas.filter(
        (p) => p.preinscripcions[0]?.estado === "Aprobada"
      ).length,
    },
    {
      titulo: "Rechazadas",
      icono: <X />,
      dato: allPersonas.filter(
        (p) => p.preinscripcions[0]?.estado === "Rechazada"
      ).length,
    },
  ];

  const aceptarPreinscripcion = useMutation({
    mutationFn: ({ id, tipoAlumnoId, carreraId }) =>
      api.post(`/admin/preinscripcion/${id}/aceptar`, {
        tipoAlumnoId,
        carreraId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["preinscriptos"]);
      setShowAceptarModal(false);
      setPersonaSeleccionada(null);
    },
  });

  const handleAceptarPreinscripcion = (tipoAlumnoId) => {
    if (!personaSeleccionada) return;
    const carreraId = personaSeleccionada.preinscripcions?.[0]?.id_carrera;
    aceptarPreinscripcion.mutate({
      id: personaSeleccionada.id,
      tipoAlumnoId,
      carreraId,
    });
  };

  const ocultarPreinscripcion = useMutation({
    mutationFn: (id) => api.post(`/admin/preinscripcion/${id}/ocultar`),
    onSuccess: () => {
      queryClient.invalidateQueries(["preinscriptos"]);
    },
  });

  const handleOcultarPreinscripcion = (p) => {
    ocultarPreinscripcion.mutate(p.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Panel de preinscriptos</h1>
      </div>
      <div className={styles.datos}>
        {datos.map((d, index) => (
          <DatoCard
            key={index}
            titulo={d.titulo}
            icono={d.icono}
            dato={d.dato}
          />
        ))}
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
            <option value="Rechazada">Rechazadas</option>
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
          onOcultar={() => handleOcultarPreinscripcion(p)}
        />
      ))}

      {showAceptarModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirmá el tipo de alumno</h2>
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
                onClick={() => handleAceptarPreinscripcion(form.tipoAlumnoId)}
                disabled={!form.tipoAlumnoId}
              >
                Confirmar
              </Boton>
              <Boton
                variant="cancel"
                onClick={() => {
                  setShowAceptarModal(false);
                  setPersonaSeleccionada(null);
                }}
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
