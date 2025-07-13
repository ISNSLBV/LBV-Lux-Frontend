import React from "react";
import Estadistica from "../../components/Perfil/Estadistica/Estadistica";
import { TrendingUp, BookOpen, Award, Clock } from "lucide-react";
import Navbar from "../../components/Perfil/Navbar/Navbar";
import styles from "./Perfil.module.css";

const Perfil = () => {
  // Datos de prueba

  // 1. Estadísticas
  const estadisticasData = [
    { icono: <TrendingUp size={24} />, label: "Promedio", valor: "8.5" },
    { icono: <BookOpen size={24} />, label: "Materias", valor: "5" },
    { icono: <Award size={24} />, label: "Aprobadas", valor: "15/30" },
    { icono: <Clock size={24} />, label: "Asistencia", valor: "94%" },
  ];

  // 2. Horarios (por cada materia)
  const horariosData = [
    {
      nombre: "Desarrollo Web Frontend",
      profesor: "Ing. Rodríguez, Carlos",
      horario: "Lun-Mié 18:00–20:00",
    },
    {
      nombre: "Metodologías Ágiles",
      profesor: "Lic. Pérez, María",
      horario: "Mar-Jue 14:00–16:00",
    },
    {
      nombre: "Bases de Datos",
      profesor: "Ing. López, Ana",
      horario: "Vie 10:00–12:00",
    },
  ];

  // 3. Contacto
  const contactoData = {
    correoElectronico: "hector.guzman@lujanbuenviaje.edu.ar",
    telefono: "+54 11 1234-5678",
    direccion: "Ruta 8 Nº 6725, Loma Hermosa, San Martín",
  };

  // 4. Información personal
  const infoPersonalData = {
    fechaNacimiento: "1998-04-12",
    dni: "30.123.456",
    ingreso: "2021",
  };

  // 5. Materias (estado, nota opcional)
  const materiasData = [
    {
      nombre: "Lógica Computacional",
      profesor: "Dr. Gómez, Luis",
      horario: "Mar 08:00–10:00",
      estado: "Aprobada",
      nota: 9,
    },
    {
      nombre: "Técnicas de Programación",
      profesor: "Ing. Díaz, Marta",
      horario: "Jue 16:00–18:00",
      estado: "Inactiva",
    },
    {
      nombre: "Sistemas Operativos",
      profesor: "Ing. Silva, Juan",
      horario: "Mié 12:00–14:00",
      estado: "Activa",
      nota: 7.5,
    },
  ];

  // 6. Promedio general
  const promedioGeneral = 8.3;

  const estadisticas = estadisticasData;
  const horarios = horariosData;
  const contacto = contactoData;
  const informacionPersonal = infoPersonalData;
  const materias = materiasData;
  const promedio = promedioGeneral;

  return (
    <div className={styles.container}>
      <div className={styles.estadisticas}>
        {estadisticas.map((op) => (
          <Estadistica
            key={op.label}
            icono={op.icono}
            label={op.label}
            valor={op.valor}
          />
        ))}
      </div>

      <Navbar
        informacionPersonal={informacionPersonal}
        materias={materias}
        promedioNotas={promedio}
        horarios={horarios}
      />
    </div>
  );
};

export default Perfil;
