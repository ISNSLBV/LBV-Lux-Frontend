import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";

const SeccionDatosDomicilio = () => {
  const formik = useFormikContext();

  return (
    <fieldset className="seccionDatosDomicilio">
      <legend>Datos de Domicilio</legend>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="calle">Calle *</label>
          <Field
            id="calle"
            name="calle"
            className={
              formik.errors.calle && formik.touched.calle
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="calle"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
        <div className="campoColumna">
          <label htmlFor="altura">Altura *</label>
          <Field
            id="altura"
            name="altura"
            placeholder="Ej: 1111, Km. 11, S/N"
            className={
              formik.errors.altura && formik.touched.altura
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="altura"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="localidad">Localidad *</label>
          <Field
            id="localidad"
            name="localidad"
            placeholder="Ej: Loma Hermosa"
            className={
              formik.errors.localidad && formik.touched.localidad
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="localidad"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default SeccionDatosDomicilio;
