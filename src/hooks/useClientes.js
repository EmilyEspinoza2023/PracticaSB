import { useState, useEffect } from "react";
import { supabase } from "../assets/database/supabaseconfig";

const useClientes = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Modal registro
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre_cliente: "",
    apellido_cliente: "",
    celular_cliente: "",
  });

  // Modal edición
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);

  // Modal eliminación
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  // Búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  // Paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id_cliente", { ascending: true });

      if (error) {
        setToast({ mostrar: true, mensaje: "Error al cargar los clientes.", tipo: "error" });
        return;
      }
      setClientes(data || []);
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al cargar clientes.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const lower = textoBusqueda.toLowerCase().trim();
      setClientesFiltrados(
        clientes.filter(
          (c) =>
            c.nombre_cliente.toLowerCase().includes(lower) ||
            c.apellido_cliente.toLowerCase().includes(lower) ||
            c.celular_cliente.includes(lower)
        )
      );
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, clientes]);

  const manejarCambioBusqueda = (e) => setTextoBusqueda(e.target.value);

  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  const agregarCliente = async () => {
    try {
      if (
        !nuevoCliente.nombre_cliente.trim() ||
        !nuevoCliente.apellido_cliente.trim() ||
        !nuevoCliente.celular_cliente.trim()
      ) {
        setToast({ mostrar: true, mensaje: "Debe llenar todos los campos.", tipo: "advertencia" });
        return;
      }

      const { error } = await supabase.from("clientes").insert([
        {
          nombre_cliente: nuevoCliente.nombre_cliente,
          apellido_cliente: nuevoCliente.apellido_cliente,
          celular_cliente: nuevoCliente.celular_cliente,
        },
      ]);

      if (error) {
        setToast({ mostrar: true, mensaje: "Error al registrar el cliente.", tipo: "error" });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Cliente "${nuevoCliente.nombre_cliente} ${nuevoCliente.apellido_cliente}" registrado exitosamente.`,
        tipo: "exito",
      });
      setNuevoCliente({ nombre_cliente: "", apellido_cliente: "", celular_cliente: "" });
      setMostrarModalRegistro(false);
      await cargarClientes();
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al registrar cliente.", tipo: "error" });
    }
  };

  const abrirModalEdicion = (cliente) => {
    setClienteEditar(cliente);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  return {
    toast,
    setToast,
    clientes,
    cargando,
    mostrarModalRegistro,
    setMostrarModalRegistro,
    nuevoCliente,
    manejoCambioInput,
    agregarCliente,
    mostrarModalEdicion,
    setMostrarModalEdicion,
    clienteEditar,
    setClienteEditar,
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    clienteAEliminar,
    textoBusqueda,
    manejarCambioBusqueda,
    clientesFiltrados,
    clientesPaginados,
    registrosPorPagina,
    establecerRegistrosPorPagina,
    paginaActual,
    establecerPaginaActual,
    cargarClientes,
    abrirModalEdicion,
    abrirModalEliminacion,
  };
};

export default useClientes;
