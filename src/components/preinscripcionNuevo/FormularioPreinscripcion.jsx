import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { schemaPreinscripcion } from '../preinscripcion/utils/schemaPreinscripcion'

const FormularioPreinscripcion = () => {
    const [pasoActual, setPasoActual] = useState(1);
    const pasosTotales = 4;
    const progeso = (pasoActual / pasosTotales) * 100;

    const carreras = [
        {
            id: 1,
            nombre: 'Técnico Analista de Sistemas'
        }, {
            id: 2,
            nombre: 'Técnico en Redes Informáticas'
        }
    ];

    const handleSiguiente = () => {
        if (pasoActual < pasosTotales) {
            setPasoActual(pasoActual + 1);
        }
    };

    const handleAnterior = () => {
        if (pasoActual > 1) {
            setPasoActual(pasoActual - 1);
        }
    };

    return (
        <div>FormularioPreinscripcion</div>
    )
}

export default FormularioPreinscripcion