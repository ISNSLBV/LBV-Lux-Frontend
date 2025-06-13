// components/preinscripcion/SeccionDatosAcademicos.jsx
import React from 'react';
import SelectField from '../FormCampos/SelectField';
import InputField from '../FormCampos/InputField';

const SeccionDatosAcademicos = ({ formik }) => {
  return (
    <fieldset className="seccionDatosAcademicos">
      <legend>Datos Académicos</legend>

      {/* Carrera + Fecha de Ingreso */}
      <div className="campoFila">
        <div className="campoColumna">
          <SelectField
            label="Carrera"
            name="carrera"
            options={[
              { value: 1, label: 'Técnico Analista de Sistemas' },
              { value: 2, label: 'Técnico en Redes Informáticas' },
            ]}
            formik={formik}
          />
        </div>
      </div>

      {/* Si quisieras agregar un campo libre, p. ej. “Requiere equivalencias” */}
      <div className="campoFila">
        <div className="campoColumna campoObservaciones">
          <InputField
            label="Observaciones"
            name="observaciones"
            placeholder=""
            formik={formik}
            type="text"
          />
          <span className='obsAviso'>
            Podes solicitar equivalencias por materias que hayas aprobado en otra institución y/o indicar si deseás inscribirte
            como alumno oyente o itinerante. Este campo es opcional
          </span>
        </div>
      </div>
    </fieldset>
  );
};

export default SeccionDatosAcademicos;
