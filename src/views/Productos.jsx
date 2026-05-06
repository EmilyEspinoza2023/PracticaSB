import React from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

import useProductos from "../hooks/useProductos";
import TarjetasProductos from "../components/productos/TarjetasProductos";
import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Productos = () => {
  const {
    toast,
    setToast,
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
  } = useProductos();

  return (
    <Container className="mt-3 mb-5">
      {/* Título y botón */}
      <div className="app-seccion-header d-flex justify-content-between align-items-center">
        <h3>
          <i className="bi-box-fill me-2"></i> Productos
        </h3>
        <Button onClick={() => setMostrarModalRegistro(true)}>
          <i className="bi-plus-lg me-1"></i>
          <span className="d-none d-sm-inline">Nuevo Producto</span>
        </Button>
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

      {/* Sin resultados */}
      {!cargando && textoBusqueda.trim() && productosFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron productos que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Spinner */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" style={{ color: "var(--rojo)" }} />
            <p className="mt-3 text-muted">Cargando productos...</p>
          </Col>
        </Row>
      )}

      {/* Lista de productos */}
      {!cargando && productosFiltrados.length > 0 && (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetasProductos
              productos={productosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaProductos
              productos={productosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* Paginación */}
      {productosFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={productosFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* Modal Registro */}
      <ModalRegistroProducto
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        imagenArchivo={imagenArchivo}
        setImagenArchivo={setImagenArchivo}
        categorias={categorias}
        agregarProducto={agregarProducto}
      />

      {/* Modal Edición */}
      <ModalEdicionProducto
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        productoEditar={productoEditar}
        setProductoEditar={setProductoEditar}
        categorias={categorias}
        cargarProductos={cargarProductos}
        setToast={setToast}
      />

      {/* Modal Eliminación */}
      <ModalEliminacionProducto
        mostrarModal={mostrarModalEliminacion}
        setMostrarModal={setMostrarModalEliminacion}
        productoAEliminar={productoAEliminar}
        cargarProductos={cargarProductos}
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

export default Productos;
