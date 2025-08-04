import React from "react";
import InputField from "../FormCampos/InputField";

const SeccionDatosDomicilio = ({ formik }) => {
  return (
    <fieldset className="seccionDatosDomicilio">
      <legend>Datos de Domicilio</legend>

      <div className="campoFila">
        <div className="campoColumna">
          <InputField
            label="Calle *"
            name="calle"
            placeholder=""
            formik={formik}
          />
        </div>
        <div className="campoColumna">
          <InputField
            label="Altura *"
            name="altura"
            placeholder="Ej: 1111, Km. 11, S/N"
            formik={formik}
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <InputField
            label="Localidad *"
            name="localidad"
            placeholder="Ej: Loma Hermosa"
            formik={formik}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default SeccionDatosDomicilio;
