import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../../assets/database/supabaseconfig";

const ModalEliminacionEmpleado = ({
  mostrarModal,
  setMostrarModal,
  empleadoAEliminar,
  cargarEmpleados,
  setToast,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;
    try {
      setMostrarModal(false);

      const { error } = await supabase
        .from("empleados")
        .delete()
        .eq("id_empleado", empleadoAEliminar.id_empleado);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el empleado ${empleadoAEliminar.nombre_empleado}.`,
          tipo: "error",
        });
        return;
      }

      await cargarEmpleados();
      setToast({
        mostrar: true,
        mensaje: `Empleado "${empleadoAEliminar.nombre_empleado} ${empleadoAEliminar.apellido_empleado}" eliminado exitosamente.`,
        tipo: "exito",
      });
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al eliminar empleado.", tipo: "error" });
    }
  };

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarEmpleado();
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
        ¿Estás seguro de que deseas eliminar al empleado "
        <strong>
          {empleadoAEliminar?.nombre_empleado} {empleadoAEliminar?.apellido_empleado}
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

export default ModalEliminacionEmpleado;
