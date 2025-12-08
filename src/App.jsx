import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ClienteDashboard from './pages/ClienteDashboard.jsx';
import { usuarioService } from './services/usuarioService';
import './app.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  // Verifica si hay usuario logueado al cargar la app
  useEffect(() => {
    const currentUser = usuarioService.getCurrentUser();
    if (currentUser) {         
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('Login exitoso:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    usuarioService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar Login o Register
  if (!user) {
    return showRegister ? (
      <RegisterPage toggleLogin={() => setShowRegister(false)} />
    ) : (
      <LoginPage
        onLogin={handleLogin}
        toggleRegister={() => setShowRegister(true)}
      />
    );
  }

  // REDIRECCIONAMIENTO BASADO EN TIPO DE USUARIO
  
  // Si es CLIENTE (viene de /api/clientes)
  if (user.userType === 'cliente' || user.role === 'cliente') {
    return <ClienteDashboard user={user} onLogout={handleLogout} />;
  }

  // Si es USUARIO (viene de /api/users/login) - fundador, admin, gerente
  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;