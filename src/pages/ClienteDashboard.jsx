import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tag, Clock, MapPin, Phone, Mail, Dumbbell, AlertCircle, Award,
  User, ShoppingCart, Edit, Trash2, LogOut, Menu, X, Package, CreditCard
} from 'lucide-react';

// --- SIMULACIÓN DE COMPONENTES FALTANTES ---
const Dialog = ({ open, onOpenChange, children }) => open ? <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => onOpenChange(false)}><div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>{children}</div></div> : null;
const DialogContent = ({ children }) => children;
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children, className }) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
const DialogDescription = ({ children }) => <p className="text-sm text-gray-500">{children}</p>;
const Label = ({ children }) => <label className="text-sm font-medium block mb-1">{children}</label>;
const Select = ({ value, onValueChange, children }) => <select value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full p-2 border rounded">{children}</select>;
const SelectTrigger = ({ children }) => children;
const SelectValue = ({ children }) => children;
const SelectContent = ({ children }) => children;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
const Separator = () => <hr className="my-4 border-gray-200" />;

const clienteService = {
  actualizarCliente: async (id, data) => { console.log(`Simulando actualización de cliente ${id} con datos:`, data); return { status: 200 }; },
  eliminarCliente: async (id) => { console.log(`Simulando eliminación de cliente ${id}`); return { status: 200 }; }
};

export default function ClienteDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('ofertas');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cliente, setCliente] = useState(user || { id: 1, nombre: 'Usuario Demo', email: 'demo@example.com', telefono: '987654321', direccion: 'Av. Ficticia 123' });
  const [editMode, setEditMode] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({ ...cliente });
  const [pagoData, setPagoData] = useState({ metodo: 'tarjeta', numero: '', nombre: '', vencimiento: '', cvv: '', monto: 0 });
  const [boleta, setBoleta] = useState(null);
  const [detalleItem, setDetalleItem] = useState(null);

  // Clases simuladas con descripciones mejoradas e imágenes de gimnasio reales
  const [clases, setClases] = useState([
    { id: 1, nombre: 'Rutina Completa Fitness', nivel: 'Principiante', descripcion: 'Clase completa de fitness diseñada especialmente para principiantes. Combina ejercicios de fuerza, cardio y movilidad en una sesión balanceada. Aprenderás las técnicas correctas, mejorarás tu resistencia y ganarás confianza. Incluye calentamiento, circuito principal y estiramientos finales. ¡El punto de partida perfecto para tu transformación!', precio: 40, duracion: '60 min', instructor: 'Ana García', horario: 'Lun-Mié-Vie 7:00 AM', capacidad: '15 personas', imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop' },
    { id: 2, nombre: 'Cardio Intenso', nivel: 'Intermedio', descripcion: 'Entrenamiento cardiovascular de alta intensidad diseñado para quemar calorías y acelerar tu metabolismo. Combina intervalos de alta y baja intensidad con ejercicios dinámicos. Mejora tu resistencia aeróbica y anaeróbica mientras tonificas todo el cuerpo. Ideal para quienes buscan resultados rápidos y desafiantes.', precio: 35, duracion: '45 min', instructor: 'Carlos Pérez', horario: 'Mar-Jue 6:30 PM', capacidad: '20 personas', imagen: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop' },
    { id: 3, nombre: 'Yoga y Flexibilidad', nivel: 'Principiante', descripcion: 'Experimenta el equilibrio perfecto entre mente y cuerpo con nuestra clase de yoga. Enfocada en mejorar la flexibilidad, reducir el estrés y fortalecer la conexión mente-cuerpo. Incluye posturas de yoga clásicas, respiración consciente y meditación guiada. Perfecta para todos los niveles que buscan paz interior y bienestar físico.', precio: 30, duracion: '75 min', instructor: 'Elena Ruiz', horario: 'Lun-Mié-Vie 9:00 AM', capacidad: '12 personas', imagen: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop' },
    { id: 4, nombre: 'HIIT Avanzado', nivel: 'Avanzado', descripcion: 'La máxima expresión del entrenamiento de intervalos de alta intensidad. Solo para atletas experimentados que buscan llevar su condición física al límite. Ejercicios explosivos, mínimos descansos, máximos resultados. Quema hasta 500 calorías en 30 minutos. Requiere excelente forma física y técnica depurada. ¿Estás listo para el desafío?', precio: 50, duracion: '30 min', instructor: 'Javier Soto', horario: 'Mar-Jue-Sáb 6:00 AM', capacidad: '10 personas', imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=400&fit=crop' },
    { id: 5, nombre: 'Entrenamiento de Fuerza', nivel: 'Intermedio', descripcion: 'Desarrolla músculo y potencia con nuestro programa especializado de entrenamiento de fuerza. Utilizando pesas libres, barras y tu propio peso corporal, trabajarás todos los grupos musculares principales. Aprende técnicas de levantamiento seguras y efectivas. Progresiones personalizadas y seguimiento de cargas. Ideal para ganar masa muscular y aumentar tu fuerza funcional.', precio: 45, duracion: '60 min', instructor: 'Ana García', horario: 'Lun-Mié-Vie 5:30 PM', capacidad: '12 personas', imagen: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=400&fit=crop' },
    { id: 6, nombre: 'Pilates Mat', nivel: 'Principiante', descripcion: 'Descubre el método Pilates sobre colchoneta, enfocado en fortalecer el core, mejorar la postura y desarrollar músculos largos y flexibles. Movimientos controlados y precisos que trabajan la estabilidad y el equilibrio. Excelente para prevenir lesiones, rehabilitación y mejorar la consciencia corporal. Una clase que transforma desde adentro hacia afuera.', precio: 32, duracion: '50 min', instructor: 'Elena Ruiz', horario: 'Mar-Jue 10:00 AM', capacidad: '15 personas', imagen: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop' },
    { id: 7, nombre: 'Spinning Extremo', nivel: 'Intermedio', descripcion: 'Pedalea hacia tus objetivos en nuestra clase de spinning de alta energía. Simulaciones de terreno, sprints y escaladas al ritmo de música motivadora. Quema grasa, fortalece piernas y mejora tu resistencia cardiovascular. Cada clase es una aventura diferente con métricas en tiempo real para seguir tu progreso.', precio: 38, duracion: '50 min', instructor: 'Carlos Pérez', horario: 'Lun-Mié-Vie 6:00 PM', capacidad: '25 personas', imagen: 'https://images.unsplash.com/photo-1558017487-06bf9f82613a?w=800&h=400&fit=crop' },
    { id: 8, nombre: 'Funcional CrossFit', nivel: 'Avanzado', descripcion: 'Entrenamiento funcional de alta intensidad inspirado en CrossFit. Combina gimnasia, levantamiento olímpico y ejercicios metabólicos. WODs (Workout of the Day) diferentes cada sesión para mantener tu cuerpo en constante adaptación. Desarrolla fuerza, velocidad, resistencia y agilidad. Para atletas que buscan rendimiento integral.', precio: 55, duracion: '60 min', instructor: 'Javier Soto', horario: 'Mar-Jue-Sáb 7:00 AM', capacidad: '15 personas', imagen: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&h=400&fit=crop' },
  ]);

  // Cargar productos desde API
  useEffect(() => {
    if (activeSection === 'productos') {
      cargarProductos();
    }
  }, [activeSection]);

  const cargarProductos = async () => {
    try {
      const response = await fetch('https://api-gateway-production-be01.up.railway.app/api/inventario/productos');
      const data = await response.json();
      setProductos(data || []);
    } catch (err) {
      console.error('Error cargando productos:', err);
      // Fallback con datos de ejemplo en caso de error
      setProductos([
        { id: 101, nombre: 'Proteína Whey 2kg', categoria: 'Suplementos', descripcion: 'Proteína de suero de leche de alta calidad.', precio: 150.00, stock: 10, imagen: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=300&fit=crop' },
        { id: 102, nombre: 'Creatina Monohidrato 500g', categoria: 'Suplementos', descripcion: 'Mejora el rendimiento y la fuerza muscular.', precio: 80.00, stock: 5, imagen: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop' },
        { id: 103, nombre: 'Guantes de Entrenamiento', categoria: 'Accesorios', descripcion: 'Guantes resistentes para levantamiento de pesas.', precio: 45.00, stock: 20, imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop' },
      ]);
    }
  };

  // Actualizar perfil
  const handleEditProfile = async () => {
    try {
      const { id, ...dataToUpdate } = formData;
      await clienteService.actualizarCliente(cliente.id, dataToUpdate);
      setCliente(formData);
      localStorage.setItem('user', JSON.stringify(formData));
      setEditMode(false);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
    }
  };

  // Eliminar cuenta
  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        await clienteService.eliminarCliente(cliente.id);
        onLogout();
      } catch (err) {
        console.error('Error eliminando cuenta:', err);
      }
    }
  };

  // Carrito
  const agregarAlCarrito = (item) => {
    const existe = carrito.find(i => i.id === item.id && i.tipo === item.tipo);
    if (existe) {
      setCarrito(carrito.map(i =>
        i.id === item.id && i.tipo === item.tipo ? { ...i, cantidad: (i.cantidad || 1) + 1 } : i
      ));
    } else {
      setCarrito([...carrito, { ...item, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id, tipo) => {
    setCarrito(carrito.filter(item => !(item.id === id && item.tipo === tipo)));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
  };

  const handlePagar = () => {
    if (!pagoData.metodo) return alert('Selecciona un método de pago');
    if (pagoData.metodo === 'tarjeta' && (!pagoData.numero || !pagoData.nombre || !pagoData.vencimiento || !pagoData.cvv)) {
      return alert('Completa los datos de tu tarjeta');
    }
    const boletaGenerada = {
      cliente: cliente.nombre,
      fecha: new Date().toLocaleString('es-PE'),
      items: carrito,
      total: calcularTotal(),
      metodo: pagoData.metodo
    };
    setBoleta(boletaGenerada);
    setCarrito([]);
    setActiveSection('boleta');
  };

  // Ofertas mejoradas con imágenes de gimnasio reales
  const ofertas = [
    { id: 1, titulo: 'Membresía Anual Premium - 30% OFF', descripcion: '¡La oferta del año! Obtén acceso ilimitado a todas nuestras clases grupales, gimnasio equipado 24/7, área de spa y sauna, clases magistrales con instructores internacionales y asesoría nutricional incluida. 12 meses de transformación garantizada con el mejor precio del mercado. Incluye: toalla de cortesía, locker personal, 2 invitaciones mensuales para amigos y descuentos especiales en productos. ¡No dejes pasar esta oportunidad única!', precio: 1200, precioAnterior: 1714, descuento: '30%', vigencia: '31 de Diciembre 2025', destacado: true, beneficios: ['Acceso 24/7', 'Todas las clases', 'Spa y Sauna', 'Asesoría nutricional'], imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop' },
    { id: 2, titulo: 'Pack Proteína + Creatina Premium', descripcion: 'El combo perfecto para maximizar tus resultados. Proteína Whey de suero aislado 2kg (sabor chocolate) con 25g de proteína por porción, baja en carbohidratos y grasas. Más Creatina Monohidrato micronizada 500g de grado farmacéutico para aumentar fuerza y volumen muscular. Ambos productos son de las marcas más reconocidas del mercado. Ideal para recuperación post-entreno y desarrollo muscular acelerado. ¡Ahorra S/25 comprando el pack!', precio: 120, precioAnterior: 145, descuento: '17%', vigencia: '30 de Noviembre 2025', destacado: false, beneficios: ['Proteína premium', 'Creatina micronizada', 'Envío gratis'], imagen: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&h=400&fit=crop' },
    { id: 3, titulo: 'Clase de Prueba Gratis + Tour', descripcion: '¡Conoce nuestras instalaciones sin compromiso! Incluye una clase grupal de tu elección, tour completo por todas nuestras áreas (gimnasio, zona funcional, spa, vestuarios VIP), prueba de composición corporal con InBody, sesión de evaluación física con entrenador certificado y plan de entrenamiento personalizado de regalo. Además, recibe un batido energético de cortesía. ¡Ven y experimenta la diferencia de entrenar con los mejores!', precio: 0, precioAnterior: 40, descuento: '100%', vigencia: '31 de Enero 2026', destacado: false, beneficios: ['Evaluación gratis', 'Tour personalizado', 'Batido de regalo'], imagen: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=400&fit=crop' },
    { id: 4, titulo: 'Pack 10 Clases Grupales', descripcion: 'Flexibilidad total para tu entrenamiento. Adquiere un paquete de 10 clases grupales válidas por 2 meses para usar en cualquiera de nuestras disciplinas: Spinning, Yoga, Pilates, HIIT, CrossFit, Zumba o Entrenamiento Funcional. Perfectas para quienes tienen horarios variables. Sin fecha específica, tú decides cuándo entrenar. Ahorra 25% vs precio individual. Incluye reserva prioritaria en clases populares.', precio: 280, precioAnterior: 373, descuento: '25%', vigencia: '15 de Enero 2026', destacado: true, beneficios: ['10 clases', 'Válido 2 meses', 'Sin horario fijo', 'Reserva prioritaria'], imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop' },
    { id: 5, titulo: 'Mes Ilimitado de Yoga', descripcion: 'Sumerge tu mente y cuerpo en la práctica del yoga con acceso ilimitado durante 30 días. Incluye todas las modalidades: Hatha, Vinyasa, Yin, Yoga restaurativo y meditación guiada. Clases en diferentes horarios de mañana, tarde y noche. Recibe tu propio mat de yoga premium de regalo (valor S/80). Ideal para reducir estrés, mejorar flexibilidad y encontrar balance interior. Instructores certificados internacionalmente.', precio: 150, precioAnterior: 200, descuento: '25%', vigencia: '20 de Diciembre 2025', destacado: false, beneficios: ['Clases ilimitadas', 'Mat de regalo', 'Todas las modalidades'], imagen: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop' },
    { id: 6, titulo: 'Entrenamiento Personal 5 Sesiones', descripcion: 'Transforma tu cuerpo con atención personalizada uno a uno. Incluye 5 sesiones de 60 minutos con entrenador personal certificado, evaluación física inicial y final, plan de entrenamiento personalizado según tus objetivos, seguimiento nutricional básico y acceso al área de entrenamiento funcional. Perfecto para principiantes que necesitan guía o avanzados buscando romper mesetas. Resultados garantizados o te devolvemos tu dinero.', precio: 350, precioAnterior: 450, descuento: '22%', vigencia: '31 de Diciembre 2025', destacado: true, beneficios: ['5 sesiones 1-a-1', 'Plan personalizado', 'Garantía de resultados'], imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=400&fit=crop' },
  ];

  // Función para mostrar detalles en el modal
  const mostrarDetalles = (item) => {
    setDetalleItem(item);
  };

  const cerrarDetalles = () => {
    setDetalleItem(null);
  };

  // Modal de detalles mejorado
  const renderDetalleModal = () => {
    if (!detalleItem) return null;

    return (
      <Dialog open={!!detalleItem} onOpenChange={cerrarDetalles}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">{detalleItem.titulo || detalleItem.nombre}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {detalleItem.imagen && <img src={detalleItem.imagen} alt={detalleItem.nombre} className="w-full h-64 object-cover rounded-lg shadow-md" />}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{detalleItem.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Precio</p>
                <p className="text-2xl font-bold text-blue-600">S/ {detalleItem.precio?.toFixed(2) || detalleItem.precio}</p>
                {detalleItem.precioAnterior && (
                  <p className="text-sm text-gray-500 line-through">S/ {detalleItem.precioAnterior}</p>
                )}
              </div>
              
              {detalleItem.descuento && (
                <div className="bg-red-50 p-3 rounded-lg flex items-center justify-center">
                  <Badge className="bg-red-500 text-white text-xl p-2">{detalleItem.descuento} OFF</Badge>
                </div>
              )}
            </div>

            {detalleItem.nivel && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Nivel:</span>
                <Badge variant="secondary" className="text-base">{detalleItem.nivel}</Badge>
              </div>
            )}
            
            {detalleItem.duracion && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700"><strong>Duración:</strong> {detalleItem.duracion}</span>
              </div>
            )}
            
            {detalleItem.instructor && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700"><strong>Instructor:</strong> {detalleItem.instructor}</span>
              </div>
            )}

            {detalleItem.horario && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <span className="text-gray-700"><strong>Horarios disponibles:</strong> {detalleItem.horario}</span>
              </div>
            )}

            {detalleItem.capacidad && (
              <div className="flex items-center gap-2">
                <span className="text-gray-700"><strong>Capacidad:</strong> {detalleItem.capacidad}</span>
              </div>
            )}
            
            {detalleItem.vigencia && (
              <div className="bg-orange-50 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700"><strong>Válido hasta:</strong> {detalleItem.vigencia}</span>
              </div>
            )}
            
            {detalleItem.stock !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-gray-700"><strong>Stock disponible:</strong></span>
                <Badge variant={detalleItem.stock > 5 ? 'default' : 'destructive'}>{detalleItem.stock} unidades</Badge>
              </div>
            )}
            
            {detalleItem.categoria && (
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700"><strong>Categoría:</strong> {detalleItem.categoria}</span>
              </div>
            )}

            {detalleItem.beneficios && detalleItem.beneficios.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Beneficios Incluidos:
                </p>
                <ul className="space-y-1 ml-7">
                  {detalleItem.beneficios.map((beneficio, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center gap-2">
                      <span className="text-green-600">✓</span> {beneficio}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => {
                agregarAlCarrito({ ...detalleItem, tipo: detalleItem.tipo || (detalleItem.titulo ? 'oferta' : detalleItem.categoria ? 'producto' : 'clase') });
                cerrarDetalles();
              }} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar al Carrito
            </Button>
            <Button onClick={cerrarDetalles} variant="outline" className="flex-1">Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderContent = () => {
    // 1. Perfil
    if (activeSection === 'perfil') {
      return (
        <Card className="shadow-lg border-t-4 border-blue-600 max-w-4xl mx-auto">
          <CardHeader className="flex flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl"><User className="w-7 h-7 text-blue-600" /> Mi Perfil</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Gestiona tu información personal</p>
            </div>
            {!editMode && (
              <Button onClick={() => setEditMode(true)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Edit className="w-4 h-4" /> Editar Perfil
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {editMode ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(formData)
                    .filter(key => key !== 'id')
                    .map(key => (
                      <div key={key} className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-2">
                          {key === 'nombre' && <User className="w-4 h-4 text-gray-500" />}
                          {key === 'email' && <Mail className="w-4 h-4 text-gray-500" />}
                          {key === 'telefono' && <Phone className="w-4 h-4 text-gray-500" />}
                          {key === 'direccion' && <MapPin className="w-4 h-4 text-gray-500" />}
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Label>
                        <Input 
                          value={formData[key]} 
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder={`Ingresa tu ${key}`}
                        />
                      </div>
                    ))}
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Button onClick={handleEditProfile} className="bg-blue-600 hover:bg-blue-700 flex-1 py-6 text-base font-semibold">
                    <Award className="w-5 h-5 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button onClick={() => setEditMode(false)} variant="outline" className="flex-1 py-6 text-base">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(cliente)
                    .filter(key => key !== 'id')
                    .map(key => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          {key === 'nombre' && <User className="w-5 h-5 text-blue-600" />}
                          {key === 'email' && <Mail className="w-5 h-5 text-blue-600" />}
                          {key === 'telefono' && <Phone className="w-5 h-5 text-blue-600" />}
                          {key === 'direccion' && <MapPin className="w-5 h-5 text-blue-600" />}
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            {key}
                          </p>
                        </div>
                        <p className="text-lg font-medium text-gray-900">{cliente[key]}</p>
                      </div>
                    ))}
                </div>
                <Separator />
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Zona de Peligro</h3>
                  <p className="text-sm text-red-700 mb-4">Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.</p>
                  <Button 
                    onClick={handleDeleteAccount} 
                    variant="destructive" 
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" /> 
                    Eliminar Cuenta Permanentemente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    // 2. Productos
    if (activeSection === 'productos') {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Tienda de Productos</h2>
            <p className="text-gray-600">Suplementos y accesorios para potenciar tu entrenamiento</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <Card key={producto.id} className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img 
                  src={producto.imagen || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=300&fit=crop'} 
                  alt={producto.nombre} 
                  className="w-full h-48 object-cover rounded-t-lg" 
                />
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">{producto.nombre}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Tag className="inline w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-600">{producto.categoria}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{producto.descripcion}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Precio</p>
                      <p className="font-bold text-2xl text-green-600">S/ {producto.precio.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Stock</p>
                      <Badge variant={producto.stock > 5 ? 'default' : 'destructive'} className="text-sm">
                        {producto.stock} unidades
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => agregarAlCarrito({ ...producto, tipo: 'producto' })} 
                      disabled={producto.stock === 0} 
                      className="bg-blue-600 hover:bg-blue-700 flex-1 font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" /> 
                      Agregar
                    </Button>
                    <Button variant="outline" onClick={() => mostrarDetalles(producto)} className="px-4 border-2">
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      );
    }

    // 3. Clases
    if (activeSection === 'clases') {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Nuestras Clases</h2>
            <p className="text-gray-600">Encuentra la clase perfecta para tus objetivos y nivel de experiencia</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clases.map(clase => (
              <Card key={clase.id} className="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img src={clase.imagen || 'https://picsum.photos/seed/clase/400/200'} alt={clase.nombre} className="w-full h-52 object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur text-gray-800 font-semibold px-3 py-1">
                      {clase.nivel}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl line-clamp-1">{clase.nombre}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Dumbbell className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{clase.instructor}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 min-h-[60px]">{clase.descripcion}</p>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3" />
                      {clase.duracion}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <User className="w-3 h-3" />
                      {clase.capacidad}
                    </Badge>
                  </div>

                  {clase.horario && (
                    <div className="bg-blue-50 p-2 rounded text-xs text-gray-700">
                      <strong>Horarios:</strong> {clase.horario}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <p className="text-xs text-gray-500">Precio por clase</p>
                      <p className="font-bold text-2xl text-blue-600">S/ {clase.precio}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => agregarAlCarrito({ ...clase, tipo: 'clase' })} 
                      className="bg-blue-600 hover:bg-blue-700 flex-1 font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Inscribirse
                    </Button>
                    <Button variant="outline" onClick={() => mostrarDetalles(clase)} className="px-4 border-2">
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      );
    }

    // 4. Carrito y Pasarela de Pago
    if (activeSection === 'carrito') {
      const total = calcularTotal();
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><ShoppingCart className="w-6 h-6 text-blue-600" /> Resumen del Carrito ({carrito.length})</CardTitle></CardHeader>
            <CardContent>
              {carrito.length === 0 ? <p className="text-gray-500">Tu carrito está vacío. ¡Añade clases u ofertas!</p> : (
                <div className="space-y-4">
                  {carrito.map(item => (
                    <div key={item.id + item.tipo} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-semibold">{item.nombre}</p>
                          <p className="text-sm text-gray-500">{item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)} | Cantidad: {item.cantidad}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                        <Button size="sm" variant="ghost" onClick={() => eliminarDelCarrito(item.id, item.tipo)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total a Pagar:</span>
                    <span className="text-blue-600">S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><CreditCard className="w-6 h-6 text-blue-600" /> Pasarela de Pago</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Selecciona Método de Pago</Label>
                <Select value={pagoData.metodo} onValueChange={(value) => setPagoData({ ...pagoData, metodo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                    <SelectItem value="yape">Yape</SelectItem>
                    <SelectItem value="plin">Plin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {pagoData.metodo === 'tarjeta' && (
                <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold">Detalles de Tarjeta</h4>
                  <Input placeholder="Número de tarjeta" value={pagoData.numero} onChange={(e) => setPagoData({ ...pagoData, numero: e.target.value })} />
                  <Input placeholder="Nombre en la tarjeta" value={pagoData.nombre} onChange={(e) => setPagoData({ ...pagoData, nombre: e.target.value })} />
                  <div className="flex gap-2">
                    <Input placeholder="Vencimiento MM/AA" value={pagoData.vencimiento} onChange={(e) => setPagoData({ ...pagoData, vencimiento: e.target.value })} />
                    <Input placeholder="CVV" value={pagoData.cvv} onChange={(e) => setPagoData({ ...pagoData, cvv: e.target.value })} />
                  </div>
                </div>
              )}

              {(pagoData.metodo === 'yape' || pagoData.metodo === 'plin') && (
                <div className="space-y-3 p-3 border rounded-lg bg-yellow-50">
                  <h4 className="font-semibold">Pago con {pagoData.metodo}</h4>
                  <p className="text-sm text-gray-700">Por favor, escanea el código QR o transfiere S/ {total.toFixed(2)} al número 999 888 777. Una vez realizado, haz clic en "Confirmar Pago".</p>
                  <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">QR Code Simulado</div>
                </div>
              )}

              <Button onClick={handlePagar} className="mt-4 w-full bg-green-600 hover:bg-green-700" disabled={carrito.length === 0}>
                Pagar S/ {total.toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // 5. Boleta
    if (activeSection === 'boleta' && boleta) {
      return (
        <Card className="shadow-lg border-t-4 border-green-600 max-w-2xl mx-auto">
          <CardHeader><CardTitle className="flex items-center gap-2 text-xl text-green-600"><Award className="w-6 h-6" /> Transacción Exitosa</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-semibold">Boleta de Pago</p>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <p><strong>Cliente:</strong> {boleta.cliente}</p>
              <p><strong>Fecha:</strong> {boleta.fecha}</p>
              <p><strong>Método de Pago:</strong> {boleta.metodo}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="font-semibold">Detalle de Items:</p>
              {boleta.items.map(item => (
                <div key={item.id + item.tipo} className="flex justify-between text-sm text-gray-600">
                  <span>{item.nombre} x {item.cantidad} ({item.tipo})</span>
                  <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl text-green-700">
              <span>Total Pagado:</span>
              <span>S/ {boleta.total.toFixed(2)}</span>
            </div>
            <Button onClick={() => setActiveSection('ofertas')} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Volver a Ofertas</Button>
          </CardContent>
        </Card>
      );
    }

    // 6. Ofertas (Por defecto)
    return (
      <>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Ofertas Destacadas</h2>
          <p className="text-gray-600">Aprovecha nuestras promociones exclusivas y ahorra en tus entrenamientos</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertas.map(oferta => (
            <Card key={oferta.id} className={`shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${oferta.destacado ? 'border-2 border-yellow-400 relative' : ''}`}>
              {oferta.destacado && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 shadow-lg">
                    ⭐ MÁS POPULAR
                  </Badge>
                </div>
              )}
              <div className="relative">
                <img src={oferta.imagen || 'https://picsum.photos/seed/oferta/400/200'} alt={oferta.titulo} className="w-full h-52 object-cover" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white text-lg px-4 py-2 shadow-lg font-bold">
                    {oferta.descuento} OFF
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl line-clamp-2 min-h-[56px]">{oferta.titulo}</CardTitle>
                <div className="flex items-center gap-1 text-orange-600 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4" /> 
                  <span>¡Oferta por tiempo limitado!</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[60px]">{oferta.descripcion}</p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Precio anterior</p>
                      <p className="text-lg text-gray-500 line-through">S/ {oferta.precioAnterior}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-1">Ahora solo</p>
                      <p className="font-black text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        S/ {oferta.precio}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-semibold text-green-600">
                      ¡Ahorras S/ {(oferta.precioAnterior - oferta.precio).toFixed(2)}!
                    </p>
                  </div>
                </div>

                {oferta.beneficios && oferta.beneficios.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Incluye:</p>
                    <div className="flex flex-wrap gap-1">
                      {oferta.beneficios.slice(0, 3).map((beneficio, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          ✓ {beneficio}
                        </Badge>
                      ))}
                      {oferta.beneficios.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{oferta.beneficios.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-orange-50 p-2 rounded">
                  <Clock className="w-4 h-4 text-orange-600" /> 
                  <span className="font-medium">Válido hasta: {oferta.vigencia}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => agregarAlCarrito({ ...oferta, tipo: 'oferta', precio: oferta.precio })} 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-1 font-semibold shadow-md"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" /> 
                    Comprar Ahora
                  </Button>
                  <Button variant="outline" onClick={() => mostrarDetalles(oferta)} className="px-4 border-2 hover:bg-gray-50">
                    <AlertCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  };

  const NavItem = ({ section, icon: Icon, label }) => (
    <Button
      variant={activeSection === section ? 'default' : 'ghost'}
      className={`w-full justify-start text-left flex items-center gap-2 ${activeSection === section ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
      onClick={() => {
        setActiveSection(section);
        if (!sidebarOpen) setSidebarOpen(false);
      }}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64 p-4' : 'w-0 p-0 overflow-hidden'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Fitness App</h1>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </Button>
        </div>
        <nav className="space-y-2">
          <NavItem section="ofertas" icon={Tag} label="Ofertas" />
          <NavItem section="clases" icon={Dumbbell} label="Clases" />
          <NavItem section="productos" icon={Package} label="Productos" />
          <Separator />
          <NavItem section="carrito" icon={ShoppingCart} label={`Carrito (${carrito.length})`} />
          <NavItem section="perfil" icon={User} label="Mi Perfil" />
          <Button onClick={onLogout} className="w-full justify-start text-left flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600" variant="ghost">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </Button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <header className="flex justify-between items-center mb-8">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className={`lg:hidden ${sidebarOpen ? 'hidden' : 'block'}`}>
            <Menu className="w-6 h-6" />
          </Button>
          <h2 className="text-3xl font-extrabold text-gray-900 capitalize">{activeSection}</h2>
          <div className="flex items-center gap-4">
            <p className="text-gray-600">Hola, <span className="font-semibold">{cliente.nombre}</span></p>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {cliente.nombre ? cliente.nombre[0] : 'U'}
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {renderDetalleModal()}
    </div>
  );
}