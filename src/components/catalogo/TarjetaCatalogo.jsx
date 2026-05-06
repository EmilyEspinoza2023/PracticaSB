import React, { useState } from "react";
import { Card, Modal, Button, Badge } from "react-bootstrap";

const MAX_DESC = 75;

const TarjetaCatalogo = ({ producto }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const descripcionCorta =
    producto.descripcion_producto && producto.descripcion_producto.length > MAX_DESC
      ? producto.descripcion_producto.substring(0, MAX_DESC) + "..."
      : producto.descripcion_producto;

  return (
    <>
      <Card className="catalogo-tarjeta h-100 border-0">
        <div className="catalogo-tarjeta-imagen-wrapper">
          {producto.imagen_url ? (
            <Card.Img
              variant="top"
              src={producto.imagen_url}
              alt={producto.nombre_producto}
              className="catalogo-tarjeta-imagen"
            />
          ) : (
            <div className="catalogo-tarjeta-imagen-placeholder">
              <i className="bi bi-box2"></i>
            </div>
          )}
          <span className="catalogo-tarjeta-badge-categoria">
            {producto.categorias?.nombre_categoria ?? "Sin categoría"}
          </span>
        </div>

        <Card.Body className="catalogo-tarjeta-cuerpo d-flex flex-column">
          <Card.Title className="catalogo-tarjeta-nombre">
            {producto.nombre_producto}
          </Card.Title>
          <Card.Text className="catalogo-tarjeta-desc flex-grow-1">
            {descripcionCorta || "Sin descripción."}
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 catalogo-tarjeta-footer">
            <span className="catalogo-tarjeta-precio">
              C$ {parseFloat(producto.precio_producto).toFixed(2)}
            </span>
            <Button
              size="sm"
              className="catalogo-btn-detalle"
              onClick={() => setMostrarModal(true)}
            >
              Ver detalle
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        centered
        size="sm"
        contentClassName="catalogo-modal-content"
      >
        <Modal.Header closeButton className="catalogo-modal-header">
          <Modal.Title className="catalogo-modal-titulo">
            {producto.nombre_producto}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {producto.imagen_url && (
            <img
              src={producto.imagen_url}
              alt={producto.nombre_producto}
              className="w-100 catalogo-modal-imagen"
            />
          )}
          <div className="p-3">
            <p className="catalogo-modal-desc">
              {producto.descripcion_producto || "Sin descripción."}
            </p>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Badge className="catalogo-badge-detalle">
                {producto.categorias?.nombre_categoria ?? "Sin categoría"}
              </Badge>
              <span className="catalogo-modal-precio">
                C$ {parseFloat(producto.precio_producto).toFixed(2)}
              </span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="catalogo-modal-footer">
          <Button className="catalogo-btn-cerrar" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;
