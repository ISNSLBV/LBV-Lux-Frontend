import React from 'react'
import Estadistica from '../../components/Perfil/Estadistica/Estadistica'
import { TrendingUp, BookOpen, Award, Clock } from "lucide-react"
import Horarios from '../../components/Perfil/Horario/Horario';
const Perfil = () => {
  const estadisticas = [
      {
        icono: <TrendingUp size={24} />,
        label: 'Promedio',
        valor: '8.5'
      },
      {
        icono: <BookOpen size={24} />,
        label: 'Materias',
        valor: '2'
      },
      {
        icono: <Award size={24} />,
        label: 'Aprobadas',
        valor: '12/28'
      },
      {
        icono: <Clock size={24} />,
        label: 'Asistencia',
        valor: '92%'
      }
     
    ];
  const materias = [
  {
    nombre: "Desarrollo Web Frontend",
    profesor: "Ing. Rodríguez, Carlos",
    horario: "Lun-Mie 18:00–20:00",
  },
  {
    nombre: "Metodologías Ágiles",
    profesor: "Lic. Fernández, María",
    horario: "Vie 14:00–18:00",
  },
];
 const materias2 = [
  {
    nombre: "Programación Orientada a Objetos",
    profesor: "Ing. García, Luis",
    cuatrimestre: "1er Cuatrimestre 2024",
    estado: "Aprobada",
    horario: "Lun-Mie 14:00-16:00",
    nota: 9
  },
  {
    nombre: "Base de Datos II",
    profesor: "Lic. Martínez, Ana",
    cuatrimestre: "1er Cuatrimestre 2024",
    estado: "Aprobada",
    horario: "Mar-Jue 16:00-18:00",
    nota: 8
  },
  {
    nombre: "Desarrollo Web Frontend",
    profesor: "Ing. Rodríguez, Carlos",
    cuatrimestre: "2do Cuatrimestre 2024",
    estado: "Cursando",
    horario: "Lun-Mie 18:00-20:00"
  },
  {
    nombre: "Metodologías Ágiles",
    profesor: "Lic. Fernández, María",
    cuatrimestre: "2do Cuatrimestre 2024",
    estado: "Cursando",
    horario: "Vie 14:00-18:00"
  },
  {
    nombre: "Inglés Técnico II",
    profesor: "Prof. Johnson, Sarah",
    cuatrimestre: "1er Cuatrimestre 2024",
    estado: "Aprobada",
    horario: "Mar 20:00-22:00",
    nota: 7
  }
];
calificaciones = [
  { materia: "Programación Orientada a Objetos", nota: 9 },
  { materia: "Base de Datos II", nota: 8 },
  { materia: "Inglés Técnico II", nota: 7 }
];


  return (
    <div className='container'>
        {estadisticas.map(op=>(
            <Estadistica
            key={op.label}
            icono={op.icono}
            label={op.label}
            valor={op.valor} />
            ))}
            <div className='containerhorarios'>
              {materias.map(op => (
                <Horarios
                  key={op.label}
                  icono={op.nombreo}
                  label={op.profesor}
                  valor={op.horario} />

              ))}
              <div className={styles.lista}>
                {materias.map((materias2, index) => (
                  <MateriaCard key={index} materia={materias2} />
                ))}
              </div>





              <div className={styles.lista}>
        {calificaciones.map((item, i) => (
          <div className={styles.fila} key={i}>
            <span>{item.materia}</span>
            <span className={styles.nota}>{item.nota}</span>
          </div>
        ))}
      </div>    

            </div>
    </div>
  )
}

export default Perfil