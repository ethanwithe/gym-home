import api from './api';

export const clienteService = {
  crearCliente: async (cliente) => {
    return await api.post('/api/clientes', cliente);
  },

  obtenerClientePorId: async (id) => {
    return await api.get(`/api/clientes/${id}`);
  },

  obtenerTodosLosClientes: async () => {
    return await api.get('/api/clientes');
  },

  obtenerClientesActivos: async () => {
    return await api.get('/api/clientes/activos');
  },

  obtenerClientesPorMembresia: async (tipo) => {
    return await api.get(`/api/clientes/membresia/${tipo}`);
  },

  obtenerMembresiasPorVencer: async (dias = 30) => {
    return await api.get('/api/clientes/por-vencer', { params: { dias } });
  },

  actualizarCliente: async (id, cliente) => {
    return await api.put(`/api/clientes/${id}`, cliente);
  },

  eliminarCliente: async (id) => {
    return await api.delete(`/api/clientes/${id}`);
  },

  renovarMembresia: async (id, meses) => {
    return await api.post(`/api/clientes/${id}/renovar`, null, { params: { meses } });
  },

  registrarVisita: async (id) => {
    return await api.post(`/api/clientes/${id}/visita`);
  },

  buscarClientes: async (keyword) => {
    return await api.get('/api/clientes/buscar', { params: { keyword } });
  },

  obtenerEstadisticas: async () => {
    return await api.get('/api/clientes/estadisticas');
  },

  obtenerCrecimientoMensual: async () => {
    return await api.get('/api/clientes/crecimiento');
  },

  obtenerTopClientes: async (limite = 10) => {
    return await api.get('/api/clientes/top', { params: { limite } });
  },

  healthCheck: async () => {
    return await api.get('/api/clientes/health');
  }
};
