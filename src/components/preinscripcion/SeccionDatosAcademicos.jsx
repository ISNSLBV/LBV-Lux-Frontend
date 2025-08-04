import React from "react";
import SelectField from "../FormCampos/SelectField";
import InputField from "../FormCampos/InputField";

const SeccionDatosAcademicos = ({ formik }) => {
  const MAX_LENGTH_OBS = 70;

  const carreras = [
    {
      id: 1,
      nombre: "Técnico Analista de Sistemas",
    },
    {
      id: 2,
      nombre: "Técnico en Redes Informáticas",
    },
  ];

  return (
    <fieldset className="seccionDatosAcademicos">
      <legend>Datos Académicos</legend>

      <div className="campoFila">
        <div className="campoColumna">
          <SelectField
            label="Carrera"
            name="carrera"
            options={[
              { value: 1, label: "Técnico Analista de Sistemas" },
              { value: 2, label: "Técnico en Redes Informáticas" },
            ]}
            formik={formik}
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna campoObservaciones">
          <InputField
            label="Observaciones"
            name="observaciones"
            maxLength={MAX_LENGTH_OBS}
            placeholder=""
            formik={formik}
            type="text"
          />
          <div className="contador-caracteres">
            {(formik.values.observaciones || "").length} / {MAX_LENGTH_OBS}
          </div>
          <span className="obsAviso">
            Podes solicitar equivalencias por materias que hayas aprobado en
            otra institución y/o indicar si deseás inscribirte como alumno
            oyente o itinerante. Este campo es opcional
          </span>
        </div>
      </div>
    </fieldset>
  );
};

export default SeccionDatosAcademicos;
