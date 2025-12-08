import React, { useState } from 'react';
import { Dumbbell, Loader2, AlertCircle } from 'lucide-react';
import { usuarioService } from '../services/usuarioService';
import { clienteService } from '../services/clienteService';

export default function LoginPage({ onLogin, toggleRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1️⃣ Intento login normal (usuarios del sistema)
      let response = await fetch(
        'https://api-gateway-production-be01.up.railway.app/api/users/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      let data = await response.json();

      if (response.ok && data.success && data.usuario) {
        // Login exitoso como usuario del sistema
        const userData = {
          ...data.usuario,
          name: data.usuario.nombre || data.usuario.username,
          userType: 'usuario' // Marcador para Dashboard normal
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        if (data.token) localStorage.setItem('token', data.token);

        onLogin(userData);
      } else {
        // 2️⃣ Si falla login normal, intento login como cliente
        const clientesRes = await fetch(
          'https://api-gateway-production-be01.up.railway.app/api/clientes'
        );
        const clientes = await clientesRes.json();

        const clienteEncontrado = clientes.find(
          (c) => c.nombre.toLowerCase() === username.toLowerCase()
        );

        if (clienteEncontrado) {
          // Login exitoso como cliente - REDIRECCIÓN A CLIENTEDASHBOARD
          const clienteData = {
            ...clienteEncontrado,
            name: clienteEncontrado.nombre,
            userType: 'cliente', // Marcador IMPORTANTE para redirección
            role: 'cliente'
          };
          
          localStorage.setItem('user', JSON.stringify(clienteData));
          onLogin(clienteData);
        } else {
          setError(data.message || 'Credenciales incorrectas');
        }
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-white text-center px-8">
            <img
              src="/assets/logo.png"
              alt="Gimnasio Juan Pérez"
              className="w-28 h-28 mx-auto mb-6 object-contain drop-shadow-xl animate-pulse"
            />
            <h1 className="text-5xl font-bold mb-4">Gimnasio Juan Pérez</h1>
            <p className="text-xl text-gray-200">Sistema de Gestión Integral</p>
          </div>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
              <div className="flex justify-center mb-3 lg:hidden">
                <Dumbbell className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
              <p className="text-sm text-blue-100 mt-1">Ingrese sus credenciales para acceder</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <input
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">{error}</div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={toggleRegister}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Regístrate
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
            <p>Sistema de Gestión Integral v2.0</p>
            <p className="mt-1">© 2025 Gimnasio Juan Pérez</p>
          </div>
        </div>
      </div>
    </div>
  );
}