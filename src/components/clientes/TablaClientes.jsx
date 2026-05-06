import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaClientes = ({ clientes, abrirModalEdicion, abrirModalEliminacion }) => {
  return (
    <Table striped borderless hover responsive size="sm" className="app-tabla mb-0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th className="d-none d-md-table-cell">Celular</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id_cliente}>
            <td>{cliente.id_cliente}</td>
            <td>{cliente.nombre_cliente}</td>
            <td>{cliente.apellido_cliente}</td>
            <td className="d-none d-md-table-cell">{cliente.celular_cliente}</td>
            <td className="text-center">
              <Button
                variant="outline-warning"
                size="sm"
                className="me-1"
                onClick={() => abrirModalEdicion(cliente)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => abrirModalEliminacion(cliente)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaClientes;
