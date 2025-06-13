import * as Yup from 'yup';

export const validacionSchema = Yup.object().shape({
    username: Yup.string()
        .matches(/^[A-Za-z0-9_]{1,30}$/, 'Nombre de usuario incorrecto')
        .required('Debes ingresar tu nombre de usuario'),
    password: Yup.string()
        .matches(/^.{5,}$/, 'Contraseña incorrecta')
        .required('Debes ingresar tu contraseña')
})