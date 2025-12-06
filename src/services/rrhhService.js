import api from './api';

export const rrhhService = {
  crearPersonal: async (personal) => {
    return await api.post('/api/rrhh/personal', personal);
  },

  obtenerPersonalPorId: async (id) => {
    return await api.get(`/api/rrhh/personal/${id}`);
  },

  obtenerTodoElPersonal: async () => {
    return await api.get('/api/rrhh/personal');
  },

  obtenerPersonalActivo: async () => {
    return await api.get('/api/rrhh/personal/activos');
  },

  obtenerPersonalPorDepartamento: async (departamento) => {
    return await api.get(`/api/rrhh/personal/departamento/${departamento}`);
  },

  obtenerPersonalPorPuesto: async (puesto) => {
    return await api.get(`/api/rrhh/personal/puesto/${puesto}`);
  },

  obtenerPersonalPorEstado: async (estado) => {
    return await api.get(`/api/rrhh/personal/estado/${estado}`);
  },

  actualizarPersonal: async (id, personal) => {
    return await api.put(`/api/rrhh/personal/${id}`, personal);
  },

  eliminarPersonal: async (id) => {
    return await api.delete(`/api/rrhh/personal/${id}`);
  },

  cambiarEstado: async (id, nuevoEstado) => {
    return await api.patch(`/api/rrhh/personal/${id}/estado`, { estado: nuevoEstado });
  },

  buscarPersonal: async (keyword) => {
    return await api.get('/api/rrhh/personal/buscar', { params: { keyword } });
  },

  obtenerEstadisticas: async () => {
    return await api.get('/api/rrhh/estadisticas');
  },

  obtenerContratacionesRecientes: async (meses = 3) => {
    return await api.get('/api/rrhh/personal/recientes', { params: { meses } });
  },

  healthCheck: async () => {
    return await api.get('/api/rrhh/health');
  }
};