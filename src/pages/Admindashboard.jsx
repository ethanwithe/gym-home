import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

export default function AdminDashboard({ activeSection }) {
  // Datos de ejemplo para ventas de productos
  const ventasProductos = [
    { id: 1, producto: 'Proteína Whey 2kg', cantidad: 45, precio: 89.90, total: 4045.50, fecha: '2025-10-15' },
    { id: 2, producto: 'Creatina Monohidratada', cantidad: 32, precio: 45.00, total: 1440.00, fecha: '2025-10-15' },
    { id: 3, producto: 'Aminoácidos BCAA', cantidad: 28, precio: 55.00, total: 1540.00, fecha: '2025-10-14' },
    { id: 4, producto: 'Pre-Workout', cantidad: 22, precio: 65.00, total: 1430.00, fecha: '2025-10-14' },
    { id: 5, producto: 'Barras Proteicas (caja 12)', cantidad: 38, precio: 35.00, total: 1330.00, fecha: '2025-10-13' },
    { id: 6, producto: 'Shaker Deportivo', cantidad: 55, precio: 15.00, total: 825.00, fecha: '2025-10-13' },
    { id: 7, producto: 'Guantes de Entrenamiento', cantidad: 18, precio: 25.00, total: 450.00, fecha: '2025-10-12' },
    { id: 8, producto: 'Toalla Deportiva', cantidad: 42, precio: 20.00, total: 840.00, fecha: '2025-10-12' },
  ];

  const ventasPorProducto = [
    { nombre: 'Proteína Whey', ventas: 4045.50 },
    { nombre: 'Creatina', ventas: 1440.00 },
    { nombre: 'BCAA', ventas: 1540.00 },
    { nombre: 'Pre-Workout', ventas: 1430.00 },
    { nombre: 'Barras Proteicas', ventas: 1330.00 },
    { nombre: 'Otros', ventas: 2115.00 },
  ];

  const distribucionVentas = [
    { nombre: 'Suplementos', valor: 8455.50, porcentaje: 67 },
    { nombre: 'Accesorios', valor: 2115.00, porcentaje: 17 },
    { nombre: 'Ropa Deportiva', valor: 2030.00, porcentaje: 16 },
  ];

  // Datos de ventas mensuales (igual que en Gerente)
  const ventasMensuales = [
    { mes: 'Ene', ventas: 28500, compras: 15200, ganancia: 13300 },
    { mes: 'Feb', ventas: 32100, compras: 16800, ganancia: 15300 },
    { mes: 'Mar', ventas: 29800, compras: 14900, ganancia: 14900 },
    { mes: 'Abr', ventas: 35600, compras: 18200, ganancia: 17400 },
    { mes: 'May', ventas: 38900, compras: 19500, ganancia: 19400 },
    { mes: 'Jun', ventas: 42300, compras: 21000, ganancia: 21300 },
    { mes: 'Jul', ventas: 45800, compras: 22400, ganancia: 23400 },
    { mes: 'Ago', ventas: 48200, compras: 23800, ganancia: 24400 },
    { mes: 'Sep', ventas: 51500, compras: 25200, ganancia: 26300 },
    { mes: 'Oct', ventas: 54200, compras: 26500, ganancia: 27700 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const totalVentas = ventasProductos.reduce((sum, item) => sum + item.total, 0);
  const totalProductos = ventasProductos.reduce((sum, item) => sum + item.cantidad, 0);

  if (activeSection === 'productos') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Ventas Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ {totalVentas.toFixed(2)}</div>
              <p className="text-xs text-blue-100 mt-1">Últimos 7 días</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Productos Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProductos}</div>
              <p className="text-xs text-green-100 mt-1">Unidades totales</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Productos Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">48</div>
              <p className="text-xs text-purple-100 mt-1">En inventario</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Crecimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+18%</div>
              <p className="text-xs text-orange-100 mt-1">vs. semana anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Producto</CardTitle>
              <CardDescription>Últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorProducto}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => `S/ ${value.toFixed(2)}`} />
                  <Bar dataKey="ventas" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Ventas por Categoría</CardTitle>
              <CardDescription>Porcentaje del total</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribucionVentas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, porcentaje }) => `${nombre} ${porcentaje}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {distribucionVentas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `S/ ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Ventas de Productos</CardTitle>
            <CardDescription>Transacciones recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventasProductos.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell className="font-medium">{venta.producto}</TableCell>
                    <TableCell className="text-center">{venta.cantidad}</TableCell>
                    <TableCell className="text-right">S/ {venta.precio.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold">S/ {venta.total.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{venta.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSection === 'ventas') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle>Ventas del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">S/ 245,000</div>
              <p className="text-sm text-blue-100 mt-2">+23% vs. mes anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle>Utilidad Neta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">S/ 90,000</div>
              <p className="text-sm text-green-100 mt-2">Margen: 36.7%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle>ROI Anual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">42%</div>
              <p className="text-sm text-purple-100 mt-2">Retorno de inversión</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento Financiero Anual</CardTitle>
            <CardDescription>Análisis de ingresos, gastos y utilidad</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={ventasMensuales.map(v => ({ 
                mes: v.mes, 
                ingresos: v.ventas, 
                gastos: v.compras, 
                utilidad: v.ganancia 
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `S/ ${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={3} name="Ingresos" />
                <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={3} name="Gastos" />
                <Line type="monotone" dataKey="utilidad" stroke="#3b82f6" strokeWidth={3} name="Utilidad" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">48</div>
            <p className="text-sm text-blue-100 mt-2">Productos activos en inventario</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Ventas del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">S/ 42,890</div>
            <p className="text-sm text-green-100 mt-2">+15% vs. mes anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Transacciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">328</div>
            <p className="text-sm text-purple-100 mt-2">Este mes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Panel de Administrador</CardTitle>
          <CardDescription>Acceso a datos de ventas de productos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Bienvenido al Panel de Administrador
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Seleccione "Productos" en el menú lateral para ver el detalle completo de ventas y estadísticas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}