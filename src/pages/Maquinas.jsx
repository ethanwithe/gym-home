import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table.jsx";

import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

import {
  Dumbbell,
  Wrench,
  AlertCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";

import { inventarioService } from "../services/inventarioService";

export default function Maquinas() {

  // ========================
  // ESTADOS
  // ========================
  const [maquinas, setMaquinas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [modo, setModo] = useState(null);        // "crear" | "editar"
  const [editID, setEditID] = useState(null);

  // Formulario de máquina
  const [form, setForm] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    zona: "",
    estado: "Operativa",
    descripcion: "",
    numeroSerie: "",
    fechaAdquisicion: ""
  });

  // ========================
  // CARGA INICIAL
  // ========================
  useEffect(() => {
    cargarMaquinas();
  }, []);

  const cargarMaquinas = async () => {
    try {
      setLoading(true);
      const resp = await inventarioService.obtenerTodasLasMaquinas();
      setMaquinas(resp.data || []);
    } catch (err) {
      console.error("Error cargando máquinas:", err);
      alert("Error cargando máquinas del servidor");
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // CRUD — CREAR
  // ========================
  const crearMaquina = async () => {
    try {
      if (!form.nombre || !form.zona) {
        alert("Nombre y zona son obligatorios");
        return;
      }

      const resp = await inventarioService.crearMaquina(form);

      console.log("Máquina creada:", resp.data);
      await cargarMaquinas();

      cancelar();
    } catch (err) {
      console.error("Error creando máquina:", err);
      alert("Error creando máquina");
    }
  };

  // ========================
  // CRUD — EDITAR
  // ========================
  const iniciarEdicion = (m) => {
    setModo("editar");
    setEditID(m.id);

    setForm({
      nombre: m.nombre,
      marca: m.marca,
      modelo: m.modelo,
      zona: m.zona,
      estado: m.estado,
      descripcion: m.descripcion || "",
      numeroSerie: m.numeroSerie || "",
      fechaAdquisicion: m.fechaAdquisicion
        ? m.fechaAdquisicion.split("T")[0]
        : ""
    });
  };

  const actualizarMaquina = async () => {
    try {
      const resp = await inventarioService.actualizarMaquina(editID, form);

      console.log("Máquina actualizada:", resp.data);
      await cargarMaquinas();

      cancelar();
    } catch (err) {
      console.error("Error actualizando máquina:", err);
      alert("Error actualizando máquina");
    }
  };

  // ========================
  // CRUD — ELIMINAR
  // ========================
  const eliminarMaquina = async (id) => {
    if (!confirm("¿Eliminar esta máquina?")) return;

    try {
      await inventarioService.eliminarMaquina(id);
      await cargarMaquinas();
    } catch (err) {
      console.error("Error eliminando máquina:", err);
      alert("Error eliminando máquina");
    }
  };

  // ========================
  // ACTUALIZAR ESTADO
  // ========================
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await inventarioService.cambiarEstadoMaquina(id, nuevoEstado);
      cargarMaquinas();
    } catch (err) {
      alert("Error cambiando estado");
    }
  };

  // ========================
  // CANCELAR FORMULARIO
  // ========================
  const cancelar = () => {
    setModo(null);
    setEditID(null);
    setForm({
      nombre: "",
      marca: "",
      modelo: "",
      zona: "",
      estado: "Operativa",
      descripcion: "",
      numeroSerie: "",
      fechaAdquisicion: ""
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // ========================
  // FILTRADO
  // ========================
  const maquinasFiltradas = maquinas.filter(m =>
    m.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    m.marca.toLowerCase().includes(filtro.toLowerCase()) ||
    m.zona.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-blue-600" />
            Inventario de Máquinas
          </CardTitle>
          <CardDescription>
            Gestión completa: Crear, editar y eliminar
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* BUSCADOR + BOTÓN CREAR */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar máquinas..."
                className="pl-10"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>

            <Button className="flex items-center gap-2" onClick={() => setModo("crear")}>
              <Plus className="w-4 h-4" /> Nueva Máquina
            </Button>
          </div>

          {/* FORMULARIO DE CREAR / EDITAR */}
          {modo && (
            <Card className="border-2 border-blue-500 p-4">
              <h3 className="font-bold text-lg mb-3">
                {modo === "crear" ? "Registrar Máquina" : "Editar Máquina"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                <Input
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                <Input
                  placeholder="Marca"
                  value={form.marca}
                  onChange={(e) => setForm({ ...form, marca: e.target.value })}
                />
                <Input
                  placeholder="Modelo"
                  value={form.modelo}
                  onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                />

                <Input
                  placeholder="Zona"
                  value={form.zona}
                  onChange={(e) => setForm({ ...form, zona: e.target.value })}
                />

                <select
                  className="border rounded px-3 py-2"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  <option value="Operativa">Operativa</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Fuera de Servicio">Fuera de Servicio</option>
                </select>

                <Input
                  placeholder="Número de serie"
                  value={form.numeroSerie}
                  onChange={(e) => setForm({ ...form, numeroSerie: e.target.value })}
                />

                <Input
                  type="date"
                  value={form.fechaAdquisicion}
                  onChange={(e) => setForm({ ...form, fechaAdquisicion: e.target.value })}
                />

              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="destructive" onClick={cancelar}>Cancelar</Button>

                {modo === "crear" ? (
                  <Button onClick={crearMaquina}>Crear</Button>
                ) : (
                  <Button onClick={actualizarMaquina}>Guardar Cambios</Button>
                )}
              </div>

            </Card>
          )}

          {/* TABLA DE MÁQUINAS */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {maquinasFiltradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No se encontraron máquinas
                  </TableCell>
                </TableRow>
              )}

              {maquinasFiltradas.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.nombre}</TableCell>
                  <TableCell>{m.zona}</TableCell>
                  <TableCell>{m.marca}</TableCell>
                  <TableCell>{m.modelo}</TableCell>

                  <TableCell>
                    <Badge>{m.estado}</Badge>
                  </TableCell>

                  <TableCell className="flex justify-center gap-2">

                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={m.estado}
                      onChange={(e) => cambiarEstado(m.id, e.target.value)}
                    >
                      <option>Operativa</option>
                      <option>Mantenimiento</option>
                      <option>Fuera de Servicio</option>
                    </select>

                    <Button size="sm" onClick={() => iniciarEdicion(m)}>
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => eliminarMaquina(m.id)}
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
    </div>
  );
}
