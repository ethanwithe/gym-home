import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Dumbbell, 
  UserCircle, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Tag
} from 'lucide-react';
import AdminDashboard from './Admindashboard.jsx';
import GerenteDashboard from './GerenteDashboard.jsx';
import ClienteDashboard from './ClienteDashboard.jsx';
import FundadorDashboard from './FundadorDashboard.jsx';
import RecursosHumanos from './RecursosHumanos.jsx';
import Productos from './productos.jsx';
import Maquinas from './Maquinas.jsx';
import Personal from './Personal.jsx';
import Clientes from './Clientes.jsx';

export default function Dashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Definir las secciones del menú según el rol
  const getMenuSections = () => {
    const commonSections = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    const adminSections = [
      ...commonSections,
      { id: 'productos', label: 'Productos', icon: Package },
      { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
    ];

    const gerenteSections = [
      ...commonSections,
      { id: 'ventas', label: 'Ventas', icon: TrendingUp },
      { id: 'finanzas', label: 'Flujo de Dinero', icon: DollarSign },
      { id: 'productos', label: 'Productos', icon: Package },
      { id: 'clientes', label: 'Clientes', icon: Users },
      { id: 'personal', label: 'Personal', icon: UserCircle },
    ];

    const fundadorSections = [
      ...commonSections,
      { id: 'recursos-humanos', label: 'Recursos Humanos', icon: Users },
      { id: 'productos', label: 'Productos', icon: Package },
      { id: 'maquinas', label: 'Máquinas', icon: Dumbbell },
      { id: 'personal', label: 'Personal', icon: UserCircle },
      { id: 'clientes', label: 'Clientes', icon: Users },
      { id: 'ventas', label: 'Ventas', icon: TrendingUp },
      { id: 'finanzas', label: 'Finanzas', icon: DollarSign },
    ];

    const clienteSections = [
      { id: 'ofertas', label: 'Ofertas', icon: Tag },
      { id: 'informacion', label: 'Información', icon: LayoutDashboard },
    ];

    switch (user.role) {
      case 'administrador':
        return adminSections;
      case 'gerente':
        return gerenteSections;
      case 'fundador':
        return fundadorSections;
      case 'cliente':
        return clienteSections;
      default:
        return commonSections;
    }
  };

  const renderContent = () => {
    // Dashboards específicos por rol
    if (user.role === 'administrador') {
      return <AdminDashboard activeSection={activeSection} />;
    } else if (user.role === 'gerente') {
      return <GerenteDashboard activeSection={activeSection} />;
    } else if (user.role === 'cliente') {
      return <ClienteDashboard activeSection={activeSection} />;
    } else if (user.role === 'fundador') {
      return <FundadorDashboard activeSection={activeSection} />;
    }

    // Renderizar secciones comunes
    switch (activeSection) {
      case 'recursos-humanos':
        return <RecursosHumanos />;
      case 'productos':
        return <Productos />;
      case 'maquinas':
        return <Maquinas />;
      case 'personal':
        return <Personal />;
      case 'clientes':
        return <Clientes />;
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sección en Desarrollo</CardTitle>
              <CardDescription>Esta sección estará disponible próximamente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Seleccione otra opción del menú lateral.</p>
            </CardContent>
          </Card>
        );
    }
  };

  const menuSections = getMenuSections();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Gimnasio</h2>
              <p className="text-sm text-gray-400">Juan Pérez</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg">
            <UserCircle className="w-10 h-10" />
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Button
            onClick={onLogout}
            variant="destructive"
            className="w-full flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuSections.find(s => s.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  Bienvenido, {user.name}
                </p>
              </div>
            </div>
            {user.role === 'fundador' && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg shadow-md">
                <p className="text-sm font-semibold">Presidente Fundador</p>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}