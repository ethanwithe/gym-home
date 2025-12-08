import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage({ toggleLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    documento: '',
    direccion: '',
    fechaNacimiento: '',
    genero: '',
    membresia: 'Mensual',
    fechaInicio: '',
    fechaVencimiento: '',
    visitas: 0,
    notas: '',
    contactoEmergencia: '',
    telefonoEmergencia: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const hoy = new Date();
    const fechaInicio = hoy.toISOString().split('T')[0];

    let meses = 1;
    if (formData.membresia === 'Trimestral') meses = 3;
    if (formData.membresia === 'Anual') meses = 12;

    const fechaFin = new Date(hoy.setMonth(hoy.getMonth() + meses))
      .toISOString()
      .split('T')[0];

    setFormData(prev => ({
      ...prev,
      fechaInicio,
      fechaVencimiento: fechaFin
    }));
  }, [formData.membresia]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://api-gateway-production-be01.up.railway.app/api/clientes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Cliente registrado correctamente');
        setFormData(prev => ({
          ...prev,
          nombre: '',
          email: '',
          telefono: '',
          password: '',
          documento: '',
          direccion: '',
          fechaNacimiento: '',
          genero: '',
          notas: '',
          contactoEmergencia: '',
          telefonoEmergencia: ''
        }));
      } else {
        setError(data.message || JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100 p-4">
      
      {/* Formulario flotante, más ancho y compacto */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200 backdrop-blur-sm bg-white/90 flex flex-col items-center animate-fadeIn">

        {/* Logo flotante */}
        <div className="flex justify-center mb-4">
          <img src="/assets/logo.png" alt="Logo Gimnasio" className="h-16 object-contain" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-5 text-gray-800">
          Registro de Cliente
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-red-800 mb-3 w-full">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 mb-3 w-full">
            {success}
          </div>
        )}

        <form className="grid grid-cols-2 gap-3 w-full" onSubmit={handleSubmit}>
          {['nombre', 'email', 'telefono', 'password', 'documento', 'direccion', 'fechaNacimiento', 'contactoEmergencia', 'telefonoEmergencia'].map(field => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                type={field === 'email' ? 'email' : field.includes('fecha') ? 'date' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="h-9 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
              />
            </div>
          ))}

          {/* Género */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Género</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
              className="h-9 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
            >
              <option value="">Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Membresía */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Membresía</label>
            <select
              name="membresia"
              value={formData.membresia}
              onChange={handleChange}
              className="h-9 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
            >
              <option value="Mensual">Mensual</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>

          {/* Fechas automáticas */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              readOnly
              className="h-9 px-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
            <input
              type="date"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              readOnly
              className="h-9 px-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
            />
          </div>

          {/* Notas libre */}
          <div className="col-span-2 flex flex-col">
            <label className="text-sm font-medium text-gray-700">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Opcional: agrega alguna nota o referencia"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              rows={2}
            />
          </div>

          {/* Botón enviar */}
          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar'}
            </button>
          </div>

          {/* Link a login */}
          <div className="col-span-2 text-center text-sm text-gray-600 mt-1">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={toggleLogin}
              className="text-blue-600 hover:underline font-medium"
            >
              Inicia sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
