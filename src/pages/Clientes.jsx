import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import {
  Users, UserPlus, TrendingUp, Award, Loader2, AlertCircle,
  RefreshCw, Search, Trash2, Edit, Plus
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { clienteService } from '../services/clienteService';

// Modal
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function Clientes() {

  // Estados
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [crecimiento, setCrecimiento] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMembresia, setFiltroMembresia] = useState('Todas');

  const [modalOpen, setModalOpen] = useState(false);
  const [modo, setModo] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // FORMULARIO COMPLETO (con los campos faltantes agregados)
  const [form, setForm] = useState({
    nombre: '',
    documento: '',
    email: '',
    password: '',
    membresia: '',
    fechaInicio: '',
    fechaVencimiento: '',
    estado: 'Activa',
    visitas: 0
  });

  // Cargar datos
  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarClientes();
  }, [clientes, searchTerm, filtroMembresia]);


  // ------------------------------
  // CARGAR DATOS
  // ------------------------------
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [clientesData, estadisticasData, crecimientoData, topClientesData] = await Promise.all([
        clienteService.obtenerTodosLosClientes().catch(() => ({ data: [] })),
        clienteService.obtenerEstadisticas().catch(() => ({ data: {} })),
        clienteService.obtenerCrecimientoMensual().catch(() => ({ data: [] })),
        clienteService.obtenerTopClientes(5).catch(() => ({ data: [] })),
      ]);

      setClientes(clientesData.data || []);
      setClientesFiltrados(clientesData.data || []);
      setEstadisticas(estadisticasData.data || {});
      setCrecimiento(crecimientoData.data || []);
      setTopClientes(topClientesData.data || []);
    } catch (err) {
      setError('No se pudieron cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };


  // ------------------------------
  // FILTRAR CLIENTES
  // ------------------------------
  const filtrarClientes = () => {
    let resultado = [...clientes];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      resultado = resultado.filter(c =>
        (c.nombre || '').toLowerCase().includes(q) ||
        (c.membresia || '').toLowerCase().includes(q)
      );
    }

    if (filtroMembresia !== 'Todas') {
      resultado = resultado.filter(c => c.membresia === filtroMembresia);
    }

    setClientesFiltrados(resultado);
  };


  const membresias = ['Todas', ...Array.from(new Set(clientes.map(c => c.membresia).filter(Boolean)))];

  const distribucionMembresias = Array.isArray(estadisticas?.distribucionMembresias)
    ? estadisticas.distribucionMembresias
    : calcularDistribucionMembresias();

  function calcularDistribucionMembresias() {
    if (!clientes.length) return [];
    const cnt = {};
    clientes.forEach(c => {
      const t = c.membresia || 'Sin membresía';
      cnt[t] = (cnt[t] || 0) + 1;
    });
    return Object.entries(cnt).map(([tipo, cantidad]) => ({ tipo, cantidad }));
  }


  // ------------------------------
  // CRUD
  // ------------------------------

  const abrirCrear = () => {
    setModo('crear');
    setClienteSeleccionado(null);
    setForm({
      nombre: '',
      documento: '',
      email: '',
      password: '',
      membresia: '',
      fechaInicio: '',
      fechaVencimiento: '',
      estado: 'Activa',
      visitas: 0
    });
    setModalOpen(true);
  };

  const abrirEditar = (cliente) => {
    setModo('editar');
    setClienteSeleccionado(cliente);

    setForm({
      nombre: cliente.nombre,
      documento: cliente.documento,
      email: cliente.email,
      password: '',
      membresia: cliente.membresia,
      fechaInicio: cliente.fechaInicio?.split('T')[0],
      fechaVencimiento: cliente.fechaVencimiento?.split('T')[0],
      estado: cliente.estado,
      visitas: cliente.visitas,
    });

    setModalOpen(true);
  };

  const crearCliente = async () => {
    try {
      await clienteService.crearCliente(form);
      setModalOpen(false);
      cargarDatos();
    } catch (err) {
      alert('Error creando cliente');
    }
  };

  const actualizarCliente = async () => {
    try {
      await clienteService.actualizarCliente(clienteSeleccionado.id, form);
      setModalOpen(false);
      cargarDatos();
    } catch (err) {
      alert('Error actualizando cliente');
    }
  };

  const eliminarCliente = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este cliente?')) return;

    try {
      await clienteService.eliminarCliente(id);
      cargarDatos();
    } catch (err) {
      alert('Error eliminando cliente');
    }
  };

  const renovarMembresia = async (id) => {
    const meses = Number(prompt('¿Cuántos meses renovar?', '1'));
    if (!meses || meses <= 0) return alert('Mes inválido.');

    try {
      await clienteService.renovarMembresia(id, meses);
      cargarDatos();
    } catch (err) {
      alert('Error renovando');
    }
  };

  const registrarVisita = async (id) => {
    try {
      await clienteService.registrarVisita(id);
      cargarDatos();
    } catch (err) {
      alert('Error registrando visita');
    }
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setModo('');
    setClienteSeleccionado(null);
  };


  // ------------------------------
  // RENDER
  // ------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-300 bg-red-100">
        <CardContent className="pt-6">
          <div className="text-red-800 flex gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <Button onClick={cargarDatos} className="mt-4">Reintentar</Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="space-y-6">


      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-600 text-white">
          <CardHeader><CardTitle>Total Clientes</CardTitle></CardHeader>
          <CardContent>{estadisticas?.totalClientes || 0}</CardContent>
        </Card>

        <Card className="bg-green-600 text-white">
          <CardHeader><CardTitle>Membresías Activas</CardTitle></CardHeader>
          <CardContent>{estadisticas?.membresiasActivas || 0}</CardContent>
        </Card>

        <Card className="bg-purple-600 text-white">
          <CardHeader><CardTitle>Por vencer</CardTitle></CardHeader>
          <CardContent>{estadisticas?.membresiasPorVencer || 0}</CardContent>
        </Card>

        <Card className="bg-orange-600 text-white">
          <CardHeader><CardTitle>Retención</CardTitle></CardHeader>
          <CardContent>{estadisticas?.tasaRetencion || 0}%</CardContent>
        </Card>
      </div>


      {/* GRÁFICOS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Crecimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={crecimiento}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="nuevos" stroke="#10b981" strokeWidth={2} />
                <Line dataKey="bajas" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Distribución Membresías</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribucionMembresias}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={90} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>


      {/* FILTROS */}
      <Card>
        <CardHeader><CardTitle>Filtros de Búsqueda</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="border px-3 py-2 rounded-md"
              value={filtroMembresia}
              onChange={(e) => setFiltroMembresia(e.target.value)}
            >
              {membresias.map((m) => (<option key={m}>{m}</option>))}
            </select>
          </div>
        </CardContent>
      </Card>


      {/* TABLA PRINCIPAL */}
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="flex gap-2 items-center">
              <Users className="w-5 h-5 text-blue-600" /> Base de Clientes
            </CardTitle>
            <CardDescription>Membresías activas</CardDescription>
          </div>

          <Button onClick={abrirCrear} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Cliente
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Membresía</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Visitas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {clientesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No hay clientes</TableCell>
                </TableRow>
              ) : (
                clientesFiltrados.map(cliente => (
                  <TableRow key={cliente.id}>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.membresia}</TableCell>
                    <TableCell>{new Date(cliente.fechaInicio).toLocaleDateString('es-PE')}</TableCell>
                    <TableCell>{new Date(cliente.fechaVencimiento).toLocaleDateString('es-PE')}</TableCell>
                    <TableCell>{cliente.visitas}</TableCell>
                    <TableCell>
                      <Badge variant={cliente.estado === "Activa" ? "default" : "destructive"}>
                        {cliente.estado}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" onClick={() => abrirEditar(cliente)}><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => eliminarCliente(cliente.id)}><Trash2 className="w-4 h-4" /></Button>
                        <Button size="sm" onClick={() => renovarMembresia(cliente.id)}>Renovar</Button>
                        <Button size="sm" onClick={() => registrarVisita(cliente.id)}>Visita +</Button>
                      </div>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      {/* MODAL CREAR / EDITAR */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modo === 'crear' ? 'Crear Cliente' : 'Editar Cliente'}</DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-3 mt-2">

            <Input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />

            <Input
              placeholder="Documento"
              value={form.documento}
              onChange={(e) => setForm({ ...form, documento: e.target.value })}
            />

            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Input
              placeholder="Membresía"
              value={form.membresia}
              onChange={(e) => setForm({ ...form, membresia: e.target.value })}
            />

            <Input
              type="date"
              placeholder="Fecha Inicio"
              value={form.fechaInicio}
              onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            />

            <Input
              type="date"
              placeholder="Fecha Vencimiento"
              value={form.fechaVencimiento}
              onChange={(e) => setForm({ ...form, fechaVencimiento: e.target.value })}
            />

            <select
              className="border px-3 py-2 rounded"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              <option>Activa</option>
              <option>Inactiva</option>
            </select>

            <Input
              type="number"
              placeholder="Visitas"
              value={form.visitas}
              onChange={(e) => setForm({ ...form, visitas: Number(e.target.value) })}
            />
          </div>

          <DialogFooter>
            <Button variant="destructive" onClick={cerrarModal}>Cancelar</Button>
            {modo === 'crear' ? (
              <Button onClick={crearCliente}>Crear</Button>
            ) : (
              <Button onClick={actualizarCliente}>Guardar</Button>
            )}
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  );
}
