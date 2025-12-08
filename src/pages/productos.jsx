import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";

import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

import {
  Package,
  AlertTriangle,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Search,
} from "lucide-react";

import { inventarioService } from "../services/inventarioService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const [modo, setModo] = useState(null); // "crear" | "editar"
  const [editID, setEditID] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    descripcion: "",
    estado: "Disponible",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [productos, searchTerm, filtroCategoria]);

  // ===============================
  // CARGAR DATOS
  // ===============================
  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [prodData, statsData] = await Promise.all([
        inventarioService.obtenerTodosLosProductos(),
        inventarioService.obtenerEstadisticas(),
      ]);

      setProductos(prodData.data || []);
      setProductosFiltrados(prodData.data || []);
      setEstadisticas(statsData.data || null);
    } catch (err) {
      alert("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FILTRAR
  // ===============================
  const filtrarProductos = () => {
    let filtrados = [...productos];

    if (searchTerm) {
      filtrados = filtrados.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtroCategoria !== "Todas") {
      filtrados = filtrados.filter((p) => p.categoria === filtroCategoria);
    }

    setProductosFiltrados(filtrados);
  };

  const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];

  // ===============================
  // CRUD — CREAR
  // ===============================
  const crearProducto = async () => {
    try {
      await inventarioService.crearProducto({
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
      });

      await cargarDatos();
      cancelar();
    } catch (err) {
      console.error(err);
      alert("Error creando producto");
    }
  };

  // ===============================
  // CRUD — EDITAR
  // ===============================
  const iniciarEdicion = (p) => {
    setModo("editar");
    setEditID(p.id);

    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
      descripcion: p.descripcion || "",
      estado: p.estado,
    });
  };

  const actualizarProducto = async () => {
    try {
      await inventarioService.actualizarProducto(editID, {
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
      });

      await cargarDatos();
      cancelar();
    } catch (err) {
      console.error(err);
      alert("Error actualizando producto");
    }
  };

  // ===============================
  // CRUD — ELIMINAR
  // ===============================
  const eliminarProducto = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;

    try {
      await inventarioService.eliminarProducto(id);
      await cargarDatos();
    } catch (err) {
      alert("Error eliminando producto");
    }
  };

  // ===============================
  // CANCELAR FORMULARIO
  // ===============================
  const cancelar = () => {
    setModo(null);
    setEditID(null);
    setForm({
      nombre: "",
      categoria: "",
      precio: "",
      stock: "",
      descripcion: "",
      estado: "Disponible",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="space-y-6">
      {/* ===============================
          ESTADISTICAS
      =============================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-600 text-white">
          <CardHeader>
            <CardTitle>Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {estadisticas?.totalProductos || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-600 text-white">
          <CardHeader>
            <CardTitle>Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              S/ {estadisticas?.valorTotal?.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-600 text-white">
          <CardHeader>
            <CardTitle>Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {estadisticas?.productosStockBajo}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-600 text-white">
          <CardHeader>
            <CardTitle>Ventas del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              S/ {estadisticas?.ventasMes?.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===============================
          FILTROS
      =============================== */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border px-3 py-2 rounded"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            {categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* ===============================
          FORMULARIO CREAR / EDITAR
      =============================== */}
      {modo && (
        <Card className="border-2 border-blue-500 p-4">
          <CardTitle className="mb-3">
            {modo === "crear" ? "Registrar Producto" : "Editar Producto"}
          </CardTitle>

          <div className="grid md:grid-cols-3 gap-3">
            <Input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            <Input
              placeholder="Categoría"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <Input
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
            <select
              className="border px-3 py-2 rounded"
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              <option>Disponible</option>
              <option>Agotado</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="destructive" onClick={cancelar}>
              Cancelar
            </Button>

            {modo === "crear" ? (
              <Button onClick={crearProducto}>Crear</Button>
            ) : (
              <Button onClick={actualizarProducto}>Actualizar</Button>
            )}
          </div>
        </Card>
      )}

      {/* ===============================
          TABLA PRINCIPAL
      =============================== */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex gap-2 items-center">
            <Package className="w-5 h-5 text-blue-600" />
            Inventario de Productos
          </CardTitle>

          <Button className="flex items-center gap-2" onClick={() => setModo("crear")}>
            <Plus className="w-4 h-4" /> Nuevo Producto
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {productosFiltrados.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell className="text-right">
                    S/ {p.precio?.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">{p.stock}</TableCell>
                  <TableCell>
                    <Badge variant={p.estado === "Disponible" ? "default" : "destructive"}>
                      {p.estado}
                    </Badge>
                  </TableCell>

                  {/* ACCIONES */}
                  <TableCell className="flex gap-2 justify-center">
                    <Button size="sm" onClick={() => iniciarEdicion(p)}>
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => eliminarProducto(p.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* ===============================
          ALERTAS
      =============================== */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* STOCK BAJO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-red-600 w-5 h-5" />
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {productos
              .filter((p) => p.stock < 10)
              .slice(0, 5)
              .map((p) => (
                <div key={p.id} className="p-3 bg-red-100 rounded flex justify-between">
                  <span>{p.nombre}</span>
                  <Badge variant="destructive">Urgente</Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* MÁS VENDIDOS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-green-600" />
              Más Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {productos
              .sort((a, b) => (b.ventas || 0) - (a.ventas || 0))
              .slice(0, 5)
              .map((p, i) => (
                <div key={p.id} className="p-3 bg-green-100 rounded flex justify-between">
                  <span>
                    {i + 1}. {p.nombre}
                  </span>
                  <strong>S/ {(p.precio * (p.ventas || 0)).toFixed(2)}</strong>
                </div>
              ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
