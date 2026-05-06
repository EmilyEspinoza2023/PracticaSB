import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { supabase } from "../assets/database/supabaseconfig";

import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(8);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase
          .from("productos")
          .select("*, categorias(nombre_categoria)")
          .order("id_producto", { ascending: true }),
        supabase
          .from("categorias")
          .select("id_categoria, nombre_categoria")
          .order("nombre_categoria", { ascending: true }),
      ]);
      setProductos(prods || []);
      setCategorias(cats || []);
    } catch {
      // silencioso en vista pública
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria =
      !categoriaSeleccionada ||
      String(p.categoria_producto) === categoriaSeleccionada;
    const lower = textoBusqueda.toLowerCase().trim();
    const coincideBusqueda =
      !lower ||
      p.nombre_producto.toLowerCase().includes(lower) ||
      (p.descripcion_producto &&
        p.descripcion_producto.toLowerCase().includes(lower));
    return coincideCategoria && coincideBusqueda;
  });

  const manejarCambioBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
    establecerPaginaActual(1);
  };

  const manejarCambioCategoria = (e) => {
    setCategoriaSeleccionada(e.target.value);
    establecerPaginaActual(1);
  };

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <>
      {/* Hero */}
      <div className="catalogo-hero">
        <div className="catalogo-hero-overlay">
          <h1 className="catalogo-hero-titulo">
            <i className="bi bi-grid-fill me-3"></i>Nuestro Catálogo
          </h1>
          <p className="catalogo-hero-subtitulo">
            Descubre todos nuestros productos disponibles
          </p>
        </div>
      </div>

      <Container className="mt-4 mb-5">
        {/* Filtros */}
        <div className="catalogo-filtros-panel">
          <Row className="g-3 align-items-center">
            <Col xs={12} sm={5} md={4}>
              <Form.Select
                className="catalogo-select"
                value={categoriaSeleccionada}
                onChange={manejarCambioCategoria}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.id_categoria} value={String(cat.id_categoria)}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12} sm={7} md={5}>
              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarCambioBusqueda}
                placeholder="Buscar producto..."
              />
            </Col>
            <Col xs={12} md={3} className="text-muted small text-end">
              {!cargando && (
                <span>
                  <i className="bi bi-box-seam me-1"></i>
                  {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""}
                </span>
              )}
            </Col>
          </Row>
        </div>

        {/* Spinner */}
        {cargando && (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#c0392b" }} />
            <p className="mt-3 text-muted">Cargando catálogo...</p>
          </div>
        )}

        {/* Sin resultados */}
        {!cargando && productosFiltrados.length === 0 && (
          <Alert className="catalogo-sin-resultados text-center border-0 mt-4">
            <i className="bi bi-search me-2"></i>
            No se encontraron productos con ese criterio.
          </Alert>
        )}

        {/* Grid de productos */}
        {!cargando && productosFiltrados.length > 0 && (
          <Row xs={2} sm={2} md={3} lg={4} className="g-4 mt-1">
            {productosPaginados.map((producto) => (
              <Col key={producto.id_producto}>
                <TarjetaCatalogo producto={producto} />
              </Col>
            ))}
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
      </Container>
    </>
  );
};

export default Catalogo;
