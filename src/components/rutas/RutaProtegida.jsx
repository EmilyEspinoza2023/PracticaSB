import React from "react";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const RutaProtegida = ({ children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <Spinner animation="border" style={{ color: "var(--rojo)" }} />
          <p className="mt-3 text-muted">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return usuario ? children : <Navigate to="/login" replace />;
};

export default RutaProtegida;
