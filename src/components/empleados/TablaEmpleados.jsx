import React from "react";
import { Table, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaEmpleados = ({ empleados, abrirModalEdicion, abrirModalEliminacion }) => {
  return (
    <Table striped borderless hover responsive size="sm" className="app-tabla mb-0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th className="d-none d-md-table-cell">Correo</th>
          <th className="d-none d-md-table-cell">Celular</th>
          <th className="d-none d-md-table-cell">Tipo</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {empleados.map((empleado) => (
          <tr key={empleado.id_empleado}>
            <td>{empleado.id_empleado}</td>
            <td>{empleado.nombre_empleado}</td>
            <td>{empleado.apellido_empleado}</td>
            <td className="d-none d-md-table-cell">{empleado.email || "-"}</td>
            <td className="d-none d-md-table-cell">{empleado.celular || "-"}</td>
            <td className="d-none d-md-table-cell">{empleado.tipo_empleado}</td>
            <td className="text-center">
              <Button
                variant="outline-warning"
                size="sm"
                className="me-1"
                onClick={() => abrirModalEdicion(empleado)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => abrirModalEliminacion(empleado)}
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

export default TablaEmpleados;
