import React from 'react'
import Estadistica from '../../components/Perfil/Estadistica/Estadistica'
import { TrendingUp, BookOpen, Award, Clock } from "lucide-react"
import Horarios from '../../components/Perfil/Horario/Horario'

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

  return (
    <div className='container'>
      {/* {estadisticas.map(op=>(
        <Estadistica
          key={op.label}
          icono={op.icono}
          label={op.label}
          valor={op.valor} 
        />
      ))}
      <div className='containerhorarios'>
        {materias.map(op => (
          <Horarios
            key={op.label}
            icono={op.nombreo}
            label={op.profesor}
            valor={op.horario} 
          />
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
      </div> */}
    </div>
  )
}

export default Perfil