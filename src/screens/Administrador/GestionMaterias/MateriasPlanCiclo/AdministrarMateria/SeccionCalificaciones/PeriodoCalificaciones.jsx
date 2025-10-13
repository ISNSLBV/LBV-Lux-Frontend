import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../../../../api/axios'
import { toast } from 'react-toastify'
import styles from './PeriodoCalificaciones.module.css'
import { Lock } from 'lucide-react'
import Boton from '../../../../../../components/Boton/Boton'

const PeriodoCalificaciones = ({ periodo, idMateriaPlanCiclo, userRole }) => {
  const queryClient = useQueryClient();
  const [editingStates, setEditingStates] = useState({});

  const canEditBlocked = userRole === 'Administrador';

  // Obtener las calificaciones del cuatrimestre
  const { data: calificaciones, isLoading } = useQuery({
    queryKey: ['materia-plan-ciclo-calificaciones', idMateriaPlanCiclo, periodo],
    queryFn: async () => {
      const response = await api.get(`/admin/materia/materia-plan-ciclo/${idMateriaPlanCiclo}/calificaciones/${periodo}`);
      return response.data;
    }
  });

  // Mutación para actualizar calificación
  const actualizarCalificacion = useMutation({
    mutationFn: async ({ inscripcionId, calificacion }) => {
      await api.put(`/admin/materia/materia-plan-ciclo/calificaciones/${inscripcionId}`, { 
        calificacion,
        cuatrimestre: periodo
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['materia-plan-ciclo-calificaciones', idMateriaPlanCiclo, periodo]);
      toast.success('Calificación actualizada correctamente');
      setEditingStates({});
    },
    onError: (error) => {
      toast.error('Error al actualizar la calificación: ' + (error.response?.data?.error || 'Error desconocido'));
      console.error('Error:', error);
    }
  });

  const handleEdit = (inscripcionId, calificacionActual) => {
    setEditingStates(prev => ({
      ...prev,
      [inscripcionId]: calificacionActual?.toString() || ''
    }));
  };

  const handleSave = (inscripcionId) => {
    const calificacion = parseFloat(editingStates[inscripcionId]);
    if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
      toast.error('La calificación debe ser un número entre 0 y 10');
      return;
    }
    actualizarCalificacion.mutate({ inscripcionId, calificacion });
  };

  if (isLoading) {
    return <div>Cargando calificaciones...</div>;
  }

  return (
    <div className={styles.container}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Calificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {calificaciones?.map((cal) => {
            const isEditing = cal.inscripcionId in editingStates;
            const canEdit = !cal.bloqueada || canEditBlocked;
            
            return (
              <tr key={cal.inscripcionId} className={cal.bloqueada ? styles.bloqueada : ''}>
                <td>{cal.alumno.nombre} {cal.alumno.apellido}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editingStates[cal.inscripcionId]}
                      onChange={(e) => setEditingStates(prev => ({
                        ...prev,
                        [cal.inscripcionId]: e.target.value
                      }))}
                      min="0"
                      max="10"
                      step="0.01"
                    />
                  ) : (
                    <div className={styles.calificacionContainer}>
                      {cal.calificacion || '-'}
                      {cal.bloqueada && (
                        <span className={styles.lockIcon} title={canEditBlocked ? "Bloqueada (podés editar como administrador)" : "Bloqueada"}>
                          <Lock />
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className={styles.acciones}>
                  {isEditing ? (
                    <>
                      <Boton 
                        onClick={() => handleSave(cal.inscripcionId)}
                        variant='success'
                      >
                        Guardar
                      </Boton>
                      <Boton 
                        onClick={() => setEditingStates(prev => {
                          const newState = {...prev};
                          delete newState[cal.inscripcionId];
                          return newState;
                        })}
                        variant='cancel'
                      >
                        Cancelar
                      </Boton>
                    </>
                  ) : (
                    canEdit && (
                      <Boton
                        variant='primary'
                        onClick={() => handleEdit(cal.inscripcionId, cal.calificacion)}
                        title={cal.bloqueada ? "Editar (como administrador)" : "Editar"}
                      >
                        Editar
                      </Boton>
                    )
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PeriodoCalificaciones;