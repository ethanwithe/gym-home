import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Users, UserPlus, Calendar, TrendingUp, Loader2, AlertCircle, RefreshCw, Trash2, Edit, Plus } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { rrhhService } from '../services/rrhhService';

// Modal (usa tu Dialog existente)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function RecursosHumanos() {
  const [personal, setPersonal] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [contratacionesRecientes, setContratacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Modal / formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [modo, setModo] = useState(''); // 'crear' | 'editar'
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const initialForm = {
    nombre: '',
    puesto: '',
    departamento: '',
    email: '',
    telefono: '',
    fechaIngreso: '',
    estado: 'Activo',
    direccion: '',
    documento: '',
    salario: '',
    fechaNacimiento: '',
    genero: ''
  };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [personalData, estadisticasData, recientesData] = await Promise.all([
        rrhhService.obtenerTodoElPersonal().catch(() => ({ data: [] })),
        rrhhService.obtenerEstadisticas().catch(() => ({ data: {} })),
        rrhhService.obtenerContratacionesRecientes(3).catch(() => ({ data: [] }))
      ]);

      setPersonal(personalData.data || []);
      setEstadisticas(estadisticasData.data || {});
      setContratacionesRecientes(recientesData.data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const refrescarDatos = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const cambiarEstadoPersonal = async (id, nuevoEstado) => {
    try {
      await rrhhService.cambiarEstado(id, nuevoEstado);
      await cargarDatos();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado del personal');
    }
  };

  // -----------------------
  // CRUD: abrir modales
  // -----------------------
  const abrirCrear = () => {
    setModo('crear');
    setEmpleadoSeleccionado(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const abrirEditar = (empleado) => {
    setModo('editar');
    setEmpleadoSeleccionado(empleado);
    // transformar LocalDate a yyyy-mm-dd para input[type=date]
    const fechaIngreso = empleado.fechaIngreso ? (empleado.fechaIngreso.includes('T') ? empleado.fechaIngreso.split('T')[0] : empleado.fechaIngreso) : '';
    const fechaNacimiento = empleado.fechaNacimiento ? (empleado.fechaNacimiento.includes('T') ? empleado.fechaNacimiento.split('T')[0] : empleado.fechaNacimiento) : '';

    setForm({
      nombre: empleado.nombre || '',
      puesto: empleado.puesto || '',
      departamento: empleado.departamento || '',
      email: empleado.email || '',
      telefono: empleado.telefono || '',
      fechaIngreso: fechaIngreso,
      estado: empleado.estado || 'Activo',
      direccion: empleado.direccion || '',
      documento: empleado.documento || '',
      salario: empleado.salario != null ? String(empleado.salario) : '',
      fechaNacimiento: fechaNacimiento,
      genero: empleado.genero || ''
    });
    setModalOpen(true);
  };

  // -----------------------
  // CRUD: acciones
  // -----------------------
  const crearPersonal = async () => {
    // validación mínima
    if (!form.nombre || !form.puesto || !form.departamento || !form.email || !form.fechaIngreso) {
      alert('Por favor complete los campos obligatorios: nombre, puesto, departamento, email y fecha de ingreso.');
      return;
    }

    // preparar payload (convertir tipos)
    const payload = {
      nombre: form.nombre,
      puesto: form.puesto,
      departamento: form.departamento,
      email: form.email,
      telefono: form.telefono || null,
      fechaIngreso: form.fechaIngreso || null,
      estado: form.estado || 'Activo',
      direccion: form.direccion || null,
      documento: form.documento || null,
      salario: form.salario !== '' ? Number(form.salario) : null,
      fechaNacimiento: form.fechaNacimiento || null,
      genero: form.genero || null
    };

    try {
      await rrhhService.crearPersonal(payload);
      setModalOpen(false);
      await cargarDatos();
    } catch (err) {
      console.error('Error creando personal:', err);
      const msg = err?.response?.data || 'Error creando personal';
      alert(typeof msg === 'string' ? msg : 'Error creando personal. Ver consola para más detalles.');
    }
  };

  const actualizarPersonal = async () => {
    if (!empleadoSeleccionado?.id) {
      alert('Empleado no seleccionado.');
      return;
    }

    const payload = {
      nombre: form.nombre,
      puesto: form.puesto,
      departamento: form.departamento,
      email: form.email,
      telefono: form.telefono || null,
      fechaIngreso: form.fechaIngreso || null,
      estado: form.estado || 'Activo',
      direccion: form.direccion || null,
      documento: form.documento || null,
      salario: form.salario !== '' ? Number(form.salario) : null,
      fechaNacimiento: form.fechaNacimiento || null,
      genero: form.genero || null
    };

    try {
      await rrhhService.actualizarPersonal(empleadoSeleccionado.id, payload);
      setModalOpen(false);
      await cargarDatos();
    } catch (err) {
      console.error('Error actualizando personal:', err);
      alert('Error actualizando personal');
    }
  };

  const eliminarPersonal = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar a este empleado?')) return;
    try {
      await rrhhService.eliminarPersonal(id);
      await cargarDatos();
    } catch (err) {
      console.error('Error eliminando personal:', err);
      alert('Error eliminando personal');
    }
  };

  // -----------------------
  // Helpers gráficos
  // -----------------------
  const prepararDatosGraficosDepartamento = () => {
    if (!estadisticas || !estadisticas.porDepartamento) return [];
    return Object.entries(estadisticas.porDepartamento).map(([nombre, cantidad]) => ({ nombre, cantidad }));
  };

  const prepararDatosGraficosEstado = () => {
    if (!estadisticas || !estadisticas.porEstado) return [];
    return Object.entries(estadisticas.porEstado).map(([nombre, cantidad]) => ({ nombre, cantidad }));
  };

  // -----------------------
  // Render
  // -----------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos de RRHH...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Error al cargar datos</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <Button onClick={cargarDatos} className="mt-4">
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón de refrescar y nuevo */}
      <div className="flex justify-between items-center">
        <div />
        <div className="flex items-center gap-2">
          <Button onClick={refrescarDatos} variant="outline" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refrescar
          </Button>
          <Button onClick={abrirCrear} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Personal
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Personal</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.totalPersonal || 0}</div>
            <p className="text-xs mt-1 opacity-90">+{estadisticas?.nuevasContrataciones || 0} nuevos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Personal Activo</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.personalActivo || 0}</div>
            <p className="text-xs mt-1 opacity-90">
              {estadisticas?.totalPersonal > 0 ? Math.round((estadisticas.personalActivo / estadisticas.totalPersonal) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">En Vacaciones</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.personalVacaciones || 0}</div>
            <p className="text-xs mt-1 opacity-90">Este mes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Salario Promedio</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">S/ {estadisticas?.salarioPromedio ? Math.round(estadisticas.salarioPromedio) : 0}</div>
            <p className="text-xs mt-1 opacity-90">Mensual</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" /> Distribución por Departamento</CardTitle><CardDescription>Personal por área</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepararDatosGraficosDepartamento()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8b5cf6" name="Personal" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Estado del Personal</CardTitle><CardDescription>Distribución por estado</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepararDatosGraficosEstado()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#3b82f6" name="Personal" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Directorio de Personal</CardTitle>
          <CardDescription>Información completa del equipo de trabajo</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Ingreso</TableHead>
                <TableHead className="text-right">Salario (S/)</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {personal.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">No hay personal registrado</TableCell>
                </TableRow>
              ) : (
                personal.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell className="font-medium">{empleado.nombre}</TableCell>
                    <TableCell>{empleado.puesto}</TableCell>
                    <TableCell>{empleado.departamento}</TableCell>
                    <TableCell>{empleado.fechaIngreso ? new Date(empleado.fechaIngreso).toLocaleDateString('es-PE') : 'N/A'}</TableCell>
                    <TableCell className="text-right">{empleado.salario != null ? Number(empleado.salario).toFixed(2) : '—'}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={empleado.estado === 'Activo' ? 'default' : empleado.estado === 'Vacaciones' ? 'secondary' : 'destructive'}>
                        {empleado.estado}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" onClick={() => abrirEditar(empleado)}><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => eliminarPersonal(empleado.id)}><Trash2 className="w-4 h-4" /></Button>
                        <select
                          className="text-xs border rounded px-2 py-1"
                          value={empleado.estado}
                          onChange={(e) => cambiarEstadoPersonal(empleado.id, e.target.value)}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Vacaciones">Vacaciones</option>
                          <option value="Licencia">Licencia</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Nuevas contrataciones y resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-green-600" /> Nuevas Contrataciones</CardTitle>
            <CardDescription>Últimos 3 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contratacionesRecientes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hay contrataciones recientes</p>
              ) : (
                contratacionesRecientes.map(emp => (
                  <div key={emp.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-gray-800">{emp.nombre}</p>
                      <p className="text-sm text-gray-600">{emp.puesto} - {emp.departamento}</p>
                      <p className="text-xs text-gray-500">Ingreso: {emp.fechaIngreso ? new Date(emp.fechaIngreso).toLocaleDateString('es-PE') : 'N/A'}</p>
                    </div>
                    <Badge className="bg-green-600">Nuevo</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-600" /> Resumen por Departamento</CardTitle>
            <CardDescription>Distribución actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estadisticas?.porDepartamento ? Object.entries(estadisticas.porDepartamento).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold">{dept}</span>
                  <span className="text-2xl font-bold text-blue-600">{count}</span>
                </div>
              )) : <p className="text-center text-gray-500 py-4">No hay datos</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODAL CREAR / EDITAR */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modo === 'crear' ? 'Crear Personal' : 'Editar Personal'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <Input placeholder="Nombre *" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input placeholder="Puesto *" value={form.puesto} onChange={(e) => setForm({ ...form, puesto: e.target.value })} />
            <Input placeholder="Departamento *" value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} />
            <Input placeholder="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            <Input type="date" placeholder="Fecha Ingreso *" value={form.fechaIngreso} onChange={(e) => setForm({ ...form, fechaIngreso: e.target.value })} />
            <Input placeholder="Dirección" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
            <Input placeholder="Documento" value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} />
            <Input type="number" placeholder="Salario" value={form.salario} onChange={(e) => setForm({ ...form, salario: e.target.value })} />
            <Input type="date" placeholder="Fecha Nacimiento" value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
            <select className="border px-3 py-2 rounded" value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })}>
              <option value="">Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
            <select className="border px-3 py-2 rounded" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
              <option value="Activo">Activo</option>
              <option value="Vacaciones">Vacaciones</option>
              <option value="Licencia">Licencia</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <DialogFooter>
            <div className="flex gap-2 justify-end w-full">
              <Button variant="destructive" onClick={() => { setModalOpen(false); setEmpleadoSeleccionado(null); }}>Cancelar</Button>
              {modo === 'crear' ? (
                <Button onClick={crearPersonal}>Crear</Button>
              ) : (
                <Button onClick={actualizarPersonal}>Guardar</Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
