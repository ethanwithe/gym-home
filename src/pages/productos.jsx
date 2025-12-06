import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Package, AlertTriangle, TrendingUp, DollarSign, Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { inventarioService } from '../services/inventarioService';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [searchTerm, filtroCategoria, productos]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productosData, estadisticasData] = await Promise.all([
        inventarioService.obtenerTodosLosProductos(),
        inventarioService.obtenerEstadisticas()
      ]);

      setProductos(productosData.data || []);
      setProductosFiltrados(productosData.data || []);
      setEstadisticas(estadisticasData.data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar los productos. Verifique la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarProductos = () => {
    let resultado = [...productos];

    if (searchTerm) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtroCategoria !== 'Todas') {
      resultado = resultado.filter(p => p.categoria === filtroCategoria);
    }

    setProductosFiltrados(resultado);
  };

  const categorias = ['Todas', ...new Set(productos.map(p => p.categoria))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando productos...</p>
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
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.totalProductos || 0}</div>
            <p className="text-xs mt-1 opacity-90">En inventario</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              S/ {estadisticas?.valorTotal?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs mt-1 opacity-90">Total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{estadisticas?.productosStockBajo || 0}</div>
            <p className="text-xs mt-1 opacity-90">Alertas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              S/ {estadisticas?.ventasMes?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs mt-1 opacity-90">Este mes</p>
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
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Inventario de Productos
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({productosFiltrados.length} productos)
            </span>
          </CardTitle>
          <CardDescription>Gestión completa de productos y stock</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Ventas</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                productosFiltrados.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell>{producto.categoria}</TableCell>
                    <TableCell className="text-right">S/ {producto.precio?.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <span className={producto.stock < 10 ? 'text-red-600 font-bold' : ''}>
                        {producto.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{producto.ventas || 0}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={producto.estado === 'Disponible' ? 'default' : 'destructive'}>
                        {producto.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Productos con stock bajo y más vendidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Alertas de Stock
            </CardTitle>
            <CardDescription>Productos que requieren reabastecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productos
                .filter(p => p.stock < 10)
                .slice(0, 5)
                .map((producto) => (
                  <div key={producto.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-gray-800">{producto.nombre}</p>
                      <p className="text-sm text-gray-600">Stock actual: {producto.stock} unidades</p>
                    </div>
                    <Badge variant="destructive">Urgente</Badge>
                  </div>
                ))}
              {productos.filter(p => p.stock < 10).length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No hay productos con stock bajo
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Productos Más Vendidos
            </CardTitle>
            <CardDescription>Top 5 del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productos
                .sort((a, b) => (b.ventas || 0) - (a.ventas || 0))
                .slice(0, 5)
                .map((producto, index) => (
                  <div key={producto.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{producto.nombre}</p>
                        <p className="text-sm text-gray-600">{producto.ventas || 0} unidades vendidas</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">
                      S/ {((producto.precio || 0) * (producto.ventas || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}