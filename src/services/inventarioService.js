import api from './api';

export const inventarioService = {
  // PRODUCTOS
  obtenerTodosLosProductos: async () => {
    return await api.get('/api/inventario/productos');
  },

  obtenerProductoPorId: async (id) => {
    return await api.get(`/api/inventario/productos/${id}`);
  },

  crearProducto: async (producto) => {
    return await api.post('/api/inventario/productos', producto);
  },

  actualizarProducto: async (id, producto) => {
    return await api.put(`/api/inventario/productos/${id}`, producto);
  },

  eliminarProducto: async (id) => {
    return await api.delete(`/api/inventario/productos/${id}`);
  },

  obtenerProductosPorCategoria: async (categoria) => {
    return await api.get(`/api/inventario/productos/categoria/${categoria}`);
  },

  obtenerProductosStockBajo: async () => {
    return await api.get('/api/inventario/productos/stock-bajo');
  },

  obtenerProductosAgotados: async () => {
    return await api.get('/api/inventario/productos/agotados');
  },

  actualizarStock: async (id, cantidad) => {
    return await api.patch(`/api/inventario/productos/${id}/stock`, { cantidad });
  },

  buscarProductos: async (keyword) => {
    return await api.get('/api/inventario/productos/buscar', { params: { keyword } });
  },

  obtenerTopProductos: async (limite = 10) => {
    return await api.get('/api/inventario/productos/top', { params: { limite } });
  },

  // MÁQUINAS
  obtenerTodasLasMaquinas: async () => {
    return await api.get('/api/inventario/maquinas');
  },

  obtenerMaquinaPorId: async (id) => {
    return await api.get(`/api/inventario/maquinas/${id}`);
  },

  crearMaquina: async (maquina) => {
    return await api.post('/api/inventario/maquinas', maquina);
  },

  actualizarMaquina: async (id, maquina) => {
    return await api.put(`/api/inventario/maquinas/${id}`, maquina);
  },

  eliminarMaquina: async (id) => {
    return await api.delete(`/api/inventario/maquinas/${id}`);
  },

  obtenerMaquinasPorZona: async (zona) => {
    return await api.get(`/api/inventario/maquinas/zona/${zona}`);
  },

  obtenerMaquinasPorEstado: async (estado) => {
    return await api.get(`/api/inventario/maquinas/estado/${estado}`);
  },

  cambiarEstadoMaquina: async (id, nuevoEstado) => {
    return await api.patch(`/api/inventario/maquinas/${id}/estado`, { estado: nuevoEstado });
  },

  registrarMantenimiento: async (id, fecha) => {
    return await api.patch(`/api/inventario/maquinas/${id}/mantenimiento`, { fecha });
  },

  buscarMaquinas: async (keyword) => {
    return await api.get('/api/inventario/maquinas/buscar', { params: { keyword } });
  },

  obtenerMantenimientoProximo: async (dias = 30) => {
    return await api.get('/api/inventario/maquinas/mantenimiento-proximo', { params: { dias } });
  },

  // ESTADÍSTICAS
  obtenerEstadisticas: async () => {
    return await api.get('/api/inventario/estadisticas');
  },

  healthCheck: async () => {
    return await api.get('/api/inventario/health');
  }
};