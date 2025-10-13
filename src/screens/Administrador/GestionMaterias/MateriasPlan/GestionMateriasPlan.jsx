import React from "react";
import styles from "./GestionMateriasPlan.module.css";
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

const fetchMateriasPlan = async () => {
  const { data } = await api.get("/admin/materia/materia-plan/listar-materias");
  return data;
};

const GestionMateriasPlan = () => {
  const [nuevaMateria, setNuevaMateria] = useState({
    id_materia: "",
    id_plan_estudio: "",
    horas_catedra: "",
    duracion: "",
    anio_carrera: "",
  });
  const [filtro, setFiltro] = useState("");
  const [edicion, setEdicion] = useState(false);
  const [registro, setRegistro] = useState(false);
  const [materiaEditada, setMateriaEditada] = useState({
    id: "",
    id_materia: "",
    id_plan_estudio: "",
    horas_catedra: "",
    duracion: "",
    anio_carrera: "",
  });

  const queryClient = useQueryClient();

  const {
    data: materiasPlan = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["materiasPlan"],
    queryFn: fetchMateriasPlan,
  });

  const { data: materias = [], isLoading: isLoadingMaterias } = useQuery({
    queryKey: ["todasMaterias"],
    queryFn: async () => {
      const { data } = await api.get("/admin/materia/listar-materias");
      return data;
    },
  });

  const { data: planes = [], isLoading: isLoadingPlanes } = useQuery({
    queryKey: ["todosPlanesEstudio"],
    queryFn: async () => {
      const { data } = await api.get("/admin/plan-estudio/listar-planes");
      return data;
    },
  });

  const campos = [
    {
      label: "ID",
      accessor: (m) => m.id,
    },
    {
      label: "Nombre",
      accessor: (m) => m.materia?.nombre,
    },
    {
      label: "Resolución",
      accessor: (m) => m.planEstudio?.resolucion,
    },
    {
      label: "Horas cátedra",
      accessor: (m) => m.horas_catedra,
    },
    {
      label: "Duración",
      accessor: (m) => m.duracion,
    },
    {
      label: "Año de carrera",
      accessor: (m) => m.anio_carrera,
    },
  ];

  const registrarMateria = useMutation({
    mutationFn: ({ idPlan, idMateria, horasCatedra, duracion, anioCarrera }) =>
      api.post(`/admin/materia/materia-plan/${idPlan}/registrar-materia`, {
        idMateria,
        horasCatedra,
        duracion,
        anioCarrera,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiasPlan"] });
      toast.success("Materia registrada");
    },
    onError: () => toast.error("Error al registrar la materia"),
  });

  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (
      !nuevaMateria.id_materia ||
      !nuevaMateria.id_plan_estudio ||
      !nuevaMateria.horas_catedra ||
      !nuevaMateria.duracion ||
      !nuevaMateria.anio_carrera
    )
      return;
    registrarMateria.mutate({
      idPlan: nuevaMateria.id_plan_estudio,
      idMateria: nuevaMateria.id_materia,
      horasCatedra: nuevaMateria.horas_catedra,
      duracion: nuevaMateria.duracion,
      anioCarrera: nuevaMateria.anio_carrera,
    });
    setNuevaMateria({
      id_materia: "",
      id_plan_estudio: "",
      horas_catedra: "",
      duracion: "",
      anio_carrera: "",
    });
    setRegistro(false);
  };

  const editarMateriaPlan = useMutation({
    mutationFn: ({ id, horas_catedra, duracion, anio_carrera }) =>
      api.put(`/admin/materia/materia-plan/${id}`, {
        horasCatedra: horas_catedra,
        duracion,
        anioCarrera: anio_carrera,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiasPlan"] });
      toast.success("Materia del plan actualizada");
      setEdicion(false);
    },
    onError: () => toast.error("Error al actualizar la materia del plan"),
  });

  const materiasFiltradas = materiasPlan.filter((m) =>
    m.materia?.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Materias por plan de estudio</h1>
        <p>Registrá y editá las materias por plan de estudio</p>
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
        <h2>Listado de materias</h2>
        <TablaGestion
          columnas={campos}
          data={materiasFiltradas}
          isLoading={isLoading}
          vacioTexto="No se encontraron materias"
          renderAcciones={(m) => (
            <Boton
              variant="onlyIcon"
              icono={<SquarePen />}
              onClick={() => {
                setMateriaEditada({
                  id: m.id,
                  id_materia: m.id_materia,
                  id_plan_estudio: m.id_plan_estudio,
                  horas_catedra: m.horas_catedra,
                  duracion: m.duracion,
                  anio_carrera: m.anio_carrera,
                });
                setEdicion(true);
              }}
            />
          )}
        />
        <CardGestion
          data={materiasFiltradas}
          campos={campos}
          isLoading={isLoading}
          vacioTexto="No se encontraron materias"
          renderAcciones={(materia) => (
            <Boton
              fullWidth
              icono={<SquarePen />}
              variant="primary"
              onClick={() => {
                setMateriaEditada({
                  id: materia.id,
                  id_materia: materia.id_materia,
                  id_plan_estudio: materia.id_plan_estudio,
                  horas_catedra: materia.horas_catedra,
                  duracion: materia.duracion,
                  anio_carrera: materia.anio_carrera,
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
                  Materia
                </label>
                <select
                  name="nombre"
                  id="nombre"
                  value={nuevaMateria.id_materia}
                  onChange={(e) =>
                    setNuevaMateria((prev) => ({
                      ...prev,
                      id_materia: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Seleccionar materia</option>
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nombre}
                    </option>
                  ))}
                </select>
                <label htmlFor="plan" className="block mb-1">
                  Resolución Nº
                </label>
                <select
                  name="plan"
                  id="plan"
                  value={nuevaMateria.id_plan_estudio}
                  onChange={(e) =>
                    setNuevaMateria((prev) => ({
                      ...prev,
                      id_plan_estudio: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Seleccionar plan</option>
                  {planes.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.resolucion} - {plan.carrera?.nombre}
                    </option>
                  ))}
                </select>
                <label htmlFor="horas" className="block mb-1">
                  Horas cátedra
                </label>
                <input
                  type="text"
                  id="horas"
                  value={nuevaMateria.horas_catedra}
                  onChange={(e) =>
                    setNuevaMateria((prev) => ({
                      ...prev,
                      horas_catedra: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
                <label htmlFor="duracion" className="block mb-1">
                  Duración
                </label>
                <select
                  type="text"
                  id="duracion"
                  value={nuevaMateria.duracion}
                  onChange={(e) =>
                    setNuevaMateria((prev) => ({
                      ...prev,
                      duracion: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Seleccioná una opción</option>
                  <option value="Anual">Anual</option>
                  <option value="Cuatrimestral">Cuatrimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Bimestral">Bimestral</option>
                  <option value="Trimestral">Trimestral</option>
                </select>
                <label htmlFor="anio" className="block mb-1">
                  Año de carrera
                </label>
                <input
                  type="text"
                  id="anio"
                  value={nuevaMateria.anio_carrera}
                  onChange={(e) =>
                    setNuevaMateria((prev) => ({
                      ...prev,
                      anio_carrera: e.target.value,
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
              <h3>Editar materia del plan</h3>
              <button
                className={styles.closeButton}
                onClick={() => setEdicion(false)}
              >
                <X />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editarMateriaPlan.mutate({
                  id: materiaEditada.id,
                  horas_catedra: materiaEditada.horas_catedra,
                  duracion: materiaEditada.duracion,
                  anio_carrera: materiaEditada.anio_carrera,
                });
              }}
            >
              <div className="mb-4">
                <label className="block mb-1">Materia</label>
                <input
                  type="text"
                  disabled
                  value={
                    materias.find(
                      (mat) => mat.id === +materiaEditada.id_materia
                    )?.nombre || ""
                  }
                  className="w-full border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
                  readOnly
                />
                <label className="block mb-1">Resolución Nº</label>
                <input
                  type="text"
                  disabled
                  value={
                    planes.find(
                      (plan) => plan.id === +materiaEditada.id_plan_estudio
                    )
                      ? `${
                          planes.find(
                            (plan) =>
                              plan.id === +materiaEditada.id_plan_estudio
                          ).resolucion
                        } - ${
                          planes.find(
                            (plan) =>
                              plan.id === +materiaEditada.id_plan_estudio
                          ).carrera?.nombre
                        }`
                      : ""
                  }
                  className="w-full border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
                  readOnly
                />
                <label htmlFor="horas-edit" className="block mb-1">
                  Horas cátedra
                </label>
                <input
                  type="text"
                  id="horas-edit"
                  value={materiaEditada.horas_catedra}
                  onChange={(e) =>
                    setMateriaEditada((prev) => ({
                      ...prev,
                      horas_catedra: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
                <label htmlFor="duracion-edit" className="block mb-1">
                  Duración
                </label>
                <select
                  id="duracion-edit"
                  value={materiaEditada.duracion}
                  onChange={(e) =>
                    setMateriaEditada((prev) => ({
                      ...prev,
                      duracion: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Seleccioná una opción</option>
                  <option value="Anual">Anual</option>
                  <option value="Cuatrimestral">Cuatrimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Bimestral">Bimestral</option>
                  <option value="Trimestral">Trimestral</option>
                </select>
                <label htmlFor="anio-edit" className="block mb-1">
                  Año de carrera
                </label>
                <input
                  type="text"
                  id="anio-edit"
                  value={materiaEditada.anio_carrera}
                  onChange={(e) =>
                    setMateriaEditada((prev) => ({
                      ...prev,
                      anio_carrera: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <Boton
                  type="submit"
                  variant="success"
                  loading={editarMateriaPlan.isLoading}
                >
                  Guardar
                </Boton>
                <Boton variant="cancel" type="button" onClick={() => setEdicion(false)}>
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

export default GestionMateriasPlan;
