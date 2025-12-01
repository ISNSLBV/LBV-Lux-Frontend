import React from "react";
import styles from "./RepositorioMaterias.module.css";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import { Plus, X, SquarePen } from "lucide-react";
import Boton from "../../../../components/Boton/Boton";
import { useState } from "react";
import api from "../../../../api/axios";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TablaGestion from "../../../../components/Gestion/Tabla/TablaGestion";
import CardGestion from "../../../../components/Gestion/Card/CardGestion";
import BotonVolver from "../../../../components/BotonVolver/BotonVolver";

const fetchMaterias = async () => {
  const { data } = await api.get("/admin/materia/listar-materias");
  return data;
};

const RepositorioMaterias = () => {
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
    queryKey: ["repositorioMaterias"],
    queryFn: fetchMaterias,
  });

  const campos = [
    { label: "ID", accessor: (m) => m.id },
    { label: "Nombre", accessor: (m) => m.nombre },
    {
      label: "Estado",
      accessor: (m) =>
        m.plan_estudio && m.plan_estudio.length > 0 ? "En uso" : "Sin asignar",
    },
    {
      label: "Plan(es) de estudio",
      accessor: (m) => m.plan_estudio.map((p) => p.resolucion).join(", "),
    },
    {
      label: "Carreras",
      accessor: (m) => m.carrera.map((c) => c.nombre).join(", "),
    },
  ];

  const registrarMateria = useMutation({
    mutationFn: (nombre) =>
      api.post("/admin/materia/registrar-materia", { nombre }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repositorioMaterias"] });
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
    mutationFn: ({ id, nombre }) => api.put(`/admin/materia/${id}`, { nombre }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repositorioMaterias"] });
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
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Repositorio de Materias</h1>
        <p>
          Registrá y editá los nombres de las materias dictadas en el instituto
        </p>
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
            Registrar materia
          </Boton>
        </div>
      </div>
      <div className={styles.listaMaterias}>
        <h2>Catálogo de materias</h2>
        <TablaGestion
          columnas={campos}
          data={materiasFiltradas}
          isLoading={isLoading}
          vacioTexto="No se encontraron materias."
          renderAcciones={(m) => (
            <Boton
              variant="onlyIcon"
              icono={<SquarePen />}
              onClick={() => {
                setMateriaEditada({ id: m.id, nombre: m.nombre });
                setEdicion(true);
              }}
            />
          )}
        />
        <CardGestion
          data={materiasFiltradas}
          campos={campos}
          isLoading={isLoading}
          vacioTexto="No se encontraron materias."
          renderAcciones={(materia) => (
            <Boton
              fullWidth
              icono={<SquarePen />}
              variant="primary"
              onClick={() => {
                setMateriaEditada({ id: materia.id, nombre: materia.nombre });
                setEdicion(true);
              }}
            >
              Editar
            </Boton>
          )}
        />
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
              <div className={styles.formData}>
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
                <Boton
                  variant="cancel"
                  type="button"
                  onClick={() => setRegistro(false)}
                >
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
                <Boton
                  variant="cancel"
                  type="button"
                  onClick={() => setEdicion(false)}
                >
                  Cancelar
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RepositorioMaterias;
