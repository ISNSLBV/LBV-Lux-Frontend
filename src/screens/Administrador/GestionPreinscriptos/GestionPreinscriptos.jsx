import { useEffect, useState } from 'react';
import api from '../../../api/axios'
import PreinscriptoCard from '../../../components/preinscripcion/PreinscriptoCard/PreinscriptoCard';
import styles from './GestionPreinscriptos.module.css';
import Boton from '../../../components/Boton/Boton';
import DatoCard from '../../../components/Dato/DatoCard';
import SearchBar from '../../../components/SearchBar/SearchBar'
import { Users, Calendar, TrendingUp, Check, X } from 'lucide-react';

export default function GestionPreinscriptos() {
  const [allPersonas, setAllPersonas] = useState([]);
  const [personasFiltradas, setPersonasFiltradas] = useState([]);
  const [form, setForm] = useState({});
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [showAceptarModal, setShowAceptarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pendiente');
  const [visibilityFilter, setVisibilityFilter] = useState('1');

  useEffect(() => {
    api.get('/admin/preinscripcion')
      .then(r => {
        setAllPersonas(r.data);
        setPersonasFiltradas(r.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtradas = allPersonas.filter(p => {
      const fullName = `${p.nombre} ${p.apellido}`.toLowerCase();
      const dni = p.dni?.toLowerCase() ?? '';

      const matchesSearch =
        !term ||
        fullName.includes(term) ||
        dni.includes(term);

      const estado = p.preinscripcions[0]?.estado;
      const visible = p.preinscripcions[0]?.visible;

      const matchesStatus = !statusFilter || estado === statusFilter;

      const matchesVisibility =
        !visibilityFilter ||
        (visibilityFilter === '1' ? visible === 1 : visible === 0);

      return matchesSearch && matchesStatus && matchesVisibility;
    });

    setPersonasFiltradas(filtradas);
  }, [searchTerm, statusFilter, visibilityFilter, allPersonas]);

  const añoActual = new Date().getFullYear();
  
  const datos = [
    { 
      titulo:'Total histórico', 
      icono:<Users/>, 
      dato: allPersonas.length
    },
    { 
      titulo:'Este año', 
      icono:<Calendar/>, 
      dato: allPersonas.filter(p =>
        new Date(p.preinscripcions[0]?.fecha_creacion).getFullYear() === añoActual
      ).length 
    },
    { 
      titulo:'Pendientes', 
      icono:<TrendingUp/>, 
      dato: allPersonas.filter(p =>
        p.preinscripcions[0]?.estado === 'Pendiente'
      ).length
    },
    { 
      titulo:'Aprobadas', 
      icono:<Check/>, 
      dato: allPersonas.filter(p =>
        p.preinscripcions[0]?.estado === 'Aprobada'
      ).length 
    },
    { 
      titulo:'Rechazadas', 
      icono:<X/>, 
      dato: allPersonas.filter(p =>
        p.preinscripcions[0]?.estado === 'Rechazada'
      ).length 
    }
  ];

  const aceptar = async (tipoAlumnoId) => {
    if (!personaSeleccionada) return;
    const carreraId = personaSeleccionada.preinscripcions?.[0]?.id_carrera;

    try {
      await api.post(`/admin/preinscripcion/${personaSeleccionada.id}/aceptar`, {
        tipoAlumnoId, carreraId
      });
      setAllPersonas((prev) => prev.filter(x => x.id !== personaSeleccionada.id));
      setShowAceptarModal(false);
      setPersonaSeleccionada(null);
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  const ocultar = async (p) => {
    try {
      await api.post(`/admin/preinscripcion/${p.id}/ocultar`);
      setAllPersonas((prev) => prev.filter(x => x.id !== p.id));
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Panel de preinscriptos</h1>
      </div>
      <div className={styles.datos}>
        {datos.map((d, index) => (
          <DatoCard 
            key={index}
            titulo={d.titulo}
            icono={d.icono}
            dato={d.dato}
          />
        ))}
      </div>
      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
          <SearchBar 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Buscá por nombre o DNI'
          />
        </div>
        <div className={styles.filtros}>
          <select value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Aprobada">Aprobadas</option>
            <option value="Rechazada">Rechazadas</option>
          </select>

          <select value={visibilityFilter}
                  onChange={e => setVisibilityFilter(e.target.value)}>
            <option value="">Todas</option>
            <option value="1">Visibles</option>
            <option value="0">Ocultas</option>
          </select>
        </div>
      </div>

      {personasFiltradas.map(p => (
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
