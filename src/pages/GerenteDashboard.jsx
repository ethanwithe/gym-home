import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, ArrowUpRight, ArrowDownRight, Loader2, Package, UserCircle, Dumbbell } from 'lucide-react';
import { inventarioService } from '../services/inventarioService';
import { clienteService } from '../services/clienteService';
import { rrhhService } from '../services/rrhhService';
import Productos from './productos.jsx';
import Clientes from './Clientes.jsx';
import Personal from './Personal.jsx';
import Maquinas from './Maquinas.jsx';

export default function GerenteDashboard({ activeSection }) {
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    if (activeSection === 'dashboard') {
      cargarEstadisticas();
    }
  }, [activeSection]);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const [inventarioStats, clienteStats, rrhhStats] = await Promise.all([
        inventarioService.obtenerEstadisticas().catch(() => ({ data: {} })),
        clienteService.obtenerEstadisticas().catch(() => ({ data: {} })),
        rrhhService.obtenerEstadisticas().catch(() => ({ data: {} }))
      ]);
      
      console.log('Inventario Stats:', inventarioStats);
      console.log('Cliente Stats:', clienteStats);
      console.log('RRHH Stats:', rrhhStats);
      
      setEstadisticas({ 
        inventario: inventarioStats.data || {}, 
        clientes: clienteStats.data || {},
        rrhh: rrhhStats.data || {}
      });
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Datos de ventas mensuales
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

  // Flujo de dinero
  const flujoDinero = [
    { categoria: 'Membresías', ingreso: 145800, egreso: 0, neto: 145800 },
    { categoria: 'Productos', ingreso: 42890, egreso: 28500, neto: 14390 },
    { categoria: 'Clases Personales', ingreso: 28500, egreso: 12000, neto: 16500 },
    { categoria: 'Mantenimiento', ingreso: 0, egreso: 8500, neto: -8500 },
    { categoria: 'Salarios', ingreso: 0, egreso: 85000, neto: -85000 },
    { categoria: 'Servicios', ingreso: 0, egreso: 12800, neto: -12800 },
    { categoria: 'Marketing', ingreso: 0, egreso: 5200, neto: -5200 },
  ];

  // Datos adicionales para flujo de dinero
  const rendimientoMensual = [
    { mes: 'Ene', ingresos: 185000, gastos: 125000, utilidad: 60000 },
    { mes: 'Feb', ingresos: 192000, gastos: 128000, utilidad: 64000 },
    { mes: 'Mar', ingresos: 198000, gastos: 132000, utilidad: 66000 },
    { mes: 'Abr', ingresos: 205000, gastos: 135000, utilidad: 70000 },
    { mes: 'May', ingresos: 212000, gastos: 138000, utilidad: 74000 },
    { mes: 'Jun', ingresos: 218000, gastos: 142000, utilidad: 76000 },
    { mes: 'Jul', ingresos: 225000, gastos: 145000, utilidad: 80000 },
    { mes: 'Ago', ingresos: 232000, gastos: 148000, utilidad: 84000 },
    { mes: 'Sep', ingresos: 238000, gastos: 152000, utilidad: 86000 },
    { mes: 'Oct', ingresos: 245000, gastos: 155000, utilidad: 90000 },
  ];

  // Comparativa trimestral
  const comparativaT = [
    { trimestre: 'Q1 2024', ventas: 90400, crecimiento: 12 },
    { trimestre: 'Q2 2024', ventas: 116800, crecimiento: 29 },
    { trimestre: 'Q3 2024', ventas: 145500, crecimiento: 25 },
    { trimestre: 'Q4 2024', ventas: 178900, crecimiento: 23 },
  ];

  // Distribución de ingresos
  const distribucionIngresos = [
    { nombre: 'Membresías', valor: 145800 },
    { nombre: 'Productos', valor: 42890 },
    { nombre: 'Clases Personales', valor: 28500 },
    { nombre: 'Otros', valor: 12000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const totalIngresos = flujoDinero.reduce((sum, item) => sum + item.ingreso, 0);
  const totalEgresos = flujoDinero.reduce((sum, item) => sum + Math.abs(item.egreso), 0);
  const flujoNeto = totalIngresos - totalEgresos;

  // Renderizar secciones específicas
  if (activeSection === 'productos') {
    return <Productos />;
  }
  if (activeSection === 'clientes') {
    return <Clientes />;
  }
  if (activeSection === 'personal') {
    return <Personal />;
  }
  if (activeSection === 'maquinas') {
    return <Maquinas />;
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

  if (activeSection === 'flujo-dinero') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ingresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ {(totalIngresos / 1000).toFixed(0)}K</div>
              <p className="text-xs text-green-100 mt-1">Este mes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Egresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ {(totalEgresos / 1000).toFixed(0)}K</div>
              <p className="text-xs text-red-100 mt-1">Este mes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Flujo Neto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ {(flujoNeto / 1000).toFixed(0)}K</div>
              <p className="text-xs text-blue-100 mt-1">Utilidad del mes</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Flujo de Efectivo Detallado</CardTitle>
            <CardDescription>Ingresos y egresos por categoría del mes actual</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Egresos</TableHead>
                  <TableHead className="text-right">Neto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flujoDinero.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.categoria}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      S/ {item.ingreso.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-semibold">
                      S/ {Math.abs(item.egreso).toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right font-bold ${item.neto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      S/ {item.neto.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right text-green-600">
                    S/ {totalIngresos.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    S/ {totalEgresos.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right ${flujoNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    S/ {flujoNeto.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Ingresos</CardTitle>
              <CardDescription>Por fuente de ingreso</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribucionIngresos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {distribucionIngresos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `S/ ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flujo de Caja Mensual</CardTitle>
              <CardDescription>Últimos 10 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rendimientoMensual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => `S/ ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" />
                  <Bar dataKey="gastos" fill="#ef4444" name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Evolución de Utilidad Mensual</CardTitle>
            <CardDescription>Tendencia de utilidad neta en los últimos 10 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={rendimientoMensual}>
                <defs>
                  <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `S/ ${value.toLocaleString()}`} />
                <Area type="monotone" dataKey="utilidad" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUtilidad)" name="Utilidad" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSection === 'dashboard') {
    return (
      <div className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Ventas del Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ 245,000</div>
              <p className="text-xs text-green-100 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +23% vs. mes anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Clientes Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {estadisticas?.clientes?.totalClientes || 1248}
              </div>
              <p className="text-xs text-blue-100 mt-1">+156 este mes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {estadisticas?.rrhh?.totalPersonal || 25}
              </div>
              <p className="text-xs text-purple-100 mt-1">Empleados activos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="w-4 h-4" />
                Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {estadisticas?.inventario?.totalProductos || 150}
              </div>
              <p className="text-xs text-orange-100 mt-1">En inventario</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ventas y Compras</CardTitle>
              <CardDescription>Comparativa mensual del año</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ventasMensuales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => `S/ ${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2} name="Ventas" />
                  <Line type="monotone" dataKey="compras" stroke="#ef4444" strokeWidth={2} name="Compras" />
                  <Line type="monotone" dataKey="ganancia" stroke="#10b981" strokeWidth={2} name="Ganancia" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Ingresos</CardTitle>
              <CardDescription>Por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distribucionIngresos}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {distribucionIngresos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `S/ ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Flujo de Efectivo Detallado</CardTitle>
            <CardDescription>Ingresos y egresos por categoría del mes actual</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                  <TableHead className="text-right">Egresos</TableHead>
                  <TableHead className="text-right">Neto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flujoDinero.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.categoria}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      S/ {item.ingreso.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-semibold">
                      S/ {Math.abs(item.egreso).toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right font-bold ${item.neto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      S/ {item.neto.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-bold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right text-green-600">
                    S/ {totalIngresos.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    S/ {totalEgresos.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right ${flujoNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    S/ {flujoNeto.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparativa de Crecimiento Trimestral</CardTitle>
            <CardDescription>Análisis de ventas por trimestre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparativaT}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trimestre" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="ventas" fill="#3b82f6" name="Ventas (S/)" />
                <Bar yAxisId="right" dataKey="crecimiento" fill="#10b981" name="Crecimiento (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sección en Desarrollo</CardTitle>
          <CardDescription>Esta sección estará disponible próximamente</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Seleccione otra opción del menú lateral.</p>
        </CardContent>
      </Card>
    </div>
  );
}