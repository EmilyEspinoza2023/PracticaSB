import React from "react";
import { Form } from "react-bootstrap";

const FormularioRegistroProducto = ({
  nuevoProducto,
  manejoCambioInput,
  imagenArchivo,
  setImagenArchivo,
  categorias,
}) => (
  <Form>
    <Form.Group className="mb-3">
      <Form.Label>Nombre</Form.Label>
      <Form.Control
        type="text"
        name="nombre_producto"
        value={nuevoProducto.nombre_producto}
        onChange={manejoCambioInput}
        placeholder="Nombre del producto"
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Descripción</Form.Label>
      <Form.Control
        as="textarea"
        rows={2}
        name="descripcion_producto"
        value={nuevoProducto.descripcion_producto}
        onChange={manejoCambioInput}
        placeholder="Descripción del producto"
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Precio</Form.Label>
      <Form.Control
        type="number"
        name="precio_producto"
        value={nuevoProducto.precio_producto}
        onChange={manejoCambioInput}
        placeholder="0.00"
        min="0"
        step="0.01"
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Categoría</Form.Label>
      <Form.Select
        name="categoria_producto"
        value={nuevoProducto.categoria_producto}
        onChange={manejoCambioInput}
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
      <Form.Control
        type="file"
        accept="image/*"
        onChange={(e) => setImagenArchivo(e.target.files[0] || null)}
      />
      {imagenArchivo && (
        <Form.Text className="text-muted">Seleccionado: {imagenArchivo.name}</Form.Text>
      )}
    </Form.Group>
  </Form>
);

export default FormularioRegistroProducto;
