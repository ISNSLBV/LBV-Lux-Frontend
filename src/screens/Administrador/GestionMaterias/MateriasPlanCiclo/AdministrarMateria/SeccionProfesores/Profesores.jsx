import React, { useState } from "react";
import styles from "./Profesores.module.css";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../../../../../../api/axios";

import { useAuth } from "../../../../../../contexts/AuthContext";
import Boton from "../../../../../../components/Boton/Boton";
import { Plus, Trash, Trash2 } from "lucide-react";

const ROLES = [
  { value: "Titular", label: "Titular" },
  { value: "Suplente", label: "Suplente" },
];

const fetchProfesores = async () => {
  const { data } = await api.get("/admin/profesor/listar-profesores");
  return data;
};

const Profesores = ({ profesores = [], idMateria }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [nuevoProfesor, setNuevoProfesor] = useState("");
  const [nuevoRol, setNuevoRol] = useState("Titular");

  const [editIndex, setEditIndex] = useState(null);
  const [editRol, setEditRol] = useState("Titular");

  const { data: posiblesProfesores = [], isLoading: loadingProfesores } =
    useQuery({
      queryKey: ["posiblesProfesores"],
      queryFn: fetchProfesores,
      enabled: showModal, // solo cuando se abre el modal
    });

  const asignarProfesor = useMutation({
    mutationFn: async ({ profesorId, profesorRol }) =>
      api.post(
        `/admin/materia/materia-plan-ciclo/${idMateria}/asignar-profesor`,
        {
          profesorId,
          profesorRol,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["detalleMateria", idMateria]);
      setShowModal(false);
      setNuevoProfesor("");
      setNuevoRol("Titular");
    },
  });

  const modificarRol = useMutation({
    mutationFn: async ({ profesorId, profesorRol }) =>
      api.put(
        `/admin/materia/materia-plan-ciclo/${idMateria}/modificar-rol-profesor`,
        {
          profesorId,
          profesorRol,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["detalleMateria", idMateria]);
      setEditIndex(null);
    },
  });

  const eliminarProfesor = useMutation({
    mutationFn: async (profesorId) =>
      api.delete(`/admin/materia/${idMateria}/eliminar-profesor`, {
        data: { profesorId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["detalleMateria", idMateria]);
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Profesores asignados</h2>
        {user.rol === "Administrador" && (
          <Boton
            icono={<Plus />}
            variant="success"
            onClick={() => setShowModal(true)}
          >
            Asignar profesor
          </Boton>
        )}
      </div>

      {/* Modal para asignar profesor */}
      {showModal && (
        <div className={styles.modal}>
          <h3>Asignar profesor</h3>
          <div className={styles.selectores}>
            {loadingProfesores ? (
              <p>Cargando profesores...</p>
            ) : (
              <select
                value={nuevoProfesor}
                onChange={(e) => setNuevoProfesor(e.target.value)}
              >
                <option value="">Seleccioná un/a profesor/a</option>
                {posiblesProfesores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.persona?.nombre} {p.persona?.apellido}
                  </option>
                ))}
              </select>
            )}
            <select
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.botones}>
            <Boton
              variant="success"
              fullWidth
              onClick={() =>
                asignarProfesor.mutate({
                  profesorId: nuevoProfesor,
                  profesorRol: nuevoRol,
                })
              }
              disabled={!nuevoProfesor}
            >
              Asignar
            </Boton>
            <Boton
              variant="cancel"
              fullWidth
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Boton>
          </div>
        </div>
      )}

      <ul className={styles.listaProfesores}>
        {profesores.length === 0 && <li>No hay profesores asignados.</li>}
        {profesores.map((prof, idx) => (
          <li key={prof.dni} className={styles.profesorItem}>
            <div className={styles.profesorNombre}>
              <span>
                {prof.nombre} {prof.apellido} ({prof.email})
              </span>
              <span>
                <b>{prof.rol.toUpperCase()}</b>
              </span>
            </div>
            {editIndex === idx ? (
              <div className={styles.editarRol}>
                <select
                  value={editRol}
                  onChange={(e) => setEditRol(e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <div className={styles.botonesRol}>
                  <Boton
                    fullWidth
                    onClick={() =>
                      modificarRol.mutate({
                        profesorId: prof.id_usuario,
                        profesorRol: editRol,
                      })
                    }
                  >
                    Guardar
                  </Boton>
                  <Boton
                    fullWidth
                    variant="cancel"
                    onClick={() => setEditIndex(null)}
                  >
                    Cancelar
                  </Boton>
                </div>
              </div>
            ) : (
              <div className={styles.opcionesProfesor}>
                {user.rol === "Administrador" && (
                  <>
                    <Boton
                      onClick={() => {
                        setEditIndex(idx);
                        setEditRol(prof.rol);
                      }}
                    >
                      Modificar rol
                    </Boton>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profesores;
