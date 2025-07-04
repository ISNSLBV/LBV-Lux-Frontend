import React from 'react'
import DatoCard from '../../../../components/Dato/DatoCard'
import styles from './GestionMateriasGenericas.module.css'
import SearchBar from '../../../../components/SearchBar/SearchBar'
import { Plus, BookOpen, Check, X, TriangleAlert, SquarePen, Trash2 } from 'lucide-react'
import Boton from '../../../../components/Boton/Boton'
import { useEffect, useState } from 'react'
import api from '../../../../api/axios'
import { toast } from 'react-toastify'

const GestionMateriasGenericas = () => {
    const [datos, setDatos] = useState([
      {
        titulo: 'Materias Genericas',
        icono: <BookOpen />,
        dato: '0',
        descripcion: 'Total de materias genericas registradas'
      },
      {
        titulo: 'Materias Activas',
        icono: <Check />,
        dato: '0',
        descripcion: 'Materias genericas activas actualmente'
      },
      {
        titulo: 'Materias Inactivas',
        icono: <TriangleAlert />,
        dato: '0',
        descripcion: 'Materias genericas inactivas actualmente'
      }
    ])

    const [modalOpen, setModalOpen] = useState(false)
    const [nuevoNombre, setNuevoNombre] = useState('')
    const [materias, setMaterias] = useState([])
    const [filtro, setFiltro] = useState('')

    useEffect(() => {
      cargarMaterias()
    }, [])

    const cargarMaterias = async () => {
      try {
        const { data } = await api.get('/api/admin/materia/listar-materias');
        setMaterias(data);
        const total = data.length;
        const activas = data.filter(m => m.activa).length;
        const inactivas = total - activas;

        setDatos([
          {
            titulo: 'Materias Genericas',
            icono: <BookOpen />,
            dato: total.toString(),
            descripcion: 'Total de materias genericas registradas'
          },
          {
            titulo: 'Materias Activas',
            icono: <Check />,
            dato: activas.toString(),
            descripcion: 'Materias genericas activas actualmente'
          },
          {
            titulo: 'Materias Inactivas',
            icono: <TriangleAlert />,
            dato: inactivas.toString(),
            descripcion: 'Materias genericas inactivas actualmente'
          }
        ])
      } catch (err) {
        console.error('Error al cargar materias:', err)
      }
    }

    const registrarMateriaGenerica = async (nombre) => {
      try {
        await api.post('/api/admin/materia/registrar-materia', { nombre });
        await cargarMaterias();
        toast.success('Materia registrada correctamente');
      } catch (error) {
        toast.error('Error al registrar la materia', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!nuevoNombre.trim()) return
      await registrarMateriaGenerica(nuevoNombre.trim())
      setNuevoNombre('')
      setModalOpen(false)
    }

    const materiasFiltradas = materias.filter(m =>
      m.nombre.toLowerCase().includes(filtro.toLowerCase())
    )

  return (
    <div className={styles.container}>
        <div className={styles.titulo}>
            <h1>Materias base</h1>
            <p>Gestioná las materias base dictadas en el instituto</p>
        </div>
        <div className={styles.datos}>
            {datos.map((dato, index) => (
                <DatoCard 
                    key={index}
                    titulo={dato.titulo}
                    icono={dato.icono}
                    dato={dato.dato}
                    descripcion={dato.descripcion}
                />
            ))}
        </div>
        <div className={styles.barraAcciones}>
            <div className={styles.barraBusqueda}>
                <SearchBar 
                    placeholder="Buscar materia generica" 
                    value={filtro} 
                    onChange={e => setFiltro(e.target.value)}
                />
            </div>
            <div className={styles.botonAgregar}>
                <Boton 
                    variant='success' 
                    icono={<Plus />} 
                    onClick={() => setModalOpen(true)}
                >
                    Agregar Materia
                </Boton>
            </div>
        </div>
        <div className={styles.listaMaterias}>
            <h2>Catálogo de materias base</h2>
            <table className={styles.tabla}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Plan(es) de estudio</th>
                        <th>Carrera(s)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {materiasFiltradas.map(m => (
                    <tr key={m.id} className={styles.tablaFila}>
                        <td>{m.id}</td>
                        <td>{m.nombre}</td>
                        <td>{m.activa ? 'Activa' : 'Inactiva'}</td>
                        <td>{m.plan_estudio.map(p => p.nombre).join(', ')}</td>
                        <td>{m.carrera.map(c => c.nombre).join(', ')}</td>
                        <td>
                          <Boton
                            variant='onlyIcon'
                            icono={<SquarePen />}
                          />
                          <Boton
                            variant='onlyIcon'
                            icono={<Trash2 />}
                          />
                          {/* <button className="btn btn-primary">Editar</button>
                          <button className="btn btn-danger">Eliminar</button> */}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.cards}>
              {materiasFiltradas.map(m => (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderContent}>
                      <div className={styles.cardHeaderTitle}>
                        <h3>{m.nombre}</h3>
                        <p>ID: {m.id}</p>
                      </div>
                      <div className={styles.cardHeaderStatus}>
                        {m.activa ? 
                          (<>
                            <Check /> En uso
                          </>)
                            : 
                          (<> 
                            <TriangleAlert /> Sin asignar
                          </>)
                        }
                      </div>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div>
                      <div>
                        <h4>Plan(es) de estudio</h4>
                        <p>{m.plan_estudio.map(p => p.nombre).join(', ')}</p>
                      </div>
                    </div>
                    <div>
                      <h4>Carreras</h4>
                      <div>
                        {m.carrera.map(c => (
                          <div>
                            {c.nombre}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <Boton
                        fullWidth
                        icono={<SquarePen />}
                        variant='primary'
                      >
                        Editar
                      </Boton>
                      <Boton 
                        variant='cancel'
                        icono={<Trash2 />}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
              {/* Modal de creación */}
      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Registrar nueva materia</h3>
              <button
                className={styles.closeButton}
                onClick={() => setModalOpen(false)}
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nombre" className="block mb-1">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  value={nuevoNombre}
                  onChange={e => setNuevoNombre(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <Boton type="submit" variant="success">
                  Crear
                </Boton>
                <Boton type="button" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Boton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionMateriasGenericas

{/* Vista Desktop - Tabla 
            <div className="hidden lg:block">
              <div className="rounded-md border border-white/20 overflow-hidden">
                <Table>
                  <TableBody>
                    {materiasFiltradas.map((mc) => (
                      <TableRow key={mc.id} className="border-white/20 hover:bg-white/5">
                        <TableCell className="font-medium text-white">{mc.materia_plan.materia.nombre}</TableCell>
                        <TableCell className="text-blue-200">{mc.materia_plan.plan_estudio.carrera.nombre}</TableCell>
                        <TableCell className="text-blue-200">{mc.materia_plan.anio_carrera}° Año</TableCell>
                        <TableCell>
                          <Badge className={tiposAprobacion[mc.tipo_aprobacion].color}>{mc.tipo_aprobacion}</Badge>
                        </TableCell>
                        <TableCell className="text-blue-200">
                          {mc.profesores.length > 0 ? (
                            <div className="space-y-1">
                              {mc.profesores.map((prof) => (
                                <div key={prof.id} className="text-xs">
                                  {prof.nombre} {prof.apellido}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-yellow-400">Sin asignar</span>
                          )}
                        </TableCell>
                        <TableCell className="text-blue-200">
                          {mc.horarios.length > 0 ? (
                            <div className="space-y-1">
                              {mc.horarios.map((horario) => (
                                <div key={horario.id} className="text-xs">
                                  {diasSemana[horario.dia_semana]} {horario.bloque}
                                  {horario.aula && ` - ${horario.aula}`}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-yellow-400">Sin definir</span>
                          )}
                        </TableCell>
                        <TableCell className="text-blue-200">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {mc.inscriptos}
                          </div>
                        </TableCell>
                        <TableCell className="text-blue-200">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {mc.clases_dictadas}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => abrirDialogoEdicion(mc)}
                              className="text-blue-200 hover:text-white hover:bg-white/10"
                              disabled={cargando}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                                  disabled={cargando}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Desactivar materia del ciclo?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción desactivará "{mc.materia_plan.materia.nombre}" del ciclo lectivo{" "}
                                    {CICLO_LECTIVO_ACTUAL}. Los datos de inscripciones y clases se mantendrán pero la
                                    materia no estará disponible para nuevas operaciones.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => desactivarMateria(mc)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Desactivar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Vista Mobile/Tablet - Cards 
            <div className="lg:hidden space-y-4">
              {materiasFiltradas.map((mc) => (
                <Card key={mc.id} className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">{mc.materia_plan.materia.nombre}</CardTitle>
                        <CardDescription className="text-blue-200">
                          {mc.materia_plan.plan_estudio.carrera.nombre} • {mc.materia_plan.anio_carrera}° Año
                        </CardDescription>
                      </div>
                      <Badge className={tiposAprobacion[mc.tipo_aprobacion].color}>{mc.tipo_aprobacion}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Estadísticas rápidas 
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{mc.inscriptos} inscriptos</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-200">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{mc.clases_dictadas} clases</span>
                      </div>
                    </div>

                    {/* Profesores 
                    <div>
                      <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Profesores
                      </h4>
                      {mc.profesores.length > 0 ? (
                        <div className="space-y-1">
                          {mc.profesores.map((prof) => (
                            <Badge key={prof.id} variant="outline" className="text-blue-200 border-blue-200 mr-2">
                              {prof.nombre} {prof.apellido}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-yellow-400 text-sm">Sin profesores asignados</span>
                      )}
                    </div>

                    {/* Horarios 
                    <div>
                      <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Horarios
                      </h4>
                      {mc.horarios.length > 0 ? (
                        <div className="space-y-1">
                          {mc.horarios.map((horario) => (
                            <div key={horario.id} className="text-blue-200 text-sm">
                              {diasSemana[horario.dia_semana]} - {horario.bloque}
                              {horario.aula && ` (${horario.aula})`}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-yellow-400 text-sm">Sin horarios definidos</span>
                      )}
                    </div>

                    {/* Fechas del ciclo 
                    {(mc.fecha_inicio || mc.fecha_cierre) && (
                      <div>
                        <h4 className="text-white text-sm font-medium mb-2">Período</h4>
                        <div className="text-blue-200 text-sm">
                          {mc.fecha_inicio && `Inicio: ${new Date(mc.fecha_inicio).toLocaleDateString()}`}
                          {mc.fecha_inicio && mc.fecha_cierre && " • "}
                          {mc.fecha_cierre && `Cierre: ${new Date(mc.fecha_cierre).toLocaleDateString()}`}
                        </div>
                      </div>
                    )}

                    {/* Acciones 
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirDialogoEdicion(mc)}
                        className="flex-1 text-blue-200 border-blue-200 hover:bg-blue-200 hover:text-blue-900"
                        disabled={cargando}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-300 border-red-300 hover:bg-red-300 hover:text-red-900"
                            disabled={cargando}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Desactivar materia del ciclo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción desactivará "{mc.materia_plan.materia.nombre}" del ciclo lectivo{" "}
                              {CICLO_LECTIVO_ACTUAL}. Los datos de inscripciones y clases se mantendrán pero la materia
                              no estará disponible para nuevas operaciones.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => desactivarMateria(mc)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Desactivar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>*/}