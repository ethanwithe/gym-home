import React, { useState } from 'react';
import { Dumbbell, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://api-gateway-production-be01.up.railway.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success && data.usuario) {
        localStorage.setItem('user', JSON.stringify(data.usuario));
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        onLogin({
          ...data.usuario,
          name: data.usuario.nombre || data.usuario.username
        });
      } else {
        setError(data.message || 'Credenciales incorrectas');
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
      {/* Lado izquierdo - Imagen */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cover bg-center"
             style={{backgroundImage: "url('src/assets/hero.png')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-white text-center px-8">
            <img
            src="src/assets/logo.png"
            alt="Gimnasio Juan Pérez"
            className="w-28 h-28 mx-auto mb-6 object-contain drop-shadow-xl animate-pulse"
            />
            <h1 className="text-5xl font-bold mb-4">Gimnasio Juan Pérez</h1>
            <p className="text-xl text-gray-200">Sistema de Gestión Integral</p>
            <p className="text-sm text-gray-300 mt-2">Fundado por Juan Pérez</p>
            
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">1,200+</div>
                <div className="text-xs text-gray-300">Clientes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">10+</div>
                <div className="text-xs text-gray-300">Años</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-xs text-gray-300">Personal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
              <div className="flex justify-center mb-3 lg:hidden">
                <Dumbbell className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
              <p className="text-sm text-blue-100 mt-1">
                Ingrese sus credenciales para acceder
              </p>
            </div>

            {/* Formulario */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Ingrese su usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    id="password"
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
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
              </div>

              {/* Info importante */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Información importante:
                </p>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>• Usa las credenciales de la base de datos</p>
                  <p>• Verifica que el backend esté corriendo en puerto https://api-gateway-production-be01.up.railway.app</p>
                  <p>• Los roles disponibles: fundador, gerente, administrador, cliente</p>
                </div>
              </div>

              {/* Estado del servidor */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Conectando a https://api-gateway-production-be01.up.railway.app
                </div>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-6 text-center text-xs text-gray-600">
            <p>Sistema de Gestión Integral v2.0</p>
            <p className="mt-1">© 2025 Gimnasio Juan Pérez</p>
          </div>
        </div>
      </div>
    </div>
  );
}