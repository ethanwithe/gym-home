import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Package, Dumbbell, UserCircle, 
  Award, Target, Activity, Calendar, Loader2, AlertCircle 
} from 'lucide-react';
import RecursosHumanos from './RecursosHumanos.jsx';
import Productos from './productos.jsx';
import Maquinas from './Maquinas.jsx';
import Personal from './Personal.jsx';
import Clientes from './Clientes.jsx';
import { usuarioService } from '../services/usuarioService';
import { rrhhService } from '../services/rrhhService';
import { inventarioService } from '../services/inventarioService';
import { clienteService } from '../services/clienteService';

export default function FundadorDashboard({ activeSection }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricsGenerales, setMetricsGenerales] = useState([]);
  const [rendimientoAnual, setRendimientoAnual] = useState([]);
  const [distribucionIngresos, setDistribucionIngresos] = useState([]);
  const [crecimientoClientes, setCrecimientoClientes] = useState([]);

  useEffect(() => {
    if (activeSection === 'dashboard') {
      cargarDatosDashboard();
    }
  }, [activeSection]);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos de todos los servicios con mejor manejo de errores
      const [
        estadisticasUsuarios,
        estadisticasRRHH,
        estadisticasInventario,
        estadisticasClientes,
        crecimientoData
      ] = await Promise.all([
        usuarioService.obtenerEstadisticas().catch(() => ({ data: { totalActivos: 0 } })),
        rrhhService.obtenerEstadisticas().catch(() => ({ data: { totalPersonal: 0 } })),
        inventarioService.obtenerEstadisticas().catch(() => ({ data: { totalMaquinas: 0, totalProductos: 0 } })),
        clienteService.obtenerEstadisticas().catch(() => ({ data: { totalClientes: 0 } })),
        clienteService.obtenerCrecimientoMensual().catch(() => ({ data: [] }))
      ]);

      // Debug logs
      console.log('Estadísticas Usuarios:', estadisticasUsuarios);
      console.log('Estadísticas RRHH:', estadisticasRRHH);
      console.log('Estadísticas Inventario:', estadisticasInventario);
      console.log('Estadísticas Clientes:', estadisticasClientes);

      // Preparar métricas generales
      const metrics = [
        { 
          nombre: 'Ingresos Totales', 
          valor: 'S/ 217,190', 
          cambio: '+23%', 
          icono: DollarSign, 
          color: 'from-green-500 to-green-600' 
        },
        { 
          nombre: 'Clientes Activos', 
          valor: estadisticasClientes.data?.totalClientes?.toString() || '0', 
          cambio: '+156', 
          icono: Users, 
          color: 'from-blue-500 to-blue-600' 
        },
        { 
          nombre: 'Personal', 
          valor: estadisticasRRHH.data?.totalPersonal?.toString() || '0', 
          cambio: '+3', 
          icono: UserCircle, 
          color: 'from-purple-500 to-purple-600' 
        },
        { 
          nombre: 'Máquinas', 
          valor: estadisticasInventario.data?.totalMaquinas?.toString() || '0', 
          cambio: '+5', 
          icono: Dumbbell, 
          color: 'from-orange-500 to-orange-600' 
        },
        { 
          nombre: 'Productos', 
          valor: estadisticasInventario.data?.totalProductos?.toString() || '0', 
          cambio: '+8', 
          icono: Package, 
          color: 'from-pink-500 to-pink-600' 
        },
        { 
          nombre: 'Satisfacción', 
          valor: '94%', 
          cambio: '+2%', 
          icono: Award, 
          color: 'from-yellow-500 to-yellow-600' 
        },
      ];

      setMetricsGenerales(metrics);

      // Datos de rendimiento anual (simulados - deberían venir del backend)
      const rendimiento = [
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

      setRendimientoAnual(rendimiento);

      // Distribución de ingresos
      const distribucion = [
        { nombre: 'Membresías', valor: 145800, porcentaje: 67 },
        { nombre: 'Productos', valor: 42890, porcentaje: 20 },
        { nombre: 'Clases Personales', valor: 28500, porcentaje: 13 },
      ];

      setDistribucionIngresos(distribucion);

      // Preparar datos de crecimiento de clientes
      const crecimientoArray = Array.isArray(crecimientoData.data) ? crecimientoData.data : [];
      const crecimiento = crecimientoArray.length > 0 
        ? crecimientoArray.map(item => ({
            mes: item.mes,
            clientes: item.nuevos || 0
          }))
        : [
            { mes: 'Ene', clientes: 892 },
            { mes: 'Feb', clientes: 915 },
            { mes: 'Mar', clientes: 945 },
            { mes: 'Abr', clientes: 982 },
            { mes: 'May', clientes: 1028 },
            { mes: 'Jun', clientes: 1075 },
            { mes: 'Jul', clientes: 1124 },
            { mes: 'Ago', clientes: 1168 },
            { mes: 'Sep', clientes: 1205 },
            { mes: 'Oct', clientes: 1248 },
          ];

      setCrecimientoClientes(crecimiento);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Renderizar secciones específicas
  if (activeSection === 'recursos-humanos') {
    return <RecursosHumanos />;
  }
  if (activeSection === 'productos') {
    return <Productos />;
  }
  if (activeSection === 'maquinas') {
    return <Maquinas />;
  }
  if (activeSection === 'personal') {
    return <Personal />;
  }
  if (activeSection === 'clientes') {
    return <Clientes />;
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
              <LineChart data={rendimientoAnual}>
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

  if (activeSection === 'finanzas') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ingresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ 245K</div>
              <p className="text-xs text-green-100 mt-1">Este mes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Gastos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ 155K</div>
              <p className="text-xs text-red-100 mt-1">Este mes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Utilidad Neta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ 90K</div>
              <p className="text-xs text-blue-100 mt-1">Margen 36.7%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Proyección Anual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ 2.9M</div>
              <p className="text-xs text-purple-100 mt-1">Estimado 2025</p>
            </CardContent>
          </Card>
        </div>

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
                    label={({ nombre, porcentaje }) => `${nombre} ${porcentaje}%`}
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
              <CardTitle>Flujo de Caja</CardTitle>
              <CardDescription>Últimos 10 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rendimientoAnual}>
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
      </div>
    );
  }

  // Dashboard principal del fundador
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
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
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white p-8 rounded-lg shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <Award className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">Panel del Presidente Fundador</h2>
            <p className="text-yellow-100 text-lg">Juan Pérez - Vista Ejecutiva Completa</p>
          </div>
        </div>
        <p className="text-lg">
          Bienvenido al sistema de gestión integral. Aquí puede monitorear todas las operaciones del gimnasio en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricsGenerales.map((metric, index) => {
          const Icon = metric.icono;
          return (
            <Card key={index} className={`bg-gradient-to-br ${metric.color} text-white hover:shadow-2xl transition-shadow`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {metric.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.valor}</div>
                <p className="text-xs mt-1 opacity-90">{metric.cambio} este mes</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Crecimiento de Clientes
            </CardTitle>
            <CardDescription>Evolución de la base de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={crecimientoClientes}>
                <defs>
                  <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="clientes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClientes)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Rendimiento Financiero
            </CardTitle>
            <CardDescription>Últimos 10 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rendimientoAnual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `S/ ${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                <Line type="monotone" dataKey="utilidad" stroke="#3b82f6" strokeWidth={2} name="Utilidad" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Objetivos y Logros 2025
          </CardTitle>
          <CardDescription>Metas del año en curso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Clientes Objetivo: 1,500</span>
                  <span className="text-blue-600 font-bold">83%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Ingresos Anuales: S/ 3M</span>
                  <span className="text-green-600 font-bold">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Satisfacción: 95%</span>
                  <span className="text-purple-600 font-bold">99%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: '99%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Expansión Equipos</span>
                  <span className="text-orange-600 font-bold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}