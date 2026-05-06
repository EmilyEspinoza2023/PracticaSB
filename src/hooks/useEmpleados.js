import { useState, useEffect } from "react";
import { supabase } from "../assets/database/supabaseconfig";

const useEmpleados = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Modal registro
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre_empleado: "",
    apellido_empleado: "",
    pin_acceso: "",
    tipo_empleado: "",
  });

  // Modal edición
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [empleadoEditar, setEmpleadoEditar] = useState(null);

  // Modal eliminación
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

  // Búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);

  // Paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const cargarEmpleados = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("empleados")
        .select("*")
        .order("id_empleado", { ascending: true });

      if (error) {
        setToast({ mostrar: true, mensaje: "Error al cargar los empleados.", tipo: "error" });
        return;
      }
      setEmpleados(data || []);
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al cargar empleados.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setEmpleadosFiltrados(empleados);
    } else {
      const lower = textoBusqueda.toLowerCase().trim();
      setEmpleadosFiltrados(
        empleados.filter(
          (e) =>
            e.nombre_empleado.toLowerCase().includes(lower) ||
            e.apellido_empleado.toLowerCase().includes(lower) ||
            e.tipo_empleado.toLowerCase().includes(lower)
        )
      );
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, empleados]);

  const manejarCambioBusqueda = (e) => setTextoBusqueda(e.target.value);

  const empleadosPaginados = empleadosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({ ...prev, [name]: value }));
  };

  const agregarEmpleado = async () => {
    try {
      if (
        !nuevoEmpleado.nombre_empleado.trim() ||
        !nuevoEmpleado.apellido_empleado.trim() ||
        !nuevoEmpleado.pin_acceso.trim() ||
        !nuevoEmpleado.tipo_empleado
      ) {
        setToast({ mostrar: true, mensaje: "Debe llenar todos los campos.", tipo: "advertencia" });
        return;
      }

      const { error } = await supabase.from("empleados").insert([
        {
          nombre_empleado: nuevoEmpleado.nombre_empleado,
          apellido_empleado: nuevoEmpleado.apellido_empleado,
          pin_acceso: nuevoEmpleado.pin_acceso,
          tipo_empleado: nuevoEmpleado.tipo_empleado,
        },
      ]);

      if (error) {
        setToast({ mostrar: true, mensaje: "Error al registrar el empleado.", tipo: "error" });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Empleado "${nuevoEmpleado.nombre_empleado} ${nuevoEmpleado.apellido_empleado}" registrado exitosamente.`,
        tipo: "exito",
      });
      setNuevoEmpleado({ nombre_empleado: "", apellido_empleado: "", pin_acceso: "", tipo_empleado: "" });
      setMostrarModalRegistro(false);
      await cargarEmpleados();
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al registrar empleado.", tipo: "error" });
    }
  };

  const abrirModalEdicion = (empleado) => {
    setEmpleadoEditar(empleado);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarModalEliminacion(true);
  };

  return {
    toast,
    setToast,
    empleados,
    cargando,
    mostrarModalRegistro,
    setMostrarModalRegistro,
    nuevoEmpleado,
    manejoCambioInput,
    agregarEmpleado,
    mostrarModalEdicion,
    setMostrarModalEdicion,
    empleadoEditar,
    setEmpleadoEditar,
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    empleadoAEliminar,
    textoBusqueda,
    manejarCambioBusqueda,
    empleadosFiltrados,
    empleadosPaginados,
    registrosPorPagina,
    establecerRegistrosPorPagina,
    paginaActual,
    establecerPaginaActual,
    cargarEmpleados,
    abrirModalEdicion,
    abrirModalEliminacion,
  };
};

export default useEmpleados;
