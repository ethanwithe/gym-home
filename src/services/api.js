import axios from 'axios';

// URL del API Gateway
const API_BASE_URL = 'http://localhost:8080';

// Instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token (si usas autenticación JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
      
      // Manejo específico por código de estado
      switch (error.response.status) {
        case 401:
          // Token expirado o no autorizado
          console.warn('Sesión expirada. Redirigiendo al login...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
          break;
        case 403:
          console.error('Acceso denegado');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error('Error desconocido:', error.response.status);
      }
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      console.error('Error de red - No hay respuesta del servidor:', error.request);
      console.error('Verifique que el API Gateway esté corriendo en:', API_BASE_URL);
    } else {
      // Algo pasó al configurar la petición
      console.error('Error al configurar la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Métodos helper para las peticiones más comunes
export const apiHelpers = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default api;