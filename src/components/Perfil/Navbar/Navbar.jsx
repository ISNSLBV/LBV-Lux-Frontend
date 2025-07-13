import React, { useState } from 'react';
import Informacionpersonal from '../Informacionpersonal/Informacionpersonal';
import Materia             from '../Materia/Materia';
import Notas               from '../Notas/Notas';
import Horarios            from '../Horario/Horario';
import styles              from './Navbar.module.css';

const Navbar = ({ infoPersonal, materias, notasPromedio, horarios }) => {
  const [activeTab, setActiveTab] = useState('info');

  const renderTab = () => {
    switch (activeTab) {
      case 'info':
        return (
          <Informacionpersonal
            fechaNacimiento={infoPersonal.fechaNacimiento}
            dni={infoPersonal.dni}
            ingreso={infoPersonal.ingreso}
          />
        );
      case 'materias':
        return materias.map((m, i) => (
          <Materia key={i} materia={m} />
        ));
      case 'notas':
        return <Notas promedio={notasPromedio} />;
      case 'horarios':
        return horarios.map((h, i) => (
          <Horarios
            key={i}
            nombre={h.nombre}
            profesor={h.profesor}
            horario={h.horario}
          />
        ));
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.tabHeader}>
        {['info', 'materias', 'notas', 'horarios'].map(tab => (
          <button
            key={tab}
            className={`${styles.button} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {renderTab()}
      </div>
    </>
  );
};

export default Navbar;
