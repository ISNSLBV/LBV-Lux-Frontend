// src/pages/PreinscripcionPendiente.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios'

export default function PreinscripcionPendiente() {
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState({});   // datos del popup

  useEffect(() => {
    api.get('/api/admin/preinscripcion')
      .then(r => setPersonas(r.data))
      .catch(console.error);
  }, []);

  const aceptar = async (p) => {
    const username = prompt('Nuevo username');
    const password = prompt('Contraseña provisoria');
    const tipoAlumnoId = parseInt(prompt('Tipo de alumno (1-4)'), 10);
    const carreraId = parseInt(prompt('Carrera ID'), 10);

    try {
      await api.post(`/api/admin/preinscripcion/${p.id}/aceptar`, {
        username, password, tipoAlumnoId, carreraId
      });
      alert('Alumno creado');
      setPersonas((prev) => prev.filter(x => x.id !== p.id)); // lo sacamos de la lista
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  return (
    <>
      <h1>Panel de preinscriptos</h1>
      <table>
        <thead>
          <tr>
            <th>Apellido y nombre</th><th>DNI</th><th>Email</th><th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {personas.map(p => (
            <tr key={p.id}>
              <td>{p.apellido}, {p.nombre}</td>
              <td>{p.dni}</td>
              <td>{p.email}</td>
              <td><button onClick={() => aceptar(p)}>Aceptar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
