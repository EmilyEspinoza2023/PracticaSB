import React from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

import useEmpleados from "../hooks/useEmpleados";
import TarjetaEmpleado from "../components/empleados/TarjetaEmpleado";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";
import ModalEdicionEmpleado from "../components/empleados/ModalEdicionEmpleado";
import ModalEliminacionEmpleado from "../components/empleados/ModalEliminacionEmpleado";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Empleados = () => {
  const {
    toast,
    setToast,
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
  } = useEmpleados();

  return (
    <Container className="mt-3 mb-5">
      {/* Título y botón */}
      <div className="app-seccion-header d-flex justify-content-between align-items-center">
        <h3>
          <i className="bi-person-badge-fill me-2"></i> Empleados
        </h3>
        <Button onClick={() => setMostrarModalRegistro(true)}>
          <i className="bi-plus-lg me-1"></i>
          <span className="d-none d-sm-inline">Nuevo Empleado</span>
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="app-filtros">
        <Row>
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
              placeholder="Buscar por nombre, apellido o tipo..."
            />
          </Col>
        </Row>
      </div>

      {/* Sin resultados */}
      {!cargando && textoBusqueda.trim() && empleadosFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron empleados que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {/* Spinner */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" style={{ color: "var(--rojo)" }} />
            <p className="mt-3 text-muted">Cargando empleados...</p>
          </Col>
        </Row>
      )}

      {/* Lista de empleados */}
      {!cargando && empleadosFiltrados.length > 0 && (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetaEmpleado
              empleados={empleadosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaEmpleados
              empleados={empleadosPaginados}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* Paginación */}
      {empleadosFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={empleadosFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      {/* Modal Registro */}
      <ModalRegistroEmpleado
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoEmpleado={nuevoEmpleado}
        manejoCambioInput={manejoCambioInput}
        agregarEmpleado={agregarEmpleado}
      />

      {/* Modal Edición */}
      <ModalEdicionEmpleado
        mostrarModal={mostrarModalEdicion}
        setMostrarModal={setMostrarModalEdicion}
        empleadoEditar={empleadoEditar}
        setEmpleadoEditar={setEmpleadoEditar}
        cargarEmpleados={cargarEmpleados}
        setToast={setToast}
      />

      {/* Modal Eliminación */}
      <ModalEliminacionEmpleado
        mostrarModal={mostrarModalEliminacion}
        setMostrarModal={setMostrarModalEliminacion}
        empleadoAEliminar={empleadoAEliminar}
        cargarEmpleados={cargarEmpleados}
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

export default Empleados;
