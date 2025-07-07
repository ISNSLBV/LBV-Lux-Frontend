import React from "react";
import { useState } from "react";
import styles from './GestionCarreras.module.css'
import DatoCard from '../../../components/Dato/DatoCard'
import SearchBar from '../../../components/SearchBar/SearchBar'
import Boton from "../../../components/Boton/Boton";
import { Plus, GraduationCap, Users, TrendingUp, BookOpen } from "lucide-react";

const GestionCarreras = () => {
  const [filtro, setFiltro] = useState('')

  const datos = [
    {
      titulo: 'Total de carreras',
      icono: <GraduationCap />,
      dato: '0'
    },
    {
      titulo: 'Carreras activas',
      icono: <Users />,
      dato: '0'
    },
    {
      titulo: 'Estudiantes activos',
      icono: <TrendingUp />,
      dato: '0'
    },
    {
      titulo: 'Total de graduados',
      icono: <BookOpen />,
      dato: '0'
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.titulo}>
        <h1>Materias base</h1>
        <p>Gestioná las materias base dictadas en el instituto</p>
      </div>
      <div className={styles.datos}>
        {datos.map((dato, index) => (
          <DatoCard
            key={index}
            titulo={dato.titulo}
            icono={dato.icono}
            dato={dato.dato}
            descripcion={dato.descripcion}
          />
        ))}
      </div>
      <div className={styles.barraAcciones}>
        <div className={styles.barraBusqueda}>
          <SearchBar
            placeholder="Buscar carrera"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className={styles.botonAgregar}>
          <Boton
            variant="success"
            icono={<Plus />}
            onClick={() => setModalOpen(true)}
          >
            Registrar nueva carrera
          </Boton>
        </div>
      </div>
    </div>
  );
};

export default GestionCarreras;
