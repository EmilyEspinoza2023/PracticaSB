import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/login/FormularioLogin";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const navegar = useNavigate();
  const { login } = useAuth();

  const iniciarSesion = async () => {
    if (!usuario || !contrasena) {
      setError("Por favor ingresa usuario y contraseña.");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      await login(usuario, contrasena);
      navegar("/");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario-supabase");
    if (usuarioGuardado) navegar("/");
  }, [navegar]);

  return (
    <div className="login-contenedor">
      <FormularioLogin
        usuario={usuario}
        contrasena={contrasena}
        error={error}
        setUsuario={setUsuario}
        setContrasena={setContrasena}
        iniciarSesion={iniciarSesion}
        cargando={cargando}
      />
    </div>
  );
};

export default Login;
