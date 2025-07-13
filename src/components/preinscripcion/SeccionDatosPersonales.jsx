import React from 'react'
import InputField from '../FormCampos/InputField'
import RadioGroup from '../FormCampos/RadioGroup'
import DatePickerField from '../FormCampos/DatePickerField'

const SeccionDatosPersonales = ({ formik }) => {
  return (
    <fieldset className="seccionDatosPersonales">
      <legend>Datos Personales</legend>

      <div className="campoFila">
        <div className="campoColumna">
          <InputField
            label="Número de documento *"
            name="numeroDocumento"
            placeholder="Ingresá tu DNI sin puntos ni espacios"
            formik={formik}
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <InputField
            label="Nombre/s *"
            name="nombre"
            placeholder=""
            formik={formik}
          />
        </div>
        <div className="campoColumna">
          <InputField
            label="Apellido/s *"
            name="apellido"
            placeholder=""
            formik={formik}
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <RadioGroup
            label="Sexo"
            name="sexo"
            options={[
              { value: 'M', label: 'Masculino' },
              { value: 'F', label: 'Femenino' },
              { value: 'X', label: 'No binario' },
            ]}
            formik={formik}
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <DatePickerField
            label="Fecha de nacimiento *"
            name="fechaNacimiento"
            formik={formik}
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
            <InputField 
              label="Dirección de email *"
              name="email"
              formik={formik}
            />
        </div>
      </div>
      <div className="campoFila">
        <div className="campoColumna">
            <InputField 
              label="Confirmá tu dirección de email *"
              name="confirmarEmail"
              formik={formik}
            />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <InputField 
            label="Número de teléfono celular *"
            name="telefono"
            placeholder='Ingresá tu número sin espacios ni guiones'
            formik={formik}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default SeccionDatosPersonales;