import React from "react";
import Header from "../../components/Header/Header";
import PreguntasFrecuentesDesplegable from "../../components/FAQ/PreguntasFrecuentesDesplegable";
import estilos from "./PreguntasFrecuentes.module.css";

const datosPreguntas = [
  {
    titulo: "¿Cómo puedo preinscribirme a una carrera?",
    descripcion:
      "Para poder preinscribirte a una carrera, debés acceder a la pantalla de inicio y hacer clic en el botón de Preinscripción. Allí completarás un formulario con tus datos. Esta información nos permite conocer cuál es la carrera de tu interés y ponernos en contacto contigo. Una vez completado el formulario, recibirás automáticamente la información con la documentación necesaria para la inscripción y detalles del plan de estudio.",
  },
  {
    titulo:
      "¿Hay alguna diferencia entre inscribirme como alumno regular, oyente o itinerante?",
    descripcion:
      "Sí, existen diferencias importantes en el proceso de inscripción según tu categoría:\n\n• Estudiante Regular: Es el alumno que cursa la carrera de forma completa, cumpliendo con la cursada, evaluaciones y exámenes finales según el Plan de Estudio. Deberás presentar toda la documentación requerida para la inscripción.\n\n• Estudiante Itinerante: Son aquellos que provienen de otra institución y buscan homologar materias. Deben completar el formulario de inscripción y presentar un certificado de alumno regular o de inscripción a la carrera en la institución de la cual provienen, acreditar las correlativas aprobadas y garantizar la equivalencia de contenido y carga horaria de las materias que desean convalidar. Las prácticas profesionalizantes no están incluidas en esta categoría.\n\n• Estudiante Oyente: Asistís a clases sin obtener calificación ni seguimiento académico. Tu admisión está sujeta a la disponibilidad de espacio en las materias. También podés asistir como oyente a materias que quieras rendir en condición de libre o a aquellas en las que, por cambio de plan, aún debas rendir finales pendientes (con un plazo máximo de ocho turnos).",
  },
  {
    titulo: "¿Cómo puedo enterarme de las fechas de preinscripción?",
    descripcion:
      "Las fechas de preinscripción son publicadas anualmente en la página oficial del Instituto y en nuestras redes sociales, incluyendo Facebook e Instagram.",
  },
  {
    titulo:
      "¿Cuál es la documentación necesaria para preinscribirme a una carrera?",
    descripcion:
      "Para inscribirte a una carrera en el Instituto, deberás presentar la siguiente documentación:\n\n• Fotocopia del DNI.\n• Fotocopia de la Partida de Nacimiento.\n• Dos fotos (tipo carnet).\n• Fotocopia del Título Secundario (con número de registro en la provincia) o Constancia de Título en Trámite.\n• Ficha de Inscripción (con tus datos personales).\n• Apto Psicofísico.\n\nImportante: Si al momento de la inscripción adeudás alguna materia del secundario, podrás inscribirte igual, pero tendrás un plazo dentro del primer cuatrimestre para regularizar tu situación.",
  },
  {
    titulo: "¿Cómo obtengo un usuario en el sistema?",
    descripcion:
      "Una vez que tu inscripción como alumno haya sido validada por la administración del instituto, se te generará un usuario para acceder al sistema de gestión académica. Recibirás esta información a través de tu correo electrónico registrado. En caso de no recibirla, contactá a la secretaría del instituto.",
  },
  {
    titulo: "¿Hay un límite de cupos para las carreras?",
    descripcion:
      "No se establecen cupos limitantes para la inscripción de alumnos regulares a las carreras. Sin embargo, para los alumnos oyentes, la admisión está sujeta a la disponibilidad de espacio en las aulas.",
  },
  {
    titulo: "¿Cómo están estructuradas las carreras?",
    descripcion:
      "Nuestras carreras se estructuran en diferentes planes de estudio, los cuales definen las materias a cursar y su modalidad:\n\n• La Tecnicatura Superior en Análisis de Sistemas (Plan 6790/19) se organiza con materias anuales.\n\n• La Tecnicatura Superior en Redes Informáticas (Plan 4223/23) incorpora tanto materias anuales como cuatrimestrales.\n\nLas materias cuatrimestrales tienen sus cierres y fechas de examen específicos en julio para el primer cuatrimestre y en diciembre/marzo para el segundo. Podés consultar el detalle de cada plan, incluyendo los tipos de aprobación por materia, en la sección correspondiente de la página.",
  },
  {
    titulo: "¿Dónde puedo ver el plan de estudios de cada carrera?",
    descripcion:
      "Podés consultar los planes de estudio vigentes de cada carrera al seleccionar una carrera en el formulario de preinscripción. Además, los programas detallados de cada materia estarán disponibles en el sistema de gestión académica, en un espacio que será cargado por los docentes.",
  },
  {
    titulo: "¿Cómo me inscribo a una materia?",
    descripcion:
      "La inscripción a las materias de cada cuatrimestre o año se realizará directamente a través de este sistema, al que accederás con tu usuario. El sistema validará automáticamente el cumplimiento de las condiciones para poder inscribirte a una materia.",
  },
  {
    titulo: "¿Dónde puedo ver qué materias son correlativas?",
    descripcion:
      "La información detallada sobre las correlatividades de cada materia se encuentra publicada en los planes de estudio de tu carrera, los cuales estarán disponibles en el sistema de gestión académica. Además, al intentar inscribirte a una materia o a un examen final, el sistema te indicará automáticamente si cumplís con las correlativas necesarias.",
  },
  {
    titulo:
      "¿Puedo inscribirme a una materia si aún adeudo el final de su correlativa?",
    descripcion:
      "No. Para inscribirte a una materia (sea para cursada o para rendir el examen final), deberás tener las materias correlativas aprobadas con el examen final. El sistema realizará esta validación automáticamente y no te permitirá la inscripción si no se cumple este requisito.",
  },
  {
    titulo: "¿En qué meses hay finales y cuántos llamados hay?",
    descripcion:
      "Las mesas de exámenes finales ordinarias se desarrollan en los meses de Febrero y Marzo (antes del inicio de clases), Agosto (posterior al receso invernal) y Diciembre (fin del período de clases). Adicionalmente, existen turnos extraordinarios en Mayo o Septiembre, exclusivamente para aquellos alumnos que adeuden la última materia para finalizar su carrera.",
  },
  {
    titulo: "¿Cómo puedo inscribirme a un examen final?",
    descripcion:
      "Las inscripciones a mesas de exámenes finales se realizarán a través del sistema de gestión académica del Instituto. El sistema validará automáticamente que cumplas con todas las correlativas necesarias para rendir el examen.",
  },
  {
    titulo:
      "¿Qué sucede si no tengo aprobado el final de una materia correlativa al momento de rendir un final?",
    descripcion:
      "Si al momento de querer rendir un examen final no tenés aprobado el final de su materia correlativa, el sistema no te permitirá inscribirte a esa mesa. En caso de que, por algún error de control manual, un alumno se presentara a rendir y no tuviera la correlativa aprobada, la nota obtenida en el examen final será anulada, ya que es responsabilidad del estudiante verificar sus correlativas.",
  },
  {
    titulo: "Hay materias que puedan ser rendidas en condición de libre?",
    descripcion:
      "Sí, se puede optar por rendir la mayoría de las materias en condición de alumno libre, siempre que sean materias teóricas. Las excepciones, que no se pueden rendir libre, son las Prácticas Profesionalizantes, el Seminario de Actualización, y cualquier formato de Taller, Laboratorio o Ateneo.",
  },
  {
    titulo: "¿Cómo es la modalidad de aprobación del examen libre?",
    descripcion:
      'El examen en condición de alumno libre generalmente consta de dos instancias de evaluación: una parte escrita y una parte oral. Deberás obtener una nota igual o superior a 4 en ambas instancias para aprobar. Es posible que el docente elabore un "Trabajo Previo" a defender durante el examen; en esos casos, se te entregará la consigna con anticipación. Es fundamental consultar con el docente de la materia para conocer las condiciones específicas y si hay un trabajo previo.',
  },
  {
    titulo:
      "¿Cuál es el porcentaje de asistencia necesario para mantener la regularidad?",
    descripcion:
      "El porcentaje de asistencia mínimo para aprobar la cursada y mantener la regularidad es:\n\n• 60% para materias con Presencialidad Plena (PP).\n• 80% para materias con Presencialidad con Propuestas Pedagógicas Combinadas (PPC).\n• 80% para Prácticas, Talleres, Laboratorios y Ateneos (incluyendo Prácticas Profesionalizantes y Seminarios).",
  },
  {
    titulo:
      "¿Cómo puedo justificar las inasistencias por enfermedad, embarazo, etc.?",
    descripcion:
      "En caso de necesitar justificar inasistencias por motivos médicos, embarazo, paternidad u otras consideraciones particulares, deberás comunicarte directamente con la administración del Instituto y presentar la documentación respaldatoria que corresponda. Estas inasistencias justificadas no serán computables en tu porcentaje de asistencia.",
  },
  {
    titulo: "¿Cómo es el método de aprobación de las materias?",
    descripcion:
      "El método de aprobación dependerá de cada materia: \n\n• Promoción Directa (sin examen final): Aplica a Prácticas Profesionalizantes y Seminarios. Se aprueban con una nota de 7 (siete) o más en cada evaluación, incluyendo recuperatorios. Si no se alcanza esta nota, la materia se recursa. \n\n• Promoción con examen final: Si tu nota final de cursada está entre 4 (cuatro) y 6 (seis) puntos (inclusive), aprobás la cursada y accedés a la instancia de examen final. La nota mínima para promocionar directamente sin examen final es de 7 (siete) o más en cada evaluación (incluidos recuperatorios). \n\n• Final obligatorio: Algunas materias específicas (detalladas en el plan de estudios) siempre requieren examen final, para acceder al mismo necesitás una nota mayor o igual a 4 (cuatro). \n\n La nota mínima para aprobar un examen final es de 4 (cuatro) o más puntos. La escala de calificaciones es del 1 al 10.",
  },
  {
    titulo: "¿Cómo consulto mis notas finales?",
    descripcion:
      "Una vez que el docente cargue las notas de tus evaluaciones y exámenes finales en el sistema, podrás consultar todas tus notas, tanto de cursada como de exámenes finales, accediendo a tu perfil en el sistema.",
  },
  {
    titulo: "¿Qué certificados puedo emitir de forma instantánea?",
    descripcion:
      "Desde el sistema de gestión académica, tendrás la posibilidad de generar y emitir de forma instantánea tu constancia de materias aprobadas y tu constancia de alumno regular. La constancia de materias aprobadas te mostrará el detalle de las materias que rendiste con final aprobado, la fecha de regularización y la fecha del final, y te permitirá conocer el porcentaje de avance de tu carrera.",
  },
  {
    titulo: "¿Los certificados tendrán una firma digital o manuscrita?",
    descripcion:
      "Los certificados que emitas desde el sistema podrán generarse tanto con una firma preimpresa (digital) como listos para ser firmados de forma manuscrita por la secretaría del Instituto. ",
  },
  {
    titulo:
      "¿Cuánto tiempo pasa desde solicitar el certificado hasta obtenerlo?",
    descripcion:
      "Podrás generar y descargar tu constancia de materias aprobadas de forma instantánea desde tu perfil de alumno. Si necesitás una copia con firma manuscrita y sello del Instituto, podrás acercarte a la secretaría con el certificado impreso para que sea validado.",
  },
  {
    titulo: "¿Cuánto dura la validez de la cursada?",
    descripcion:
      "La validez de la cursada de una materia vence después de 8 turnos consecutivos de exámenes finales (aproximadamente dos años y medio) desde su regularización, o después de 4 intentos no aprobados en el examen final. Vencido este plazo, deberás recursar la materia.",
  },
];

const PreguntasFrecuentes = () => {
  return (
    <>
      <Header />
      <main className={estilos.main}>
        <h1 className={estilos.titulo}>Preguntas Frecuentes</h1>
        <PreguntasFrecuentesDesplegable items={datosPreguntas} />
      </main>
    </>
  );
};

export default PreguntasFrecuentes;
