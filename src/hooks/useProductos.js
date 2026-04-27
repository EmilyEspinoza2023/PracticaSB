import { useState, useEffect } from "react";
import { supabase } from "../assets/database/supabaseconfig";

const useProductos = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Modal registro
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    precio_producto: "",
    categoria_producto: "",
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);

  // Modal edición
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  // Modal eliminación
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  // Paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*, categorias(nombre_categoria)")
        .order("id_producto", { ascending: true });

      if (error) {
        setToast({ mostrar: true, mensaje: "Error al cargar los productos.", tipo: "error" });
        return;
      }
      setProductos(data || []);
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al cargar productos.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("id_categoria, nombre_categoria")
      .order("nombre_categoria", { ascending: true });
    if (!error) setCategorias(data || []);
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const lower = textoBusqueda.toLowerCase().trim();
      setProductosFiltrados(
        productos.filter(
          (p) =>
            p.nombre_producto.toLowerCase().includes(lower) ||
            (p.descripcion_producto &&
              p.descripcion_producto.toLowerCase().includes(lower))
        )
      );
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, productos]);

  const manejarCambioBusqueda = (e) => setTextoBusqueda(e.target.value);

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre_producto.trim() ||
        !nuevoProducto.descripcion_producto.trim() ||
        !nuevoProducto.precio_producto ||
        !nuevoProducto.categoria_producto ||
        !imagenArchivo
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos e incluir una imagen.",
          tipo: "advertencia",
        });
        return;
      }

      const nombreUnico = `${Date.now()}_${imagenArchivo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreUnico, imagenArchivo);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreUnico);

      const { error } = await supabase.from("productos").insert([
        {
          nombre_producto: nuevoProducto.nombre_producto,
          descripcion_producto: nuevoProducto.descripcion_producto,
          precio_producto: parseFloat(nuevoProducto.precio_producto),
          categoria_producto: parseInt(nuevoProducto.categoria_producto),
          imagen_url: urlData.publicUrl,
        },
      ]);

      if (error) {
        setToast({ mostrar: true, mensaje: "Error al registrar el producto.", tipo: "error" });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Producto "${nuevoProducto.nombre_producto}" registrado exitosamente.`,
        tipo: "exito",
      });
      setNuevoProducto({
        nombre_producto: "",
        descripcion_producto: "",
        precio_producto: "",
        categoria_producto: "",
      });
      setImagenArchivo(null);
      setMostrarModalRegistro(false);
      await cargarProductos();
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al registrar producto.", tipo: "error" });
    }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditar(producto);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  return {
    toast,
    setToast,
    productos,
    cargando,
    categorias,
    mostrarModalRegistro,
    setMostrarModalRegistro,
    nuevoProducto,
    imagenArchivo,
    setImagenArchivo,
    manejoCambioInput,
    agregarProducto,
    mostrarModalEdicion,
    setMostrarModalEdicion,
    productoEditar,
    setProductoEditar,
    mostrarModalEliminacion,
    setMostrarModalEliminacion,
    productoAEliminar,
    textoBusqueda,
    manejarCambioBusqueda,
    productosFiltrados,
    productosPaginados,
    registrosPorPagina,
    establecerRegistrosPorPagina,
    paginaActual,
    establecerPaginaActual,
    cargarProductos,
    abrirModalEdicion,
    abrirModalEliminacion,
  };
};

export default useProductos;
