import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Dumbbell, Wrench, CheckCircle, AlertCircle, Loader2, RefreshCw, Search } from 'lucide-react';
import { inventarioService } from '../services/inventarioService';

export default function Maquinas() {
  const [maquinas, setMaquinas] = useState([]);
  const [maquinasFiltradas, setMaquinasFiltradas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroZona, setFiltroZona] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarMaquinas();
  }, [searchTerm, filtroZona, filtroEstado, maquinas]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [maquinasData, estadisticasData] = await Promise.all([
        inventarioService.obtenerTodasLasMaquinas(),
        inventarioService.obtenerEstadisticas()
      ]);

      setMaquinas(maquinasData.data || []);
      setMaquinasFiltradas(maquinasData.data || []);
setEstadisticas(estadisticasData.data || []);
} catch (err) {
console.error('Error al cargar datos:', err);
setError('No se pudieron cargar las máquinas. Verifique la conexión con el servidor.');
} finally {
setLoading(false);
}
};const filtrarMaquinas = () => {
let resultado = [...maquinas];if (searchTerm) {
  resultado = resultado.filter(m =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.zona.toLowerCase().includes(searchTerm.toLowerCase())
  );
}if (filtroZona !== 'Todas') {
  resultado = resultado.filter(m => m.zona === filtroZona);
}if (filtroEstado !== 'Todos') {
  resultado = resultado.filter(m => m.estado === filtroEstado);
}setMaquinasFiltradas(resultado);
};
const cambiarEstadoMaquina = async (id, nuevoEstado) => {
try {
await inventarioService.cambiarEstadoMaquina(id, nuevoEstado);
await cargarDatos();
} catch (err) {
console.error('Error al cambiar estado:', err);
alert('Error al cambiar el estado de la máquina');
}
};
const getEstadoBadge = (estado) => {
switch (estado) {
case 'Operativa':
return <Badge className="bg-green-600">Operativa</Badge>;
case 'Mantenimiento':
return <Badge className="bg-orange-600">Mantenimiento</Badge>;
case 'Fuera de Servicio':
return <Badge variant="destructive">Fuera de Servicio</Badge>;
default:
return <Badge>{estado}</Badge>;
}
};
const zonas = ['Todas', ...new Set(maquinas.map(m => m.zona))];
const estados = ['Todos', 'Operativa', 'Mantenimiento', 'Fuera de Servicio'];
if (loading) {
return (
<div className="flex items-center justify-center h-64">
<div className="text-center">
<Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
<p className="text-gray-600">Cargando máquinas...</p>
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
<CardTitle className="text-sm font-medium">Total Máquinas</CardTitle>
</CardHeader>
<CardContent>
<div className="text-3xl font-bold">{estadisticas?.totalMaquinas || 0}</div>
<p className="text-xs mt-1 opacity-90">En inventario</p>
</CardContent>
</Card>
<Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Operativas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{estadisticas?.maquinasOperativas || 0}</div>
        <p className="text-xs mt-1 opacity-90">
          {estadisticas?.totalMaquinas > 0 
            ? Math.round((estadisticas.maquinasOperativas / estadisticas.totalMaquinas) * 100)
            : 0}% del total
        </p>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">En Mantenimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{estadisticas?.maquinasMantenimiento || 0}</div>
        <p className="text-xs mt-1 opacity-90">Actualmente</p>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Fuera de Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{estadisticas?.maquinasFueraServicio || 0}</div>
        <p className="text-xs mt-1 opacity-90">Reparación</p>
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
            placeholder="Buscar máquinas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filtroZona}
          onChange={(e) => setFiltroZona(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {zonas.map(zona => (
            <option key={zona} value={zona}>{zona}</option>
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

  {/* Tabla de máquinas */}
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Dumbbell className="w-5 h-5 text-blue-600" />
        Inventario de Máquinas y Equipos
        <span className="text-sm font-normal text-gray-500 ml-2">
          ({maquinasFiltradas.length} máquinas)
        </span>
      </CardTitle>
      <CardDescription>Gestión y mantenimiento de equipamiento</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Máquina</TableHead>
            <TableHead>Zona</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Último Mant.</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maquinasFiltradas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                No se encontraron máquinas
              </TableCell>
            </TableRow>
          ) : (
            maquinasFiltradas.map((maquina) => (
              <TableRow key={maquina.id}>
                <TableCell className="font-medium">{maquina.nombre}</TableCell>
                <TableCell>{maquina.zona}</TableCell>
                <TableCell>{maquina.marca}</TableCell>
                <TableCell>{maquina.modelo}</TableCell>
                <TableCell className="text-center">
                  {getEstadoBadge(maquina.estado)}
                </TableCell>
                <TableCell className="text-center">
                  {maquina.ultimoMantenimiento 
                    ? new Date(maquina.ultimoMantenimiento).toLocaleDateString('es-PE')
                    : 'N/A'
                  }
                </TableCell>
                <TableCell className="text-center">
                  <select
                    className="text-xs border rounded px-2 py-1"
                    value={maquina.estado}
                    onChange={(e) => cambiarEstadoMaquina(maquina.id, e.target.value)}
                  >
                    <option value="Operativa">Operativa</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Fuera de Servicio">Fuera de Servicio</option>
                  </select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  {/* Mantenimiento programado y estado general */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-orange-600" />
          Mantenimiento Programado
        </CardTitle>
        <CardDescription>Próximas revisiones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {maquinas
            .filter(m => m.estado === 'Mantenimiento')
            .slice(0, 5)
            .map((maquina) => (
              <div key={maquina.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-semibold">{maquina.nombre}</p>
                  <p className="text-sm text-gray-600">
                    Último mantenimiento: {
                      maquina.ultimoMantenimiento 
                        ? new Date(maquina.ultimoMantenimiento).toLocaleDateString('es-PE')
                        : 'N/A'
                    }
                  </p>
                </div>
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            ))}
          {maquinas.filter(m => m.estado === 'Mantenimiento').length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No hay máquinas en mantenimiento
            </p>
          )}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Estado General por Zona
        </CardTitle>
        <CardDescription>Resumen de operatividad</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {zonas
            .filter(z => z !== 'Todas')
            .map((zona) => {
              const totalZona = maquinas.filter(m => m.zona === zona).length;
              const operativasZona = maquinas.filter(m => m.zona === zona && m.estado === 'Operativa').length;
              const porcentaje = totalZona > 0 ? Math.round((operativasZona / totalZona) * 100) : 0;
              
              return (
                <div key={zona}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{zona}</span>
                    <span className={`font-bold ${porcentaje >= 90 ? 'text-green-600' : porcentaje >= 70 ? 'text-orange-600' : 'text-red-600'}`}>
                      {porcentaje}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${porcentaje >= 90 ? 'bg-green-600' : porcentaje >= 70 ? 'bg-orange-600' : 'bg-red-600'}`}
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {operativasZona} de {totalZona} máquinas operativas
                  </p>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  </div>
</div>
);
}