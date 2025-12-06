import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Users, UserPlus, Calendar, TrendingUp, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { rrhhService } from '../services/rrhhService';

export default function RecursosHumanos() {
  const [personal, setPersonal] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [contratacionesRecientes, setContratacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [personalData, estadisticasData, recientesData] = await Promise.all([
        rrhhService.obtenerTodoElPersonal(),
        rrhhService.obtenerEstadisticas(),
        rrhhService.obtenerContratacionesRecientes(3)
      ]);

      setPersonal(personalData.data || []);
      setEstadisticas(estadisticasData.data || []);
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
      await cargarDatos(); // Recargar datos
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado del personal');
    }
  };

  // Preparar datos para gráficos
  const prepararDatosGraficosDepartamento = () => {
    if (!estadisticas || !estadisticas.porDepartamento) return [];
    return Object.entries(estadisticas.porDepartamento).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));
  };

  const prepararDatosGraficosEstado = () => {
    if (!estadisticas || !estadisticas.porEstado) return [];
    return Object.entries(estadisticas.porEstado).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    }));
  };

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
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón de refrescar */}
      <div className="flex justify-end">
        <Button 
          onClick={refrescarDatos} 
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.totalPersonal || 0}</div>
            <p className="text-xs mt-1 opacity-90">
              +{estadisticas?.nuevasContrataciones || 0} nuevos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Personal Activo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.personalActivo || 0}</div>
            <p className="text-xs mt-1 opacity-90">
              {estadisticas?.totalPersonal > 0 
                ? Math.round((estadisticas.personalActivo / estadisticas.totalPersonal) * 100)
                : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Vacaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.personalVacaciones || 0}</div>
            <p className="text-xs mt-1 opacity-90">Este mes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Salario Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              S/ {estadisticas?.salarioPromedio?.toFixed(0) || 0}
            </div>
            <p className="text-xs mt-1 opacity-90">Mensual</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Distribución por Departamento
            </CardTitle>
            <CardDescription>Personal por área</CardDescription>
          </CardHeader>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Estado del Personal
            </CardTitle>
            <CardDescription>Distribución por estado</CardDescription>
          </CardHeader>
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
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Directorio de Personal
          </CardTitle>
          <CardDescription>Información completa del equipo de trabajo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Antigüedad</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personal.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No hay personal registrado
                  </TableCell>
                </TableRow>
              ) : (
                personal.map((empleado) => (
                  <TableRow key={empleado.id}>
                    <TableCell className="font-medium">{empleado.nombre}</TableCell>
                    <TableCell>{empleado.puesto}</TableCell>
                    <TableCell>{empleado.departamento}</TableCell>
                    <TableCell>
                      {empleado.antiguedad !== null 
                        ? `${empleado.antiguedad} ${empleado.antiguedad === 1 ? 'año' : 'años'}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={
                          empleado.estado === 'Activo' ? 'default' : 
                          empleado.estado === 'Vacaciones' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {empleado.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sección de nuevas contrataciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              Nuevas Contrataciones
            </CardTitle>
            <CardDescription>Últimos 3 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contratacionesRecientes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No hay contrataciones recientes
                </p>
              ) : (
                contratacionesRecientes.map((empleado) => (
                  <div key={empleado.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-gray-800">{empleado.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {empleado.puesto} - {empleado.departamento}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ingreso: {new Date(empleado.fechaIngreso).toLocaleDateString('es-PE')}
                      </p>
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
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Resumen por Departamento
            </CardTitle>
            <CardDescription>Distribución actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estadisticas?.porDepartamento && Object.entries(estadisticas.porDepartamento).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold">{dept}</span>
                  <span className="text-2xl font-bold text-blue-600">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}