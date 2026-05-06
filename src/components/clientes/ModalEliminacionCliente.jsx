import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../../assets/database/supabaseconfig";

const ModalEliminacionCliente = ({
  mostrarModal,
  setMostrarModal,
  clienteAEliminar,
  cargarClientes,
  setToast,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;
    try {
      setMostrarModal(false);

      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id_cliente", clienteAEliminar.id_cliente);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el cliente ${clienteAEliminar.nombre_cliente}.`,
          tipo: "error",
        });
        return;
      }

      await cargarClientes();
      setToast({
        mostrar: true,
        mensaje: `Cliente "${clienteAEliminar.nombre_cliente} ${clienteAEliminar.apellido_cliente}" eliminado exitosamente.`,
        tipo: "exito",
      });
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al eliminar cliente.", tipo: "error" });
    }
  };

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarCliente();
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
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar al cliente "
        <strong>
          {clienteAEliminar?.nombre_cliente} {clienteAEliminar?.apellido_cliente}
        </strong>
        "?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleEliminar} disabled={deshabilitado}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCliente;
