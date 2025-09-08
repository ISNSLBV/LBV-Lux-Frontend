import React, { useState, useEffect } from 'react'
import Boton from '../../../../../../components/Boton/Boton'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../../../../api/axios';
import { toast } from 'react-toastify';

const Configuracion = ({ idMateriaPlanCiclo }) => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaCierre, setFechaCierre] = useState('');
    const [fechasOriginales, setFechasOriginales] = useState({
        fechaInicio: '',
        fechaCierre: ''
    });
    const [errores, setErrores] = useState({});

    const queryClient = useQueryClient();

    // Obtener los detalles de la materia para cargar las fechas actuales
    const { data: materia, isLoading } = useQuery({
        queryKey: ["detalleMateria", idMateriaPlanCiclo],
        queryFn: async () => {
            const { data } = await api.get(
                `/admin/materia/materia-plan-ciclo/${idMateriaPlanCiclo}/detalle`
            );
            return data;
        },
        enabled: !!idMateriaPlanCiclo,
    });

    // Cargar fechas cuando se obtienen los datos de la materia
    useEffect(() => {
        if (materia) {
            const formatearFecha = (fecha) => {
                if (!fecha || fecha === '0000-00-00' || fecha === '0000-00-00 00:00:00') return '';
                try {
                    const fechaObj = new Date(fecha);
                    // Verificar si la fecha es válida
                    if (isNaN(fechaObj.getTime())) {
                        console.warn('Fecha inválida recibida:', fecha);
                        return '';
                    }
                    return fechaObj.toISOString().split('T')[0];
                } catch (error) {
                    console.warn('Error al formatear fecha:', fecha, error);
                    return '';
                }
            };

            const fechaInicioFormateada = formatearFecha(materia.fechaInicio);
            const fechaCierreFormateada = formatearFecha(materia.fechaCierre);
                        
            setFechaInicio(fechaInicioFormateada);
            setFechaCierre(fechaCierreFormateada);
            setFechasOriginales({
                fechaInicio: fechaInicioFormateada,
                fechaCierre: fechaCierreFormateada
            });
        }
    }, [materia]);

    // Verificar si hay cambios
    const haysCambios = () => {
        return fechaInicio !== fechasOriginales.fechaInicio || 
               fechaCierre !== fechasOriginales.fechaCierre;
    };

    // Validar fechas
    const validarFechas = () => {
        const nuevosErrores = {};

        // Si hay fecha de cierre pero no de inicio, es error
        if (fechaCierre && !fechaInicio) {
            nuevosErrores.fechaInicio = 'Debe establecer primero la fecha de inicio antes de la fecha de cierre';
        }

        // Si ambas fechas están presentes, validar el orden
        if (fechaInicio && fechaCierre && new Date(fechaCierre) < new Date(fechaInicio)) {
            nuevosErrores.fechaCierre = 'La fecha de cierre no puede ser anterior a la fecha de inicio';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Mutation para actualizar las fechas
    const actualizarFechas = useMutation({
        mutationFn: async ({ fechaInicio, fechaCierre }) => {
            await api.put(`/admin/materia/materia-plan-ciclo/modificar-materia/${idMateriaPlanCiclo}`, {
                materiaPlanCicloLectivoId: idMateriaPlanCiclo,
                fechaInicio: fechaInicio || null,
                fechaCierre: fechaCierre || null
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["detalleMateria", idMateriaPlanCiclo] });
            toast.success("Fechas actualizadas correctamente");
            setFechasOriginales({
                fechaInicio,
                fechaCierre
            });
        },
        onError: (error) => {
            toast.error("Error al actualizar las fechas");
            console.error(error);
        }
    });

    const handleGuardarCambios = () => {
        if (!validarFechas()) {
            return;
        }

        actualizarFechas.mutate({
            fechaInicio,
            fechaCierre
        });
    };

    const handleFechaInicioChange = (e) => {
        const nuevaFechaInicio = e.target.value;
        setFechaInicio(nuevaFechaInicio);
        
        // Si se borra la fecha de inicio, también borrar la fecha de cierre
        if (!nuevaFechaInicio && fechaCierre) {
            setFechaCierre('');
        }
        
        if (errores.fechaInicio) {
            setErrores(prev => ({ ...prev, fechaInicio: '' }));
        }
    };

    const handleFechaCierreChange = (e) => {
        setFechaCierre(e.target.value);
        if (errores.fechaCierre) {
            setErrores(prev => ({ ...prev, fechaCierre: '' }));
        }
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h2>Configuración de la materia</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                <div>
                    <label htmlFor="fechaInicio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Fecha de inicio <span style={{ fontWeight: 'normal', color: '#666' }}>(opcional)</span>
                    </label>
                    <input 
                        type="date" 
                        id="fechaInicio" 
                        value={fechaInicio}
                        onChange={handleFechaInicioChange}
                        style={{ 
                            width: '100%', 
                            padding: '0.5rem',
                            border: errores.fechaInicio ? '2px solid #ef4444' : '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    {errores.fechaInicio && (
                        <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {errores.fechaInicio}
                        </span>
                    )}
                </div>

                <div>
                    <label htmlFor="fechaCierre" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                        Fecha de cierre
                    </label>
                    <input 
                        type="date" 
                        id="fechaCierre" 
                        value={fechaCierre}
                        onChange={handleFechaCierreChange}
                        min={fechaInicio || undefined}
                        disabled={!fechaInicio}
                        style={{ 
                            width: '100%', 
                            padding: '0.5rem',
                            border: errores.fechaCierre ? '2px solid #ef4444' : '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                    {!fechaInicio && (
                        <span style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            Primero debe establecer una fecha de inicio
                        </span>
                    )}
                    {errores.fechaCierre && (
                        <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {errores.fechaCierre}
                        </span>
                    )}
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <Boton 
                        onClick={handleGuardarCambios}
                        disabled={!haysCambios() || actualizarFechas.isPending}
                        variant={haysCambios() ? "success" : "primary"}
                    >
                        {actualizarFechas.isPending ? 'Guardando...' : 'Guardar cambios'}
                    </Boton>
                </div>
            </div>
        </div>
    )
}

export default Configuracion