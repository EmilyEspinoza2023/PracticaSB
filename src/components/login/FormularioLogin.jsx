import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import logo from "../../assets/logo.png";

const FormularioLogin = ({ usuario, contrasena, error, setUsuario, setContrasena, iniciarSesion }) => {
  const manejarEnter = (e) => {
    if (e.key === "Enter") iniciarSesion();
  };

  return (
    <div className="login-card">
      <div className="login-card-header">
        <img src={logo} alt="Logo" className="login-logo" />
        <h3>Discosa</h3>
        <p>Sistema de gestión de productos</p>
      </div>

      <div className="login-card-body">
        {error && (
          <Alert variant="danger" className="py-2 small">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Form onKeyDown={manejarEnter}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">
              <i className="bi bi-envelope me-1"></i> Correo electrónico
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="correo@ejemplo.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="email"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold small">
              <i className="bi bi-lock me-1"></i> Contraseña
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              autoComplete="current-password"
            />
          </Form.Group>

          <Button className="w-100" onClick={iniciarSesion} size="lg">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Iniciar Sesión
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default FormularioLogin;
