import React from "react";
import DatoCard from "../../../../components/Dato/DatoCard";
import styles from "./GestionMateriasGenericas.module.css";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import {
  Plus,
  BookOpen,
  Check,
  X,
  TriangleAlert,
  SquarePen,
} from "lucide-react";
import Boton from "../../../../components/Boton/Boton";
import { useState } from "react";
import api from "../../../../api/axios";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CircularProgress from "@mui/material/CircularProgress";

const fetchMaterias = async () => {
  const { data } = await api.get("/admin/materia/listar-materias");
  return data;
};

const GestionMateriasGenericas = () => {
  const [nuevaMateria, setNuevaMateria] = useState("");
  const [filtro, setFiltro] = useState("");
  const [edicion, setEdicion] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [materiaEditada, setMateriaEditada] = useState({ id: "", nombre: "" });

  const queryClient = useQueryClient();

  const {
    data: materias = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["materiasGenericas"],
    queryFn: fetchMaterias,
  });

  const total = materias.length;
  const activas = materias.filter((m) => m.activa).length;
  const inactivas = total - activas;
  const datos = [
    {
      titulo: "Cantidad de materias",
      icono: <BookOpen />,
      dato: total.toString(),
    },
    {
      titulo: "Materias activas",
      icono: <Check />,
      dato: activas.toString(),
    },
    {
      titulo: "Materias inactivas",
      icono: <TriangleAlert />,
      dato: inactivas.toString(),
    },
  ];

  const registrarMateria = useMutation({
    mutationFn: (nombre) =>
      api.post("/api/admin/materia/registrar-materia", { nombre }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiasGenericas"] });
      toast.success("Materia registrada");
    },
    onError: () => toast.error("Error al registrar la materia"),
  });

  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (!nuevaMateria.trim()) return;
    registrarMateria.mutate(nuevaMateria.trim());
    setNuevaMateria("");
    setRegistro(false);
  };

  const editarMateria = useMutation({
    mutationFn: ({ id, nombre }) =>
      api.put(`/api/admin/materia/${id}`, { nombre }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiasGenericas"] });
      toast.success("Materia editada correctamente");
      setEdicion(false);
    },
    onError: () => toast.error("Error al editar la materia"),
  });

  const handleEditar = async (e) => {
    e.preventDefault();
    if (!materiaEditada.nombre.trim()) return;
    editarMateria.mutate({
      id: materiaEditada.id,
      nombre: materiaEditada.nombre.trim(),
    });
    setMateriaEditada({ id: "", nombre: "" });
    setEdicion(false);
  };

  const materiasFiltradas = materias.filter((m) =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Materias</h1>
        <p>Registrá y editá los nombres de las materias dictadas en el instituto</p>
      </div>
      <div className={styles.datos}>
        {datos.map((dato, index) => (
          <DatoCard
            key={index}
            titulo={dato.titulo}
            icono={dato.icono}
            dato={dato.dato}
            descripcion={dato.descripcion}
            loading={isLoading}
          />
        ))}
      </div>
      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
          <SearchBar
            placeholder="Buscar materia"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className={styles.botonAgregar}>
          <Boton
            variant="success"
            icono={<Plus />}
            onClick={() => setRegistro(true)}
          >
            Agregar Materia
          </Boton>
        </div>
      </div>
      <div className={styles.listaMaterias}>
        <h2>Catálogo de materias</h2>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Plan(es) de estudio</th>
              <th>Carrera(s)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                  <CircularProgress color="inherit" />
                </td>
              </tr>
            ) : materiasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                  No se encontraron materias.
                </td>
              </tr>
            ) : (
              materiasFiltradas.map((m) => (
                <tr key={m.id} className={styles.tablaFila}>
                  <td>{m.id}</td>
                  <td>{m.nombre}</td>
                  <td>{m.activa ? "Activa" : "Inactiva"}</td>
                  <td>{m.plan_estudio.map((p) => p.nombre).join(", ")}</td>
                  <td>{m.carrera.map((c) => c.nombre).join(", ")}</td>
                  <td>
                    <Boton
                      variant="onlyIcon"
                      icono={<SquarePen />}
                      onClick={() => {
                        setMateriaEditada({ id: m.id, nombre: m.nombre });
                        setEdicion(true);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={styles.cards}>
          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress color="inherit" />
            </div>
          ) : materiasFiltradas.length === 0 ? (
            <div>
              <p>No se encontraron materias.</p>
            </div>
          ) : (
            materiasFiltradas.map((m) => (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderContent}>
                    <div className={styles.cardHeaderTitle}>
                      <h3>{m.nombre}</h3>
                      <p>ID: {m.id}</p>
                    </div>
                    <div className={styles.cardHeaderStatus}>
                      {m.activa ? (
                        <>
                          <Check /> En uso
                        </>
                      ) : (
                        <>
                          <TriangleAlert /> Sin asignar
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div>
                    <div>
                      <h4>Plan(es) de estudio</h4>
                      <p>{m.plan_estudio.map((p) => p.nombre).join(", ")}</p>
                    </div>
                  </div>
                  <div>
                    <h4>Carreras</h4>
                    <div>
                      {m.carrera.map((c) => (
                        <div>{c.nombre}</div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <Boton
                      fullWidth
                      icono={<SquarePen />}
                      variant="primary"
                      onClick={() => {
                        setMateriaEditada({ id: m.id, nombre: m.nombre });
                        setEdicion(true);
                      }}
                    >
                      Editar
                    </Boton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de registro */}
      {registro && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar nueva materia</h3>
              <button
                className={styles.closeButton}
                onClick={() => setRegistro(false)}
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleRegistrar}>
              <div className="mb-4">
                <label htmlFor="nombre" className="block mb-1">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nuevaMateria}
                  onChange={(e) => setNuevaMateria(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <Boton type="submit" variant="success">
                  Crear
                </Boton>
                <Boton type="button" onClick={() => setRegistro(false)}>
                  Cancelar
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {edicion && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Editar materia</h3>
              <button
                className={styles.closeButton}
                onClick={() => setEdicion(false)}
              >
                <X />
              </button>
            </div>
            <form className={styles.modalForm} onSubmit={handleEditar}>
              <div>
                <label htmlFor="id" className="block mb-1">
                  ID
                </label>
                <input
                  id="id"
                  type="text"
                  value={materiaEditada.id}
                  onChange={(e) =>
                    setMateriaEditada({ ...materiaEditada, id: e.target.value })
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                  disabled
                />
              </div>
              <div>
                <label htmlFor="nombre" className="block mb-1">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={materiaEditada.nombre}
                  onChange={(e) =>
                    setMateriaEditada({
                      ...materiaEditada,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <Boton type="submit" variant="success">
                  Guardar
                </Boton>
                <Boton type="button" onClick={() => setEdicion(false)}>
                  Cancelar
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionMateriasGenericas;
