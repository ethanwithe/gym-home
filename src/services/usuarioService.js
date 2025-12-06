import api from './api';

export const usuarioService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/users/login', credentials);
      
      if (response.success && response.usuario) {
        localStorage.setItem('user', JSON.stringify(response.usuario));
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return response;
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  crearUsuario: async (usuario) => {
    return await api.post('/api/users', usuario);
  },

  obtenerUsuarioPorId: async (id) => {
    return await api.get(`/api/users/${id}`);
  },

  obtenerUsuarioPorUsername: async (username) => {
    return await api.get(`/api/users/username/${username}`);
  },

  obtenerTodosLosUsuarios: async () => {
    return await api.get('/api/users');
  },

  obtenerUsuariosPorRole: async (role) => {
    return await api.get(`/api/users/role/${role}`);
  },

  obtenerUsuariosActivos: async () => {
    return await api.get('/api/users/activos');
  },

  actualizarUsuario: async (id, usuario) => {
    const response = await api.put(`/api/users/${id}`, usuario);
    
    const currentUser = usuarioService.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      localStorage.setItem('user', JSON.stringify(response));
    }
    
    return response;
  },

  eliminarUsuario: async (id) => {
    return await api.delete(`/api/users/${id}`);
  },

  desactivarUsuario: async (id) => {
    return await api.patch(`/api/users/${id}/desactivar`);
  },

  activarUsuario: async (id) => {
    return await api.patch(`/api/users/${id}/activar`);
  },

  obtenerEstadisticas: async () => {
    return await api.get('/api/users/estadisticas');
  },

  healthCheck: async () => {
    return await api.get('/api/users/health');
  }
};