import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { supabase } from "../../assets/database/supabaseconfig";

const TIPOS_EMPLEADO = ["Administrador", "Cajero", "Vendedor", "Supervisor", "Almacén"];

const ModalEdicionEmpleado = ({
  mostrarModal,
  setMostrarModal,
  empleadoEditar,
  setEmpleadoEditar,
  cargarEmpleados,
  setToast,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setEmpleadoEditar((prev) => ({ ...prev, [name]: value }));
  };

  const actualizarEmpleado = async () => {
    try {
      if (
        !empleadoEditar.nombre_empleado.trim() ||
        !empleadoEditar.apellido_empleado.trim() ||
        !empleadoEditar.pin_acceso.trim() ||
        !empleadoEditar.tipo_empleado
      ) {
        setToast({ mostrar: true, mensaje: "Debe llenar todos los campos.", tipo: "advertencia" });
        return;
      }

      setMostrarModal(false);

      const { error } = await supabase
        .from("empleados")
        .update({
          nombre_empleado: empleadoEditar.nombre_empleado,
          apellido_empleado: empleadoEditar.apellido_empleado,
          pin_acceso: empleadoEditar.pin_acceso,
          tipo_empleado: empleadoEditar.tipo_empleado,
        })
        .eq("id_empleado", empleadoEditar.id_empleado);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: `Error al actualizar el empleado ${empleadoEditar.nombre_empleado}.`,
          tipo: "error",
        });
        return;
      }

      await cargarEmpleados();
      setToast({
        mostrar: true,
        mensaje: `Empleado "${empleadoEditar.nombre_empleado} ${empleadoEditar.apellido_empleado}" actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch {
      setToast({ mostrar: true, mensaje: "Error inesperado al actualizar empleado.", tipo: "error" });
    }
  };

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarEmpleado();
    setDeshabilitado(false);
  };

  if (!empleadoEditar) return null;

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_empleado"
              value={empleadoEditar.nombre_empleado}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido_empleado"
              value={empleadoEditar.apellido_empleado}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el apellido"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>PIN de acceso</Form.Label>
            <Form.Control
              type="password"
              name="pin_acceso"
              value={empleadoEditar.pin_acceso}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el PIN"
              maxLength={10}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de empleado</Form.Label>
            <Form.Select
              name="tipo_empleado"
              value={empleadoEditar.tipo_empleado}
              onChange={manejoCambioInputEdicion}
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
          onClick={handleActualizar}
          disabled={empleadoEditar.nombre_empleado.trim() === "" || deshabilitado}
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEmpleado;
