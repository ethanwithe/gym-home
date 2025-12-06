import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Users, UserPlus, TrendingUp, Award, Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { clienteService } from '../services/clienteService';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [crecimiento, setCrecimiento] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMembresia, setFiltroMembresia] = useState('Todas');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarClientes();
  }, [searchTerm, filtroMembresia, clientes]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [clientesData, estadisticasData, crecimientoData, topClientesData] = await Promise.all([
        clienteService.obtenerTodosLosClientes(),
        clienteService.obtenerEstadisticas(),
        clienteService.obtenerCrecimientoMensual(),
        clienteService.obtenerTopClientes(5)
      ]);

      setClientes(clientesData.data || []);
      setClientesFiltrados(clientesData.data || []);
      setEstadisticas(estadisticasData.data || {});
      setCrecimiento(Array.isArray(crecimientoData.data) ? crecimientoData.data : []);
      setTopClientes(Array.isArray(topClientesData.data) ? topClientesData.data : []);
      
      // Debug: Ver qué datos llegan
      console.log('Estadísticas completas:', estadisticasData.data);
      console.log('Distribución de membresías:', estadisticasData.data?.distribucionMembresias);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar los clientes. Verifique la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarClientes = () => {
    let resultado = [...clientes];

    if (searchTerm) {
      resultado = resultado.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.membresia.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtroMembresia !== 'Todas') {
      resultado = resultado.filter(c => c.membresia === filtroMembresia);
    }

    setClientesFiltrados(resultado);
  };

  const membresias = ['Todas', ...new Set(clientes.map(c => c.membresia))];

  // Obtener datos de distribución de membresías de forma segura
  const distribucionMembresias = Array.isArray(estadisticas?.distribucionMembresias) 
    ? estadisticas.distribucionMembresias 
    : calcularDistribucionMembresias();

  // Función para calcular distribución si el backend no la provee
  function calcularDistribucionMembresias() {
    if (clientes.length === 0) return [];
    
    const conteo = {};
    clientes.forEach(cliente => {
      const membresia = cliente.membresia || 'Sin membresía';
      conteo[membresia] = (conteo[membresia] || 0) + 1;
    });
    
    return Object.entries(conteo).map(([tipo, cantidad]) => ({
      tipo,
      cantidad
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <Button onClick={cargarDatos} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.totalClientes || 0}</div>
            <p className="text-xs mt-1 opacity-90">
              +{estadisticas?.nuevosClientes || 0} este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Membresías Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.membresiasActivas || 0}</div>
            <p className="text-xs mt-1 opacity-90">
              {estadisticas?.totalClientes > 0 
                ? Math.round((estadisticas.membresiasActivas / estadisticas.totalClientes) * 100)
                : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.membresiasPorVencer || 0}</div>
            <p className="text-xs mt-1 opacity-90">Próximos 30 días</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Retención</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.tasaRetencion || 0}%</div>
            <p className="text-xs mt-1 opacity-90">Últimos 6 meses</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Crecimiento de Clientes
            </CardTitle>
            <CardDescription>Nuevos clientes vs. bajas mensuales</CardDescription>
          </CardHeader>
          <CardContent>
            {crecimiento.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={crecimiento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="nuevos" stroke="#10b981" strokeWidth={2} name="Nuevos" />
                  <Line type="monotone" dataKey="bajas" stroke="#ef4444" strokeWidth={2} name="Bajas" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay datos de crecimiento disponibles
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Distribución de Membresías
            </CardTitle>
            <CardDescription>Por tipo de plan</CardDescription>
          </CardHeader>
          <CardContent>
            {distribucionMembresias.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distribucionMembresias}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#8b5cf6" name="Clientes" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay datos de distribución disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filtroMembresia}
              onChange={(e) => setFiltroMembresia(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              {membresias.map(memb => (
                <option key={memb} value={memb}>{memb}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Base de Clientes
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({clientesFiltrados.length} clientes)
            </span>
          </CardTitle>
          <CardDescription>Información de membresías activas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Membresía</TableHead>
                <TableHead className="text-center">Inicio</TableHead>
                <TableHead className="text-center">Vencimiento</TableHead>
                <TableHead className="text-center">Visitas</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell>{cliente.membresia}</TableCell>
                    <TableCell className="text-center">
                      {new Date(cliente.fechaInicio).toLocaleDateString('es-PE')}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(cliente.fechaVencimiento).toLocaleDateString('es-PE')}
                    </TableCell>
                    <TableCell className="text-center">{cliente.visitas || 0}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={cliente.estado === 'Activa' ? 'default' : 'destructive'}>
                        {cliente.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Clientes y Nuevos Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Clientes VIP
            </CardTitle>
            <CardDescription>Mayor asistencia del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topClientes.length > 0 ? (
                topClientes.map((cliente, index) => (
                  <div key={cliente.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{cliente.nombre}</p>
                        <p className="text-sm text-gray-600">{cliente.membresia}</p>
                      </div>
                    </div>
                    <span className="font-bold text-yellow-600">{cliente.visitas} visitas</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No hay datos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              Nuevos Clientes
            </CardTitle>
            <CardDescription>Registros recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientes
                .filter(c => {
                  const fechaInicio = new Date(c.fechaInicio);
                  const haceUnMes = new Date();
                  haceUnMes.setMonth(haceUnMes.getMonth() - 1);
                  return fechaInicio >= haceUnMes;
                })
                .slice(0, 5)
                .map((cliente) => (
                  <div key={cliente.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-gray-800">{cliente.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Inicio: {new Date(cliente.fechaInicio).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <Badge className="bg-green-600">Nuevo</Badge>
                  </div>
                ))}
              {clientes.filter(c => {
                const fechaInicio = new Date(c.fechaInicio);
                const haceUnMes = new Date();
                haceUnMes.setMonth(haceUnMes.getMonth() - 1);
                return fechaInicio >= haceUnMes;
              }).length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay clientes nuevos este mes
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}