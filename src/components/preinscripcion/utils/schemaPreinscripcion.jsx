import * as Yup from "yup";

export const schemaPreinscripcion = Yup.object().shape({
  numeroDocumento: Yup.string()
    .matches(/^[0-9]{7,10}$/, "Debe ser un número válido")
    .required("Este campo es obligatorio"),
  nombre: Yup.string()
    .min(2, "Mínimo 2 caracteres")
    .required("Este campo es obligatorio"),
  apellido: Yup.string()
    .min(2, "Mínimo 2 caracteres")
    .required("Este campo es obligatorio"),
  sexo: Yup.string()
    .oneOf(["M", "F", "X"], "Seleccioná una opción")
    .required("Este campo es obligatorio"),
  fechaNacimiento: Yup.date()
    .max(new Date(), "La fecha debe ser anterior a hoy")
    .required("Este campo es obligatorio"),
  nacionalidad: Yup.string().required("Este campo es obligatorio"),
  email: Yup.string()
    .email("Formato de email inválido")
    .required("Este campo es obligatorio"),
  confirmarEmail: Yup.string()
    .oneOf([Yup.ref("email")], "Los emails no coinciden")
    .required("Confirmá tu dirección de email"),
  calle: Yup.string().required("Este campo es obligatorio"),
  altura: Yup.string().required("Este campo es obligatorio"),
  localidad: Yup.string().required("Este campo es obligatorio"),
  carrera: Yup.string().required("Este campo es obligatorio"),
  telefono: Yup.string()
    .matches(/^\d{7,11}$/, "Número de teléfono inválido")
    .required("Este campo es obligatorio"),
  observaciones: Yup.string().max(70, "Máximo 70 caracteres").nullable(),
});
