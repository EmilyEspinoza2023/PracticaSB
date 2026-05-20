import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../assets/database/supabaseconfig";

import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaPermisos from "../components/permisos/TablaPermisos";
import TarjetaPermisos from "../components/permisos/TarjetaPermisos";
import ModalEdicionPermisos from "../components/permisos/ModalEdicionPermisos";

const Permisos = () => {
  const [roles, setRoles] = useState([]);
  const [rolesFiltrados, setRolesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [rolEditar, setRolEditar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const cargarRoles = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("permisos")
        .select("*")
        .order("rol", { ascending: true });

      if (error) throw error;

      setRoles(data || []);
    } catch {
      setToast({ mostrar: true, mensaje: "Error al cargar permisos.", tipo: "error" });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setRolesFiltrados(roles);
    } else {
      const texto = textoBusqueda.toLowerCase();
      setRolesFiltrados(
        roles.filter(
          (r) =>
            r.rol.toLowerCase().includes(texto) ||
            (r.descripcion || "").toLowerCase().includes(texto)
        )
      );
    }
  }, [textoBusqueda, roles]);

  const abrirModalEdicion = (rol) => {
    setRolEditar({ ...rol });
    setMostrarModalEdicion(true);
  };

  const actualizarPermisos = async () => {
    if (!rolEditar) return;

    try {
      const { error } = await supabase
        .from("permisos")
        .update({ permisos: rolEditar.permisos })
        .eq("id_permiso", rolEditar.id_permiso);

      if (error) throw error;

      await cargarRoles();
      setMostrarModalEdicion(false);
      setToast({
        mostrar: true,
        mensaje: `Permisos de "${rolEditar.rol}" actualizados correctamente.`,
        tipo: "exito",
      });
    } catch {
      setToast({ mostrar: true, mensaje: "Error al actualizar permisos.", tipo: "error" });
    }
  };

  return (
    <Container className="mt-3 mb-5">
      <div className="app-seccion-header d-flex justify-content-between align-items-center">
        <h3>
          <i className="bi bi-shield-lock-fill me-2"></i> Gestión de Permisos
        </h3>
      </div>

      <div className="app-filtros">
        <Row>
          <Col md={6} lg={5}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
              placeholder="Buscar por rol o descripción..."
            />
          </Col>
        </Row>
      </div>

      {!cargando && textoBusqueda.trim() && rolesFiltrados.length === 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No se encontraron roles que coincidan con "{textoBusqueda}".
            </Alert>
          </Col>
        </Row>
      )}

      {cargando ? (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" style={{ color: "var(--rojo)" }} />
            <p className="mt-3 text-muted">Cargando permisos...</p>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={12} className="d-lg-none">
            <TarjetaPermisos roles={rolesFiltrados} abrirModalEdicion={abrirModalEdicion} />
          </Col>
          <Col lg={12} className="d-none d-lg-block">
            <TablaPermisos roles={rolesFiltrados} abrirModalEdicion={abrirModalEdicion} />
          </Col>
        </Row>
      )}

      <ModalEdicionPermisos
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        rolEditar={rolEditar}
        setRolEditar={setRolEditar}
        guardarCambios={actualizarPermisos}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Permisos;
