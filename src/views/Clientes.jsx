import React from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

import useClientes from "../hooks/useClientes";
import TarjetaCliente from "../components/clientes/TarjetaCliente";
import TablaClientes from "../components/clientes/TablaClientes";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Clientes = () => {
  const {
    toast,
    setToast,
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
  } = useClientes();

  return (
    <Container className="mt-3 mb-5">
      {/* Título y botón */}
      <div className="app-seccion-header d-flex justify-content-between align-items-center">
        <h3>
          <i className="bi-people-fill me-2"></i> Clientes
        </h3>
        <Button onClick={() => setMostrarModalRegistro(true)}>
          <i className="bi-plus-lg me-1"></i>
          <span className="d-none d-sm-inline">Nuevo Cliente</span>
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="app-filtros">
        <Row>
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
              placeholder="Buscar por nombre, apellido o celular..."
            />
          </Col>
        </Row>
      </div>

      {/* Sin resultados */}
      {!cargando && textoBusqueda.trim() && clientesFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron clientes que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Spinner */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" style={{ color: "var(--rojo)" }} />
            <p className="mt-3 text-muted">Cargando clientes...</p>
          </Col>
        </Row>
      )}

      {/* Lista de clientes */}
      {!cargando && clientesFiltrados.length > 0 && (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetaCliente
              clientes={clientesPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaClientes
              clientes={clientesPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* Paginación */}
      {clientesFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={clientesFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* Modal Registro */}
      <ModalRegistroCliente
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={manejoCambioInput}
        agregarCliente={agregarCliente}
      />

      {/* Modal Edición */}
      <ModalEdicionCliente
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        setClienteEditar={setClienteEditar}
        cargarClientes={cargarClientes}
        setToast={setToast}
      />

      {/* Modal Eliminación */}
      <ModalEliminacionCliente
        mostrarModal={mostrarModalEliminacion}
        setMostrarModal={setMostrarModalEliminacion}
        clienteAEliminar={clienteAEliminar}
        cargarClientes={cargarClientes}
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

export default Clientes;
