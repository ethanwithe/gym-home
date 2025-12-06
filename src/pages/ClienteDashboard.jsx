import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tag, Clock, MapPin, Phone, Mail, Dumbbell, AlertCircle, Award
} from 'lucide-react';

import gymLuxury from '../assets/hero.png';
import { clienteService } from "../services/clienteService";

export default function ClienteDashboard({ activeSection }) {
  // ---------- ESTADOS ----------
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
    // ---------- CARGA INICIAL ----------
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const response = await clienteService.obtenerTodosLosClientes();
        setClientes(response.data);
      } catch (err) {
        console.error("Error cargando clientes:", err);
        setError("No se pudo cargar la información. Verifique la conexión.");
      } finally {
        setCargando(false);
      }
    };

    cargarClientes();
  }, []);
  const ofertas = [
    {
      id: 1,
      titulo: 'Membresía Anual - 30% OFF',
      descripcion: 'Aprovecha nuestra promoción especial de fin de año. Acceso ilimitado a todas las instalaciones.',
      precio: 'S/ 1,200',
      precioAnterior: 'S/ 1,714',
      descuento: '30%',
      vigencia: '31 de Diciembre 2025',
      destacado: true,
    },
    {
      id: 2,
      titulo: 'Pack Proteína + Creatina',
      descripcion: 'Combo especial: Proteína Whey 2kg + Creatina Monohidratada 500g',
      precio: 'S/ 120',
      precioAnterior: 'S/ 145',
      descuento: '17%',
      vigencia: '30 de Noviembre 2025',
      destacado: false,
    },
    {
      id: 3,
      titulo: 'Clases Personales - 3 Meses',
      descripcion: '12 sesiones de entrenamiento personalizado con instructores certificados.',
      precio: 'S/ 450',
      precioAnterior: 'S/ 600',
      descuento: '25%',
      vigencia: '15 de Noviembre 2025',
      destacado: true,
    },
    {
      id: 4,
      titulo: 'Membresía Familiar',
      descripcion: 'Hasta 4 personas. Acceso completo al gimnasio y clases grupales.',
      precio: 'S/ 2,100',
      precioAnterior: 'S/ 2,800',
      descuento: '25%',
      vigencia: '31 de Diciembre 2025',
      destacado: false,
    },
  ];

  const horarios = [
    { dia: 'Lunes - Viernes', horario: '5:00 AM - 11:00 PM' },
    { dia: 'Sábados', horario: '6:00 AM - 9:00 PM' },
    { dia: 'Domingos', horario: '7:00 AM - 7:00 PM' },
    { dia: 'Feriados', horario: '8:00 AM - 6:00 PM' },
  ];

  const servicios = [
    { nombre: 'Área de Cardio', icono: '🏃', descripcion: 'Equipos de última generación' },
    { nombre: 'Zona de Pesas', icono: '💪', descripcion: 'Máquinas y pesas libres' },
    { nombre: 'Clases Grupales', icono: '👥', descripcion: 'Yoga, Spinning, Zumba y más' },
    { nombre: 'Entrenadores', icono: '🎯', descripcion: 'Personal certificado' },
    { nombre: 'Vestuarios', icono: '🚿', descripcion: 'Duchas y casilleros' },
    { nombre: 'Nutrición', icono: '🥗', descripcion: 'Asesoría nutricional' },
  ];

    // ---------- LOADER ----------
  if (cargando && activeSection === "clientes") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Cargando información...</p>
        </div>
      </div>
    );
  }

  // ---------- ERROR ----------
  if (error && activeSection === "clientes") {
    return (
      <div className="p-6">
        <Card className="border-l-4 border-red-500 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-lg text-red-800">Error al cargar datos</p>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (activeSection === 'ofertas') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Ofertas Especiales</h2>
          </div>
          <p className="text-lg text-blue-100">
            Aprovecha nuestras promociones exclusivas y ahorra en membresías, productos y servicios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ofertas.map((oferta) => (
            <Card 
              key={oferta.id} 
              className={`${oferta.destacado ? 'border-2 border-blue-500 shadow-xl' : ''} hover:shadow-2xl transition-shadow`}
            >
              {oferta.destacado && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-2 font-semibold text-sm">
                  ⭐ OFERTA DESTACADA ⭐
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{oferta.titulo}</CardTitle>
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    -{oferta.descuento}
                  </Badge>
                </div>
                <CardDescription className="text-base mt-2">{oferta.descripcion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-blue-600">{oferta.precio}</span>
                    <span className="text-xl text-gray-400 line-through">{oferta.precioAnterior}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Válido hasta: {oferta.vigencia}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Solicitar Oferta
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === 'informacion') {
    return (
      <div className="space-y-6">
        <div className="relative h-64 rounded-lg overflow-hidden shadow-xl">
          <img src={gymLuxury} alt="Gimnasio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
            <div className="text-white text-center">
              <h1 className="text-5xl font-bold mb-2">Gimnasio Juan Pérez</h1>
              <p className="text-xl">Tu mejor versión te espera</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Horarios de Atención
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {horarios.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="font-semibold text-gray-700">{item.dia}</span>
                    <span className="text-blue-600 font-medium">{item.horario}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">Dirección</p>
                    <p className="text-gray-600">Av. Principal 123, Lima, Perú</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">Teléfono</p>
                    <p className="text-gray-600">+51 999 888 777</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">Email</p>
                    <p className="text-gray-600">contacto@gimnasio-juanperez.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-blue-600" />
              Nuestros Servicios
            </CardTitle>
            <CardDescription>Todo lo que necesitas para alcanzar tus metas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {servicios.map((servicio, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-4xl mb-2">{servicio.icono}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{servicio.nombre}</h3>
                  <p className="text-sm text-gray-600">{servicio.descripcion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              Sobre Nosotros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              Fundado por <strong>Juan Pérez</strong>, nuestro gimnasio se ha convertido en el referente 
              de fitness en la ciudad. Con más de 10 años de experiencia, ofrecemos instalaciones de 
              primera clase, equipamiento de última generación y un equipo de profesionales altamente 
              calificados comprometidos con tu bienestar y resultados.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm text-blue-100">Años de experiencia</div>
              </div>
              <div>
                <div className="text-4xl font-bold">1,200+</div>
                <div className="text-sm text-blue-100">Clientes activos</div>
              </div>
              <div>
                <div className="text-4xl font-bold">25+</div>
                <div className="text-sm text-blue-100">Profesionales</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
// ========== SECCIÓN 3: CLIENTES ==========
  if (activeSection === "clientes") {
    return (
      <div className="space-y-6">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Clientes Registrados</CardTitle>
            <CardDescription className="text-lg mt-2">
              Información obtenida desde el microservicio • Total: <span className="font-bold text-blue-600">{clientes.length}</span> clientes
            </CardDescription>
          </CardHeader>

          <CardContent>
            {clientes.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500 font-semibold">No hay clientes registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50">
                      <th className="text-left p-4 font-bold text-gray-800 text-lg">ID</th>
                      <th className="text-left p-4 font-bold text-gray-800 text-lg">Nombre Completo</th>
                      <th className="text-left p-4 font-bold text-gray-800 text-lg">Email</th>
                      <th className="text-left p-4 font-bold text-gray-800 text-lg">Teléfono</th>
                      <th className="text-left p-4 font-bold text-gray-800 text-lg">Membresía</th>
                      <th className="text-left p-4 font-bold text-gray-800 text-lg">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c) => (
                      <tr 
                        key={c.id} 
                        className="border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                      >
                        <td className="p-4 font-bold text-gray-700">{c.id}</td>
                        <td className="p-4">
                          <span className="font-bold text-lg text-gray-800">
                            {c.nombre} {c.apellido}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-base">{c.email}</td>
                        <td className="p-4 text-gray-600 text-base">{c.telefono || 'N/A'}</td>
                        <td className="p-4">
                          <Badge 
                            variant={c.tipoMembresia === 'Premium' ? 'default' : 'secondary'}
                            className="text-base font-semibold px-3 py-1"
                          >
                            {c.tipoMembresia || 'Sin membresía'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={c.activo ? 'default' : 'destructive'}
                            className="text-base font-semibold px-3 py-1"
                          >
                            {c.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>Seleccione una opción del menú</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Use el menú lateral para navegar entre ofertas e información.</p>
        </CardContent>
      </Card>
    </div>
  );
}