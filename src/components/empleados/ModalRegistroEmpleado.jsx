import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const TIPOS_EMPLEADO = ["administrador", "cajero", "mesero"];

const ModalRegistroEmpleado = ({
  mostrarModal,
  setMostrarModal,
  nuevoEmpleado,
  manejoCambioInput,
  agregarEmpleado,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarEmpleado();
    setDeshabilitado(false);
  };

  const camposCompletos =
    nuevoEmpleado.nombre_empleado.trim() !== "" &&
    nuevoEmpleado.apellido_empleado.trim() !== "" &&
    nuevoEmpleado.email.trim() !== "" &&
    nuevoEmpleado.password.trim() !== "" &&
    nuevoEmpleado.tipo_empleado !== "";

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_empleado"
              value={nuevoEmpleado.nombre_empleado}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido_empleado"
              value={nuevoEmpleado.apellido_empleado}
              onChange={manejoCambioInput}
              placeholder="Ingresa el apellido"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={nuevoEmpleado.email}
              onChange={manejoCambioInput}
              placeholder="correo@ejemplo.com"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña *</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={nuevoEmpleado.password}
              onChange={manejoCambioInput}
              placeholder="Contraseña de acceso"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              type="text"
              name="celular"
              value={nuevoEmpleado.celular}
              onChange={manejoCambioInput}
              placeholder="Número de celular"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>PIN de acceso</Form.Label>
            <Form.Control
              type="password"
              name="pin_acceso"
              value={nuevoEmpleado.pin_acceso}
              onChange={manejoCambioInput}
              placeholder="Ingresa el PIN"
              maxLength={10}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de empleado *</Form.Label>
            <Form.Select
              name="tipo_empleado"
              value={nuevoEmpleado.tipo_empleado}
              onChange={manejoCambioInput}
            >
              <option value="">Selecciona un tipo</option>
              {TIPOS_EMPLEADO.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={!camposCompletos || deshabilitado}
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroEmpleado;
