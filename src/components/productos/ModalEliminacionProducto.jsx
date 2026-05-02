import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../../assets/database/supabaseconfig";

const ModalEliminacionProducto = ({
  mostrarModal,
  setMostrarModal,
  productoAEliminar,
  cargarProductos,
  setToast,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      setMostrarModal(false);

      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", productoAEliminar.id_producto);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: `Error al eliminar el producto "${productoAEliminar.nombre_producto}".`,
          tipo: "error",
        });
        return;
      }

      if (productoAEliminar.imagen_url) {
        const nombreImagen = productoAEliminar.imagen_url.split("/").pop();
        await supabase.storage
          .from("imagenes_productos")
          .remove([nombreImagen]);
      }

      await cargarProductos();
      setToast({
        mostrar: true,
        mensaje: `Producto "${productoAEliminar.nombre_producto}" eliminado exitosamente.`,
        tipo: "exito",
      });
    } catch {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al eliminar el producto.",
        tipo: "error",
      });
    }
  };

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarProducto();
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
        ¿Estás seguro de que deseas eliminar el producto "
        <strong>{productoAEliminar?.nombre_producto}</strong>"?
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

export default ModalEliminacionProducto;
