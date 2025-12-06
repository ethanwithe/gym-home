import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import { UserCircle, Mail, Phone, Calendar, MapPin, Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input.jsx';
import { rrhhService } from '../services/rrhhService';

export default function Personal() {
  const [personal, setPersonal] = useState([]);
  const [personalFiltrado, setPersonalFiltrado] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroDepartamento, setFiltroDepartamento] = useState('Todos');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarPersonal();
  }, [searchTerm, filtroEstado, filtroDepartamento, personal]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [personalData, estadisticasData] = await Promise.all([
        rrhhService.obtenerTodoElPersonal(),
        rrhhService.obtenerEstadisticas()
      ]);

      setPersonal(personalData.data || []);
      setPersonalFiltrado(personalData.data || []);
      setEstadisticas(estadisticasData.data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar los datos del personal.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPersonal = () => {
    let resultado = [...personal];

    // Filtro por búsqueda
    if (searchTerm) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.puesto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.departamento.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filtroEstado !== 'Todos') {
      resultado = resultado.filter(p => p.estado === filtroEstado);
    }

    // Filtro por departamento
    if (filtroDepartamento !== 'Todos') {
      resultado = resultado.filter(p => p.departamento === filtroDepartamento);
    }

    setPersonalFiltrado(resultado);
  };

  const obtenerIniciales = (nombre) => {
    return nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const departamentos = ['Todos', ...new Set(personal.map(p => p.departamento))];
  const estados = ['Todos', 'Activo', 'Vacaciones', 'Licencia', 'Inactivo'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando personal...</p>
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
            <CardTitle className="text-sm font-medium">Total Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.totalPersonal || 0}</div>
            <p className="text-xs mt-1 opacity-90">Registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.personalActivo || 0}</div>
            <p className="text-xs mt-1 opacity-90">Trabajando</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {estadisticas?.porDepartamento ? Object.keys(estadisticas.porDepartamento).length : 0}
            </div>
            <p className="text-xs mt-1 opacity-90">Áreas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nuevos (3m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.nuevasContrataciones || 0}</div>
            <p className="text-xs mt-1 opacity-90">Contrataciones</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, puesto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filtroDepartamento}
              onChange={(e) => setFiltroDepartamento(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              {departamentos.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-blue-600" />
            Directorio de Personal
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({personalFiltrado.length} resultados)
            </span>
          </CardTitle>
          <CardDescription>Información completa del equipo de trabajo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personalFiltrado.length === 0 ? (
              <div className="text-center py-12">
                <UserCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No se encontró personal con los filtros aplicados</p>
              </div>
            ) : (
              personalFiltrado.map((empleado) => (
                <Card key={empleado.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">
                          {obtenerIniciales(empleado.nombre)}
                        </AvatarFallback>
                      </Avatar>
                    <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{empleado.nombre}</h3>
                        <p className="text-sm text-gray-600">{empleado.puesto}</p>
                      </div>
                      <Badge 
                        variant={
                          empleado.estado === 'Activo' ? 'default' : 
                          empleado.estado === 'Vacaciones' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {empleado.estado}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserCircle className="w-4 h-4" />
                        <span>{empleado.departamento}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Ingreso: {new Date(empleado.fechaIngreso).toLocaleDateString('es-PE')}
                          {empleado.antiguedad !== null && (
                            <span className="ml-1">
                              ({empleado.antiguedad} {empleado.antiguedad === 1 ? 'año' : 'años'})
                            </span>
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{empleado.email}</span>
                      </div>
                      
                      {empleado.telefono && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{empleado.telefono}</span>
                        </div>
                      )}
                      
                      {empleado.direccion && (
                        <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{empleado.direccion}</span>
                        </div>
                      )}
                      
                      {empleado.edad && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <UserCircle className="w-4 h-4" />
                          <span>Edad: {empleado.edad} años</span>
                        </div>
                      )}
                      
                      {empleado.genero && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <UserCircle className="w-4 h-4" />
                          <span>{empleado.genero}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </CardContent>
  </Card>

  {/* Distribución por Departamento */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Departamento</CardTitle>
        <CardDescription>Personal activo por área</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {estadisticas?.porDepartamento && Object.entries(estadisticas.porDepartamento)
            .sort(([, a], [, b]) => b - a)
            .map(([departamento, cantidad]) => (
              <div key={departamento} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-semibold">{departamento}</span>
                <span className="text-2xl font-bold text-blue-600">{cantidad}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Distribución por Puesto</CardTitle>
        <CardDescription>Top 5 puestos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {estadisticas?.porPuesto && Object.entries(estadisticas.porPuesto)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([puesto, cantidad]) => (
              <div key={puesto} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-semibold text-sm">{puesto}</span>
                <span className="text-xl font-bold text-green-600">{cantidad}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  </div>
</div>
);
}