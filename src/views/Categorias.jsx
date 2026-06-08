import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../assets/database/supabaseconfig";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import emailjs from "@emailjs/browser";

import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import ModalEnvioCorreoCategorias from "../components/categorias/ModalEnvioCorreoCategorias";
import TablaCategorias from "../components/categorias/TablaCategorias";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Categorias = () => {
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  // Variables de estado para listado y modales
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const [categoriaEditar, setCategoriaEditar] = useState({
    id_categoria: "",
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  // Variables de estado para búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

  // Variables de estado para paginación
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // Variables de estado para envío de correo
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  // Inicializar EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const abrirModalCorreo = () => {
    setEmailDestino("");
    setMostrarModalCorreo(true);
  };

  const formatearCategoriasParaCorreo = () => {
    if (categorias.length === 0) return "No hay categorías registradas.";
    let texto = `LISTADO DE CATEGORÍAS\n\n`;
    texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`;
    texto += `Total de categorías: ${categorias.length}\n\n`;
    categorias.forEach((cat, index) => {
      texto += `${index + 1}. ${cat.nombre_categoria}\n`;
      if (cat.descripcion_categoria) {
        texto += `   Descripción: ${cat.descripcion_categoria}\n`;
      }
      texto += `\n`;
    });
    return texto;
  };

  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) {
      setToast({
        mostrar: true,
        mensaje: "Por favor ingresa un correo destino.",
        tipo: "advertencia",
      });
      return;
    }
    setEnviandoCorreo(true);
    const mensaje = formatearCategoriasParaCorreo();
    const templateParams = {
      to_name: "Administrador",
      user_email: emailDestino,
      message: mensaje,
      fecha_envio: new Date().toLocaleDateString("es-NI"),
    };
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      )
      .then(() => {
        setToast({
          mostrar: true,
          mensaje: "Correo enviado correctamente.",
          tipo: "exito",
        });
        setMostrarModalCorreo(false);
        setEmailDestino("");
      })
      .catch((error) => {
        console.error("Error EmailJS:", error);
        setToast({
          mostrar: true,
          mensaje: "Error al enviar el correo.",
          tipo: "error",
        });
      })
      .finally(() => {
        setEnviandoCorreo(false);
      });
  };

  // Métodos de apertura de modales
  const generarPDFCategoria = (categoria) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Categoría", 14, 20);
    doc.line(14, 25, 195, 25);

    autoTable(doc, {
      startY: 35,
      head: [["Campo", "Valor"]],
      body: [
        ["ID", categoria.id_categoria],
        ["Nombre", categoria.nombre_categoria],
        ["Descripción", categoria.descripcion_categoria || "-"],
      ],
    });

    doc.save(`categoria_${categoria.id_categoria}.pdf`);
  };

  const generarPDFTodas = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Categorías", 14, 20);
    doc.line(14, 25, 195, 25);

    doc.setFontSize(10);
    doc.text(`Total de registros: ${categorias.length}`, 14, 32);

    autoTable(doc, {
      startY: 38,
      head: [["ID", "Nombre", "Descripción"]],
      body: categorias.map((c) => [
        c.id_categoria,
        c.nombre_categoria,
        c.descripcion_categoria || "-",
      ]),
    });

    doc.save("categorias.pdf");
  };

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({
      id_categoria: categoria.id_categoria,
      nombre_categoria: categoria.nombre_categoria,
      descripcion_categoria: categoria.descripcion_categoria,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  // Método de carga
  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) {
        console.error("Error al cargar categorías:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar las categorías.",
          tipo: "error",
        });
        return;
      }

      setCategorias(data || []);
    } catch (err) {
      console.error("Excepción al cargar categorías:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar categorías.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Búsqueda: filtrar por nombre o descripción
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtradas = categorias.filter(
        (cat) =>
          cat.nombre_categoria.toLowerCase().includes(textoLower) ||
          (cat.descripcion_categoria &&
            cat.descripcion_categoria.toLowerCase().includes(textoLower))
      );
      setCategoriasFiltradas(filtradas);
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, categorias]);

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // Paginación
  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarCategoria = async () => {
    try {
      if (
        !nuevaCategoria.nombre_categoria.trim() ||
        !nuevaCategoria.descripcion_categoria.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("categorias").insert([
        {
          nombre_categoria: nuevaCategoria.nombre_categoria,
          descripcion_categoria: nuevaCategoria.descripcion_categoria,
        },
      ]);

      if (error) {
        console.error("Error al agregar categoría:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al registrar categoría.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: `Categoría "${nuevaCategoria.nombre_categoria}" registrada exitosamente.`,
        tipo: "exito",
      });

      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);
      await cargarCategorias();
    } catch (err) {
      console.error("Excepción al agregar categoría:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al registrar categoría.",
        tipo: "error",
      });
    }
  };

  return (
    <Container className="mt-3 mb-5">
      {/* Título y botón */}
      <div className="app-seccion-header d-flex justify-content-between align-items-center">
        <h3>
          <i className="bi-bookmark-plus-fill me-2"></i> Categorías
        </h3>
        <div className="d-flex gap-2">
          <Button variant="outline-danger" onClick={generarPDFTodas} disabled={categorias.length === 0}>
            <i className="bi bi-file-earmark-pdf me-1"></i>
            <span className="d-none d-sm-inline">Exportar PDF</span>
          </Button>
          <Button variant="primary" onClick={abrirModalCorreo} disabled={categorias.length === 0}>
            <i className="bi bi-envelope me-1"></i>
            <span className="d-none d-lg-inline">Enviar por Correo</span>
          </Button>
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi-plus-lg me-1"></i>
            <span className="d-none d-sm-inline">Nueva Categoría</span>
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="app-filtros">
        <Row>
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
              placeholder="Buscar por nombre o descripción..."
            />
          </Col>
        </Row>
      </div>

      {/* Mensaje de no coincidencias solo cuando hay búsqueda y no hay resultados */}
      {!cargando && textoBusqueda.trim() && categoriasFiltradas.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron categorías que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Spinner */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" style={{ color: "var(--rojo)" }} />
            <p className="mt-3 text-muted">Cargando categorías...</p>
          </Col>
        </Row>
      )}

      {/* Lista de categorías filtradas */}
      {!cargando && categoriasFiltradas.length > 0 && (
        <Row>
          <Col xs={12} sm={12} md={12} className="d-lg-none">
            <TarjetaCategoria
              categorias={categoriasPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaCategorias
              categorias={categoriasPaginadas}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
              generarPDFCategoria={generarPDFCategoria}
            />
          </Col>
        </Row>
      )}

      {/* Paginación */}
      {categoriasFiltradas.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={categoriasFiltradas.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* Modal de Registro */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

      {/* Modal de Edición */}
      <ModalEdicionCategoria
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        categoriaEditar={categoriaEditar}
        setCategoriaEditar={setCategoriaEditar}
        cargarCategorias={cargarCategorias}
        setToast={setToast}
      />

      {/* Modal de Envío de Correo */}
      <ModalEnvioCorreoCategorias
        mostrarModalCorreo={mostrarModalCorreo}
        setMostrarModalCorreo={setMostrarModalCorreo}
        emailDestino={emailDestino}
        setEmailDestino={setEmailDestino}
        enviandoCorreo={enviandoCorreo}
        enviarCorreoCategorias={enviarCorreoCategorias}
        totalCategorias={categorias.length}
      />

      {/* Modal de Eliminación */}
      <ModalEliminacionCategoria
        mostrarModal={mostrarModalEliminacion}
        setMostrarModal={setMostrarModalEliminacion}
        categoriaAEliminar={categoriaAEliminar}
        cargarCategorias={cargarCategorias}
        setToast={setToast}
      />

      {/* Notificación */}
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Categorias;
