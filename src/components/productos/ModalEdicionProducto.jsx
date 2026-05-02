import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { supabase } from "../../assets/database/supabaseconfig";

const ModalEdicionProducto = ({
  mostrarModal,
  setMostrarModal,
  productoEditar,
  setProductoEditar,
  categorias,
  cargarProductos,
  setToast,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);
  const [imagenArchivoEdicion, setImagenArchivoEdicion] = useState(null);

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditar((prev) => ({ ...prev, [name]: value }));
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setImagenArchivoEdicion(null);
  };

  const actualizarProducto = async () => {
    try {
      if (
        !productoEditar.nombre_producto.trim() ||
        !productoEditar.categoria_producto ||
        !productoEditar.precio_producto
      ) {
        setToast({
          mostrar: true,
          mensaje: "Nombre, categoría y precio son obligatorios.",
          tipo: "advertencia",
        });
        return;
      }

      const datosActualizados = {
        nombre_producto: productoEditar.nombre_producto,
        descripcion_producto: productoEditar.descripcion_producto,
        precio_producto: parseFloat(productoEditar.precio_producto),
        categoria_producto: parseInt(productoEditar.categoria_producto),
        imagen_url: productoEditar.imagen_url,
      };

      if (imagenArchivoEdicion) {
        const nombreUnico = `${Date.now()}_${imagenArchivoEdicion.name}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreUnico, imagenArchivoEdicion);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreUnico);

        datosActualizados.imagen_url = urlData.publicUrl;

        if (productoEditar.imagen_url) {
          const nombreAnterior = productoEditar.imagen_url.split("/").pop();
          await supabase.storage
            .from("imagenes_productos")
            .remove([nombreAnterior]);
        }
      }

      const { error } = await supabase
        .from("productos")
        .update(datosActualizados)
        .eq("id_producto", productoEditar.id_producto);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al actualizar el producto.",
          tipo: "error",
        });
        return;
      }

      cerrarModal();
      await cargarProductos();
      setToast({
        mostrar: true,
        mensaje: `Producto "${productoEditar.nombre_producto}" actualizado exitosamente.`,
        tipo: "exito",
      });
    } catch {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al actualizar el producto.",
        tipo: "error",
      });
    }
  };

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarProducto();
    setDeshabilitado(false);
  };

  if (!productoEditar) return null;

  return (
    <Modal
      show={mostrarModal}
      onHide={cerrarModal}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre_producto"
              value={productoEditar.nombre_producto}
              onChange={manejoCambioInputEdicion}
              placeholder="Nombre del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="descripcion_producto"
              value={productoEditar.descripcion_producto || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Descripción del producto"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio_producto"
              value={productoEditar.precio_producto}
              onChange={manejoCambioInputEdicion}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria_producto"
              value={productoEditar.categoria_producto}
              onChange={manejoCambioInputEdicion}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_categoria}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            {productoEditar.imagen_url && !imagenArchivoEdicion && (
              <div className="mb-2">
                <img
                  src={productoEditar.imagen_url}
                  alt="Imagen actual"
                  style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6 }}
                />
                <Form.Text className="d-block text-muted">Imagen actual</Form.Text>
              </div>
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImagenArchivoEdicion(e.target.files[0] || null)}
            />
            {imagenArchivoEdicion && (
              <Form.Text className="text-muted">
                Nueva imagen: {imagenArchivoEdicion.name}
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cerrarModal}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={
            !productoEditar.nombre_producto.trim() ||
            !productoEditar.categoria_producto ||
            deshabilitado
          }
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;
