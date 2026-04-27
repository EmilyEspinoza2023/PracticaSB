import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";

const TarjetasProductos = ({ productos, abrirModalEdicion, abrirModalEliminacion }) => {
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  const manejarTeclaEscape = useCallback((e) => {
    if (e.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarActiva = (id) =>
    setIdTarjetaActiva((prev) => (prev === id ? null : id));

  return (
    <>
      {productos.map((producto) => {
        const activa = idTarjetaActiva === producto.id_producto;
        return (
          <Card
            key={producto.id_producto}
            className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-categoria-contenedor"
            onClick={() => alternarActiva(producto.id_producto)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                alternarActiva(producto.id_producto);
              }
            }}
            aria-label={`Producto ${producto.nombre_producto}`}
          >
            <Card.Body
              className={`p-2 tarjeta-categoria-cuerpo ${
                activa ? "tarjeta-categoria-cuerpo-activo" : "tarjeta-categoria-cuerpo-inactivo"
              }`}
            >
              <Row className="align-items-center gx-3">
                <Col xs={3} className="px-2">
                  {producto.imagen_url ? (
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre_producto}
                      className="rounded"
                      style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center rounded"
                      style={{ aspectRatio: "1" }}
                    >
                      <i className="bi bi-box text-muted fs-3"></i>
                    </div>
                  )}
                </Col>

                <Col xs={5} className="text-start">
                  <div className="fw-semibold text-truncate">{producto.nombre_producto}</div>
                  <div className="small text-muted text-truncate">{producto.descripcion_producto}</div>
                  <Badge bg="secondary" className="mt-1" style={{ fontSize: "0.7rem" }}>
                    {producto.categorias?.nombre_categoria ?? "Sin categoría"}
                  </Badge>
                </Col>

                <Col xs={4} className="text-end">
                  <div className="fw-bold text-success">
                    C$ {parseFloat(producto.precio_producto).toFixed(2)}
                  </div>
                </Col>
              </Row>
            </Card.Body>

            {activa && (
              <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setIdTarjetaActiva(null);
                }}
                className="tarjeta-categoria-capa"
              >
                <div
                  className="d-flex gap-2 tarjeta-categoria-botones-capa"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => {
                      abrirModalEdicion(producto);
                      setIdTarjetaActiva(null);
                    }}
                    aria-label={`Editar ${producto.nombre_producto}`}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      abrirModalEliminacion(producto);
                      setIdTarjetaActiva(null);
                    }}
                    aria-label={`Eliminar ${producto.nombre_producto}`}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </>
  );
};

export default TarjetasProductos;
