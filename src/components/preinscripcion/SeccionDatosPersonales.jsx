import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";

const SeccionDatosPersonales = () => {
  const formik = useFormikContext();

  return (
    <fieldset className="seccionDatosPersonales">
      <legend>Datos Personales</legend>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="numeroDocumento">DNI *</label>
          <Field
            id="numeroDocumento"
            name="numeroDocumento"
            placeholder="Ingresá tu DNI sin puntos ni espacios"
            className={
              formik.errors.numeroDocumento && formik.touched.numeroDocumento
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="numeroDocumento"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="nombre">Nombre/s *</label>
          <Field
            id="nombre"
            name="nombre"
            className={
              formik.errors.nombre && formik.touched.nombre
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="nombre"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
        <div className="campoColumna">
          <label htmlFor="apellido">Apellido/s *</label>
          <Field
            id="apellido"
            name="apellido"
            className={
              formik.errors.apellido && formik.touched.apellido
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="apellido"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <label>Sexo *</label>
          <div role="group">
            <label>
              <Field type="radio" name="sexo" value="M" /> Masculino
            </label>
            <label>
              <Field type="radio" name="sexo" value="F" /> Femenino
            </label>
            <label>
              <Field type="radio" name="sexo" value="X" /> No binario (X)
            </label>
          </div>
          <ErrorMessage
            name="sexo"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="fechaNacimiento">Fecha de nacimiento *</label>
          <Field
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            className={
              formik.errors.fechaNacimiento && formik.touched.fechaNacimiento
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="fechaNacimiento"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="email">Dirección de email *</label>
          <Field
            id="email"
            name="email"
            type="email"
            className={
              formik.errors.email && formik.touched.email
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="email"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="confirmarEmail">
            Confirmá tu dirección de email *
          </label>
          <Field
            id="confirmarEmail"
            name="confirmarEmail"
            type="email"
            className={
              formik.errors.confirmarEmail && formik.touched.confirmarEmail
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="confirmarEmail"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>

      <div className="campoFila">
        <div className="campoColumna">
          <label htmlFor="telefono">Número de teléfono celular *</label>
          <Field
            id="telefono"
            name="telefono"
            placeholder="Ingresá tu número sin espacios ni guiones"
            className={
              formik.errors.telefono && formik.touched.telefono
                ? "formikFieldError"
                : "formikField"
            }
          />
          <ErrorMessage
            name="telefono"
            component="div"
            className="formikFieldErrorText"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default SeccionDatosPersonales;
