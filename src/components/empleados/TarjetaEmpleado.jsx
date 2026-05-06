import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaEmpleado = ({ empleados, abrirModalEdicion, abrirModalEliminacion }) => {
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  return (
    <div>
      {empleados.map((empleado) => {
        const tarjetaActiva = idTarjetaActiva === empleado.id_empleado;

        return (
          <Card
            key={empleado.id_empleado}
            className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-categoria-contenedor"
            onClick={() => alternarTarjetaActiva(empleado.id_empleado)}
            tabIndex={0}
            onKeyDown={(evento) => {
              if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                alternarTarjetaActiva(empleado.id_empleado);
              }
            }}
            aria-label={`Empleado ${empleado.nombre_empleado} ${empleado.apellido_empleado}`}
          >
            <Card.Body
              className={`p-2 tarjeta-categoria-cuerpo ${
                tarjetaActiva
                  ? "tarjeta-categoria-cuerpo-activo"
                  : "tarjeta-categoria-cuerpo-inactivo"
              }`}
            >
              <Row className="align-items-center gx-3">
                <Col xs={2} className="px-2">
                  <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-categoria-placeholder-imagen">
                    <i className="bi bi-person-fill text-muted fs-3"></i>
                  </div>
                </Col>

                <Col xs={5} className="text-start">
                  <div className="fw-semibold text-truncate">
                    {empleado.nombre_empleado} {empleado.apellido_empleado}
                  </div>
                  <div className="small text-muted text-truncate">
                    {empleado.tipo_empleado}
                  </div>
                </Col>

                <Col xs={5} className="d-flex flex-column align-items-end justify-content-center text-end">
                  <div className="fw-semibold small">Activo</div>
                </Col>
              </Row>
            </Card.Body>

            {tarjetaActiva && (
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
                      abrirModalEdicion(empleado);
                      setIdTarjetaActiva(null);
                    }}
                    aria-label={`Editar ${empleado.nombre_empleado}`}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      abrirModalEliminacion(empleado);
                      setIdTarjetaActiva(null);
                    }}
                    aria-label={`Eliminar ${empleado.nombre_empleado}`}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default TarjetaEmpleado;
