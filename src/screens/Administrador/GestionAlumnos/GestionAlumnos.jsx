import React, { useState } from "react";
import Boton from "../../../components/Boton/Boton";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./GestionAlumnos.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
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
  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
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

  const handleFiltroActivoChange = (valor) => {
    setFiltroActivo(valor);
  };

  const handleFiltroCarreraChange = (e) => {
    setFiltroCarrera(e.target.value);
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
              <th>DNI</th>
              <th>Nombre completo</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Carrera</th>
              <th>Fecha inscripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingAlumnos ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 32 }}>
                  <CircularProgress color="inherit" />
                </td>
              </tr>
            ) : isErrorAlumnos ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: 32, color: "red" }}
                >
                  Error al cargar los alumnos
                </td>
              </tr>
            ) : alumnosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 32 }}>
                  No se encontraron alumnos con los filtros seleccionados
                </td>
              </tr>
            ) : (
              alumnosFiltrados.map((alumno) => (
                <tr key={alumno.id} className={styles.tablaFila}>
                  <td>{alumno.dni}</td>
                  <td>{`${alumno.nombre} ${alumno.apellido}`}</td>
                  <td>{alumno.email || "—"}</td>
                  <td>{alumno.telefono || "—"}</td>
                  <td>{alumno.carrera.nombre}</td>
                  <td>{formatearFecha(alumno.fechaInscripcion)}</td>
                  <td>
                    <span
                      className={`${styles.estado} ${
                        alumno.activo ? styles.activo : styles.inactivo
                      }`}
                    >
                      {alumno.activo ? "Activo" : "Inactivo"}
                    </span>
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
            alumnosFiltrados.map((alumno) => (
              <div key={alumno.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardNombre}>
                    <h3>{`${alumno.nombre} ${alumno.apellido}`}</h3>
                    <span className={styles.cardDni}>DNI: {alumno.dni}</span>
                  </div>
                  <span
                    className={`${styles.estado} ${
                      alumno.activo ? styles.activo : styles.inactivo
                    }`}
                  >
                    {alumno.activo ? "Activo" : "Inactivo"}
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
                      <span className={styles.cardLabel}>Carrera:</span>
                      <span className={styles.cardValue}>
                        {alumno.carrera.nombre}
                      </span>
                    </div>
                    <div className={styles.cardField}>
                      <span className={styles.cardLabel}>
                        Fecha inscripción:
                      </span>
                      <span className={styles.cardValue}>
                        {formatearFecha(alumno.fechaInscripcion)}
                      </span>
                    </div>
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
      </div>
    </>
  );
}
