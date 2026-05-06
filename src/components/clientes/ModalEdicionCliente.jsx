import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { supabase } from "../../assets/database/supabaseconfig";

const ModalEdicionCliente = ({
  mostrarModal,
  setMostrarModal,
  clienteEditar,
  setClienteEditar,
  cargarClientes,
  setToast,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditar((prev) => ({ ...prev, [name]: value }));
  };

  const actualizarCliente = async () => {
    try {
      if (
        !clienteEditar.nombre_cliente.trim() ||
        !clienteEditar.apellido_cliente.trim() ||
        !clienteEditar.celular_cliente.trim()
      ) {
        setToast({ mostrar: true, mensaje: "Debe llenar todos los campos.", tipo: "advertencia" });
        return;
      }

      setMostrarModal(false);

      const { error } = await supabase
        .from("clientes")
        .update({
          nombre_cliente: clienteEditar.nombre_cliente,
          apellido_cliente: clienteEditar.apellido_cliente,
          celular_cliente: clienteEditar.celular_cliente,
        })
        .eq("id_cliente", clienteEditar.id_cliente);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: `Error al actualizar el cliente ${clienteEditar.nombre_cliente}.`,
          tipo: "error",
        });
        return;
      }

      await cargarClientes();
      setToast({
        mostrar: true,
        mensaje: `Cliente "${clienteEditar.nombre_cliente} ${clienteEditar.apellido_cliente}" actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al actualizar cliente.", tipo: "error" });
    }
  };

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarCliente();
    setDeshabilitado(false);
  };

  if (!clienteEditar) return null;

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_cliente"
              value={clienteEditar.nombre_cliente}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido_cliente"
              value={clienteEditar.apellido_cliente}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el apellido"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              type="tel"
              name="celular_cliente"
              value={clienteEditar.celular_cliente}
              onChange={manejoCambioInputEdicion}
              placeholder="Ej: 8888-1234"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={clienteEditar.nombre_cliente.trim() === "" || deshabilitado}
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCliente;
