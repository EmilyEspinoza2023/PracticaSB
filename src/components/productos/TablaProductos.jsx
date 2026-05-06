import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaProductos = ({ productos, abrirModalEdicion, abrirModalEliminacion }) => (
  <Table striped borderless hover responsive size="sm" className="app-tabla mb-0">
    <thead>
      <tr>
        <th>ID</th>
        <th>Imagen</th>
        <th>Nombre</th>
        <th className="d-none d-md-table-cell">Descripción</th>
        <th>Precio</th>
        <th className="d-none d-md-table-cell">Categoría</th>
        <th className="text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {productos.map((producto) => (
        <tr key={producto.id_producto}>
          <td>{producto.id_producto}</td>
          <td>
            {producto.imagen_url ? (
              <img
                src={producto.imagen_url}
                alt={producto.nombre_producto}
                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
              />
            ) : (
              <i className="bi bi-image text-muted fs-4"></i>
            )}
          </td>
          <td>{producto.nombre_producto}</td>
          <td className="d-none d-md-table-cell">{producto.descripcion_producto}</td>
          <td>C$ {parseFloat(producto.precio_producto).toFixed(2)}</td>
          <td className="d-none d-md-table-cell">
            {producto.categorias?.nombre_categoria ?? "—"}
          </td>
          <td className="text-center">
            <Button
              variant="outline-warning"
              size="sm"
              className="me-1"
              onClick={() => abrirModalEdicion(producto)}
            >
              <i className="bi bi-pencil"></i>
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => abrirModalEliminacion(producto)}
            >
              <i className="bi bi-trash"></i>
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default TablaProductos;
