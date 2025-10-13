import React, { useState } from "react";
import styles from "./GestionCorrelativas.module.css";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import { Plus, X, SquarePen } from "lucide-react";
import Boton from "../../../../components/Boton/Boton";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TablaGestion from "../../../../components/Gestion/Tabla/TablaGestion";
import CardGestion from "../../../../components/Gestion/Card/CardGestion";
import api from "../../../../api/axios";
import BotonVolver from "../../../../components/BotonVolver/BotonVolver";

const fetchCorrelativas = async () => {
  const { data } = await api.get("/admin/correlativa/listar-correlativas");
  return data;
};

const fetchMateriasPlan = async () => {
  const { data } = await api.get("/admin/materia/materia-plan/listar-materias");
  return data;
};

const GestionCorrelativas = () => {
  const [registro, setRegistro] = useState(false);
  const [nuevaCorrelativa, setNuevaCorrelativa] = useState({
    materiaPlanId: "",
    correlativaId: "",
  });
  const [filtro, setFiltro] = useState("");

  const queryClient = useQueryClient();

  const { data: correlativas = [], isLoading } = useQuery({
    queryKey: ["correlativas"],
    queryFn: fetchCorrelativas,
  });

  const { data: materiasPlan = [], isLoading: isLoadingMateriasPlan } =
    useQuery({
      queryKey: ["materiasPlan"],
      queryFn: fetchMateriasPlan,
    });

  const correlativasAgrupadas = correlativas.reduce((acc, curr) => {
    const id = curr.materiaPrincipal.id;
    if (!acc[id]) {
      acc[id] = {
        ...curr,
        correlativas: [],
      };
    }
    acc[id].correlativas.push(curr.materiaCorrelativa?.materia?.nombre);
    return acc;
  }, {});

  const correlativasTabla = Object.values(correlativasAgrupadas);

  const campos = [
    {
      label: "Materia",
      accessor: (c) => c.materiaPrincipal?.materia?.nombre,
    },
    {
      label: "Resolución",
      accessor: (c) => c.materiaPrincipal?.planEstudio?.resolucion,
    },
    {
      label: "Correlativas",
      accessor: (c) => c.correlativas.join(", "),
    },
  ];

  const registrarCorrelativa = useMutation({
    mutationFn: ({ materiaPlanId, correlativaId }) =>
      api.post("/admin/correlativa/registrar-correlativa", {
        materiaId: materiaPlanId,
        correlativaId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["correlativas"] });
      toast.success("Correlativa registrada");
    },
    onError: () => toast.error("Error al registrar correlativa"),
  });

  const handleRegistrar = (e) => {
    e.preventDefault();
    if (!nuevaCorrelativa.materiaPlanId || !nuevaCorrelativa.correlativaId) {
      toast.error("Seleccioná materia y correlativa");
      return;
    }
    if (nuevaCorrelativa.materiaPlanId === nuevaCorrelativa.correlativaId) {
      toast.error("No puede ser correlativa de sí misma");
      return;
    }
    registrarCorrelativa.mutate({
      materiaPlanId: nuevaCorrelativa.materiaPlanId,
      correlativaId: nuevaCorrelativa.correlativaId,
    });
    setRegistro(false);
    setNuevaCorrelativa({
      materiaPlanId: "",
      correlativaId: "",
    });
  };

  const correlativasFiltradas = correlativasTabla.filter(
    (c) =>
      c.materiaPrincipal?.materia?.nombre
        ?.toLowerCase()
        .includes(filtro.toLowerCase()) ||
      c.correlativas.some((nombre) =>
        nombre.toLowerCase().includes(filtro.toLowerCase())
      )
  );

  const resolucionSeleccionada = materiasPlan.find(
    (m) => String(m.id) === String(nuevaCorrelativa.materiaPlanId)
  )?.planEstudio?.resolucion;

  const correlativasPosibles = materiasPlan.filter(
    (m) =>
      m.planEstudio?.resolucion === resolucionSeleccionada &&
      String(m.id) !== String(nuevaCorrelativa.materiaPlanId)
  );

  return (
    <>
      <BotonVolver />
      <div className={styles.titulo}>
        <h1>Correlatividades</h1>
        <p>Gestioná las correlatividades entre materias</p>
      </div>
      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
          <SearchBar
            placeholder="Buscar materia/correlativa"
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
            Registrar correlativa
          </Boton>
        </div>
      </div>
      <div className={styles.listaCorrelativas}>
        <h2>Listado de correlatividades</h2>
        <TablaGestion
          columnas={campos}
          data={correlativasFiltradas}
          isLoading={isLoading}
          vacioTexto="No se encontraron correlatividades"
          renderAcciones={(m) => (
            <Boton
              variant="onlyIcon"
              icono={<SquarePen />}
              onClick={() => {
                setEdicion(true);
              }}
            />
          )}
        />
        <CardGestion
          data={correlativasFiltradas}
          campos={campos}
          isLoading={isLoading}
          vacioTexto="No se encontraron correlatividades"
        />
      </div>

      {/* Modal de registro */}
      {registro && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar correlativa</h3>
              <button
                className={styles.closeButton}
                onClick={() => setRegistro(false)}
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleRegistrar}>
              <div className="mb-4">
                <label htmlFor="materiaPlanId" className="block mb-1">
                  Materia (Nombre - Resolución)
                </label>
                <select
                  id="materiaPlanId"
                  value={nuevaCorrelativa.materiaPlanId}
                  onChange={(e) =>
                    setNuevaCorrelativa((prev) => ({
                      ...prev,
                      materiaPlanId: e.target.value,
                      correlativaId: "",
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Seleccionar materia</option>
                  {materiasPlan.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.materia?.nombre} - {m.planEstudio?.resolucion}
                    </option>
                  ))}
                </select>
                <label htmlFor="correlativaId" className="block mb-1">
                  Correlativa (mismo plan)
                </label>
                <select
                  id="correlativaId"
                  value={nuevaCorrelativa.correlativaId}
                  onChange={(e) =>
                    setNuevaCorrelativa((prev) => ({
                      ...prev,
                      correlativaId: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                  required
                  disabled={!resolucionSeleccionada}
                >
                  <option value="">Seleccionar correlativa</option>
                  {correlativasPosibles.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.materia?.nombre} - {m.planEstudio?.resolucion}
                    </option>
                  ))}
                </select>
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
    </>
  );
};

export default GestionCorrelativas;
