import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";

const SeccionDatosAcademicos = () => {
  const { values, errors, touched } = useFormikContext();
  const MAX_LENGTH_OBS = 70;

  return (
    <fieldset className="seccionDatosAcademicos">
      <legend>Datos Académicos</legend>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="carrera">Carrera *</label>
          <Field
            as="select"
            id="carrera"
            name="carrera"
            className={
              errors.carrera && touched.carrera
                ? "formikFieldError"
                : "formikField"
            }
          >
            <option value="">Seleccioná una carrera</option>
            <option value="1">Técnico Analista de Sistemas</option>
            <option value="2">Técnico en Redes Informáticas</option>
          </Field>
          <ErrorMessage
            name="carrera"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna campoObservaciones">
          <label htmlFor="observaciones">Observaciones</label>
          <Field
            as="textarea"
            id="observaciones"
            name="observaciones"
            maxLength={MAX_LENGTH_OBS}
            placeholder=""
            className={
              errors.observaciones && touched.observaciones
                ? "formikFieldError"
                : "formikField"
            }
          />
          <div className="contador-caracteres">
            {(values.observaciones || "").length} / {MAX_LENGTH_OBS}
          </div>
          <ErrorMessage
            name="observaciones"
            component="div"
            className="formikFieldErrorText"
          />
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
