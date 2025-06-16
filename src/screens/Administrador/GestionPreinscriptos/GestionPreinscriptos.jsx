import { useEffect, useState } from 'react';
import api from '../../../api/axios'
import PreinscriptoCard from '../../../components/preinscripcion/PreinscriptoCard/PreinscriptoCard';
import styles from './GestionPreinscriptos.module.css';
import Boton from '../../../components/Boton/Boton';

export default function GestionPreinscriptos() {
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState({});
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [showAceptarModal, setShowAceptarModal] = useState(false);

  useEffect(() => {
    api.get('/api/admin/preinscripcion')
      .then(r => setPersonas(r.data))
      .catch(console.error);
  }, []);

  const aceptar = async (tipoAlumnoId) => {
    if (!personaSeleccionada) return;
    const carreraId = personaSeleccionada.preinscripcions?.[0]?.id_carrera;

    try {
      await api.post(`/api/admin/preinscripcion/${personaSeleccionada.id}/aceptar`, {
        tipoAlumnoId, carreraId
      });
      setPersonas((prev) => prev.filter(x => x.id !== personaSeleccionada.id));
      setShowAceptarModal(false);
      setPersonaSeleccionada(null);
    } catch (e) {
      // Mostrar error en un pequeño componente o snackbar si querés
      alert(e.response?.data?.message || 'Error');
    }
  };

  const ocultar = async (p) => {
    try {
      await api.post(`/api/admin/preinscripcion/${p.id}/ocultar`);
      setPersonas((prev) => prev.filter(x => x.id !== p.id));
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Panel de preinscriptos</h1>
        {personas.map(p => (
          <PreinscriptoCard 
            key={p.id} 
            persona={p} 
            onAceptar={() => {
              setPersonaSeleccionada(p);
              setShowAceptarModal(true);
            }}
            onOcultar={() => ocultar(p)} 
          />
        ))}
        {showAceptarModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Confirmá el tipo de alumno</h2>
              <select
                value={form.tipoAlumnoId || ''}
                onChange={e => setForm({ ...form, tipoAlumnoId: Number(e.target.value) })}
              >
                <option value="" disabled>Seleccioná una opción</option>
                <option value={1}>Regular</option>
                <option value={2}>Libre</option>
                <option value={3}>Oyente</option>
                <option value={4}>Itinerante</option>
              </select>
              <div className={styles.modalActions}>
                <Boton
                  variant='success'
                  onClick={() => aceptar(form.tipoAlumnoId)}
                  disabled={!form.tipoAlumnoId}
                >
                  Confirmar
                </Boton>
                <Boton
                  variant='cancel'
                  onClick={() => {
                    setShowAceptarModal(false);
                    setPersonaSeleccionada(null);
                  }}
                >
                  Cancelar
                </Boton>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
