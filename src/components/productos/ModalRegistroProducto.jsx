import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import FormularioRegistroProducto from "./FormularioRegistroProducto";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejoCambioInput,
  imagenArchivo,
  setImagenArchivo,
  categorias,
  agregarProducto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarProducto();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormularioRegistroProducto
          nuevoProducto={nuevoProducto}
          manejoCambioInput={manejoCambioInput}
          imagenArchivo={imagenArchivo}
          setImagenArchivo={setImagenArchivo}
          categorias={categorias}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={!nuevoProducto.nombre_producto.trim() || deshabilitado}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;
