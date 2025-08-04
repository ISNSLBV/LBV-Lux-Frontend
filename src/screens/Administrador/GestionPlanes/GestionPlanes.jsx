import React, { useState } from "react";
import api from "../../../api/axios";
import TablaGestion from "../../../components/Gestion/Tabla/TablaGestion";
import CardGestion from "../../../components/Gestion/Card/CardGestion";
import { Plus, SquarePen, X } from "lucide-react";
import SearchBar from "../../../components/SearchBar/SearchBar";
import styles from "./GestionPlanes.module.css";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Boton from "../../../components/Boton/Boton";

const fetchPlanes = async () => {
  const { data } = await api.get("/admin/plan-estudio/listar-planes");
  return data;
};

const GestionPlanes = () => {
  const [nuevoPlan, setNuevoPlan] = useState({
    id_carrera: "",
    resolucion: "",
    anio_implementacion: "",
  });
  const [filtro, setFiltro] = useState("");
  const [edicion, setEdicion] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [planEditado, setPlanEditado] = useState({
    id: "",
    id_carrera: "",
    resolucion: "",
    anio_implementacion: "",
    vigente: "",
  });

  const queryClient = useQueryClient();

  const {
    data: planes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["planes"],
    queryFn: fetchPlanes,
  });

  const campos = [
    {
      label: "ID",
      accessor: (p) => p.id,
    },
    {
      label: "Resolución",
      accessor: (p) => p.resolucion,
    },
    {
      label: "Carrera",
      accessor: (p) => p.carrera?.nombre,
    },
    {
      label: "Año de implementación",
      accessor: (p) => p.anio_implementacion,
    },
    {
      label: "Vigente",
      accessor: (p) => p.vigente === 1 ? 'Sí' : 'No',
    },
  ];

  const registrarPlan = useMutation({
    mutationFn: ({ idCarrera, resolucion, anio_implementacion }) =>
      api.post(`/admin/plan-estudio/${idCarrera}/registrar-plan`, {
        resolucion,
        anio_implementacion,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planes"] });
      toast.success("Plan de estudio registrado");
    },
    onError: () => toast.error("Error al registrar el plan de estudio"),
  });

  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (
      !nuevoPlan.id_carrera ||
      !nuevoPlan.resolucion ||
      !nuevoPlan.anio_implementacion
    )
      return;
    registrarPlan.mutate({
      idCarrera: nuevoPlan.id_carrera,
      resolucion: nuevoPlan.resolucion,
      anio_implementacion: nuevoPlan.anio_implementacion,
    });
    setNuevoPlan({
      id_carrera: "",
      resolucion: "",
      anio_implementacion: "",
    });
    setRegistro(false);
  };

  const planesFiltrados = planes.filter((p) =>
    p.resolucion.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Planes de estudio</h1>
        <p>Registrá y editá los planes de estudio del instituto</p>
      </div>
      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
          <SearchBar
            placeholder="Buscar resolución"
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
            Registrar plan de estudio
          </Boton>
        </div>
      </div>
      <div className={styles.listaPlanes}>
        <h2>Listado de planes de estudio</h2>
        <TablaGestion
          columnas={campos}
          data={planesFiltrados}
          isLoading={isLoading}
          vacioTexto="No se encontraron planes de estudio"
          renderAcciones={(p) => (
            <Boton
              variant="onlyIcon"
              icono={<SquarePen />}
              onClick={() => {
                setPlanEditado({
                  id: p.id,
                  id_carrera: p.id_carrera,
                  resolucion: p.resolucion,
                  anio_implementacion: p.anio_implementacion,
                  vigente: p.vigente,
                });
                setEdicion(true);
              }}
            />
          )}
        />
        <CardGestion
          data={planesFiltrados}
          campos={campos}
          isLoading={isLoading}
          vacioTexto="No se encontraron planes de estudio"
          renderAcciones={(plan) => (
            <Boton
              fullWidth
              icono={<SquarePen />}
              variant="primary"
              onClick={() => {
                setPlanEditado({
                  id: plan.id,
                  id_carrera: plan.id_carrera,
                  resolucion: plan.resolucion,
                  anio_implementacion: plan.anio_implementacion,
                  vigente: plan.vigente,
                });
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
              <h3>Registrar nuevo plan de estudio</h3>
              <button
                className={styles.closeButton}
                onClick={() => setRegistro(false)}
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleRegistrar}>
              <div className="mb-4">
                <label htmlFor="resolucion" className="block mb-1">
                  Resolución Nº
                </label>
                <input
                  type="text"
                  id="resolucion"
                  value={nuevoPlan.resolucion}
                  onChange={(e) =>
                    setNuevoPlan((prev) => ({
                      ...prev,
                      resolucion: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
                <label htmlFor="carrera" className="block mb-1">
                  Carrera
                </label>
                <select
                  name="carrera"
                  id="carrera"
                  value={nuevoPlan.id_carrera}
                  onChange={(e) =>
                    setNuevoPlan((prev) => ({
                      ...prev,
                      id_carrera: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="" disabled>
                    Seleccioná una opción
                  </option>
                  <option value="1">Técnico Analista de Sistemas</option>
                  <option value="2">Técnico en Redes Informáticas</option>
                </select>
                <label htmlFor="anio_implementacion" className="block mb-1">
                  Año de implementación
                </label>
                <input
                  type="text"
                  id="anio_implementacion"
                  value={nuevoPlan.anio_implementacion}
                  onChange={(e) =>
                    setNuevoPlan((prev) => ({
                      ...prev,
                      anio_implementacion: e.target.value,
                    }))
                  }
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
    </div>
  );
};

export default GestionPlanes;
