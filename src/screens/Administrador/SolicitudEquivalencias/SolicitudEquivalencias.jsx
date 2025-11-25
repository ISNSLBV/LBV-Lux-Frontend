import React, { useState, useEffect } from "react";
import styles from "./SolicitudEquivalencias.module.css";
import BotonVolver from "../../../components/BotonVolver/BotonVolver";
import SearchBar from "../../../components/SearchBar/SearchBar";
import api from "../../../api/axios";
import ModalAceptar from "./ModalAceptar";
import ModalRechazar from "./ModalRechazar";

const SolicitudEquivalencias = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [modalAceptarOpen, setModalAceptarOpen] = useState(false);
  const [modalRechazarOpen, setModalRechazarOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/equivalencia/admin/alumnos");
      setSolicitudes(response.data.data);
      setFilteredSolicitudes(response.data.data);
    } catch (err) {
      setError("Error al cargar las solicitudes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    let filtered = solicitudes;

    // Filtrar por término de búsqueda
    if (term) {
      filtered = filtered.filter((sol) => {
        const dni = sol.alumno?.persona?.dni?.toLowerCase() || "";
        const nombre = sol.alumno?.persona?.nombre?.toLowerCase() || "";
        const apellido = sol.alumno?.persona?.apellido?.toLowerCase() || "";
        const materia = sol.origen_materia?.toLowerCase() || "";
        const institucion = sol.origen_institucion?.toLowerCase() || "";

        return (
          dni.includes(term) ||
          nombre.includes(term) ||
          apellido.includes(term) ||
          materia.includes(term) ||
          institucion.includes(term)
        );
      });
    }

    // Filtrar por estado
    if (filtroEstado !== "Todos") {
      filtered = filtered.filter((sol) => sol.estado === filtroEstado);
    }

    setFilteredSolicitudes(filtered);
  };

  const handleFiltroEstado = (estado) => {
    setFiltroEstado(estado);
    let filtered = solicitudes;

    if (estado !== "Todos") {
      filtered = filtered.filter((sol) => sol.estado === estado);
    }

    setFilteredSolicitudes(filtered);
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case "Pendiente":
        return styles.estadoPendiente;
      case "Aprobada":
        return styles.estadoAprobada;
      case "Rechazada":
        return styles.estadoRechazada;
      default:
        return "";
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleAbrirModalAceptar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setModalAceptarOpen(true);
  };

  const handleAbrirModalRechazar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setModalRechazarOpen(true);
  };

  const handleAceptarSolicitud = async (datos) => {
    try {
      await api.put(
        `/equivalencia/admin/${solicitudSeleccionada.id}/aprobar`,
        datos
      );
      // Recargar las solicitudes
      await cargarSolicitudes();
      setModalAceptarOpen(false);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Error al aprobar la solicitud"
      );
    }
  };

  const handleRechazarSolicitud = async (motivoRechazo) => {
    try {
      await api.put(
        `/equivalencia/admin/${solicitudSeleccionada.id}/rechazar`,
        { motivoRechazo }
      );
      // Recargar las solicitudes
      await cargarSolicitudes();
      setModalRechazarOpen(false);
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Error al rechazar la solicitud"
      );
    }
  };

  if (loading) {
    return (
      <>
        <BotonVolver />
        <h1>Solicitudes de Equivalencias</h1>
        <div className={styles.loading}>Cargando solicitudes...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BotonVolver />
        <h1>Solicitudes de Equivalencias</h1>
        <div className={styles.error}>{error}</div>
      </>
    );
  }

  return (
    <>
      <BotonVolver />
      <h1>Solicitudes de Equivalencias</h1>
      <div className={styles.barraBusqueda}>
        <SearchBar
          placeholder="Buscar por DNI, nombre, materia o institución..."
          onChange={handleSearch}
        />
      </div>
      <div className={styles.filtros}>
        <button
          className={
            filtroEstado === "Todos" ? styles.filtroActivo : styles.filtro
          }
          onClick={() => handleFiltroEstado("Todos")}
        >
          Todos ({solicitudes.length})
        </button>
        <button
          className={
            filtroEstado === "Pendiente" ? styles.filtroActivo : styles.filtro
          }
          onClick={() => handleFiltroEstado("Pendiente")}
        >
          Pendientes (
          {solicitudes.filter((s) => s.estado === "Pendiente").length})
        </button>
        <button
          className={
            filtroEstado === "Aprobada" ? styles.filtroActivo : styles.filtro
          }
          onClick={() => handleFiltroEstado("Aprobada")}
        >
          Aprobadas ({solicitudes.filter((s) => s.estado === "Aprobada").length}
          )
        </button>
        <button
          className={
            filtroEstado === "Rechazada" ? styles.filtroActivo : styles.filtro
          }
          onClick={() => handleFiltroEstado("Rechazada")}
        >
          Rechazadas (
          {solicitudes.filter((s) => s.estado === "Rechazada").length})
        </button>
      </div>

      {filteredSolicitudes.length === 0 ? (
        <div className={styles.noResults}>No se encontraron solicitudes</div>
      ) : (
        <div className={styles.cardsContainer}>
          {filteredSolicitudes.map((solicitud) => (
            <div key={solicitud.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.alumnoInfo}>
                  <h3 className={styles.alumnoNombre}>
                    {solicitud.alumno?.persona?.apellido},{" "}
                    {solicitud.alumno?.persona?.nombre}
                  </h3>
                  <span className={styles.alumnoDni}>
                    DNI: {solicitud.alumno?.persona?.dni || "-"}
                  </span>
                </div>
                <span
                  className={`${styles.estadoBadge} ${getEstadoBadgeClass(
                    solicitud.estado
                  )}`}
                >
                  {solicitud.estado}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Institución de Origen
                    </span>
                    <span className={styles.infoValue}>
                      {solicitud.origen_institucion}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Materia de Origen</span>
                    <span className={styles.infoValue}>
                      {solicitud.origen_materia}
                    </span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      Calificación Obtenida
                    </span>
                    <span className={styles.infoValueHighlight}>
                      {solicitud.origen_calificacion}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Resolución Plan</span>
                    <span className={styles.infoValue}>
                      {solicitud.resolucion || "-"}
                    </span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Fecha de Solicitud</span>
                    <span className={styles.infoValue}>
                      {formatFecha(solicitud.fecha_solicitud)}
                    </span>
                  </div>
                  {solicitud.fecha_resolucion && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>
                        Fecha de Resolución
                      </span>
                      <span className={styles.infoValue}>
                        {formatFecha(solicitud.fecha_resolucion)}
                      </span>
                    </div>
                  )}
                </div>

                {solicitud.motivo_rechazo && (
                  <div className={styles.motivoRechazo}>
                    <span className={styles.infoLabel}>Motivo de Rechazo:</span>
                    <p className={styles.motivoTexto}>
                      {solicitud.motivo_rechazo}
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                {solicitud.estado === "Pendiente" ? (
                  <>
                    <button
                      className={styles.btnRechazar}
                      onClick={() => handleAbrirModalRechazar(solicitud)}
                    >
                      Rechazar
                    </button>
                    <button
                      className={styles.btnAceptar}
                      onClick={() => handleAbrirModalAceptar(solicitud)}
                    >
                      Aceptar
                    </button>
                  </>
                ) : (
                  <span className={styles.estadoResuelto}>
                    {solicitud.estado === "Aprobada"
                      ? "Solicitud Aprobada"
                      : "Solicitud Rechazada"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalAceptar
        isOpen={modalAceptarOpen}
        onClose={() => setModalAceptarOpen(false)}
        onConfirm={handleAceptarSolicitud}
        solicitud={solicitudSeleccionada}
      />

      <ModalRechazar
        isOpen={modalRechazarOpen}
        onClose={() => setModalRechazarOpen(false)}
        onConfirm={handleRechazarSolicitud}
        solicitud={solicitudSeleccionada}
      />
    </>
  );
};

export default SolicitudEquivalencias;
