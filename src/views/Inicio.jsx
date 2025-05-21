import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const Inicio = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      navegar("/");
    } else {
      setNombreUsuario(usuarioGuardado);
    }
  }, [navegar]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    navegar("/");
  };

  return (
    <Container style={{ marginTop: "95px" }}>
        <h1>¡Bienvenido, {nombreUsuario}!</h1>
        <p>Estás en la página de inicio.</p>
        <button onClick={cerrarSesion} type="button" className="btn btn-primary">
        Cerrar Sesión
        </button>
    </Container>
  );
};

export default Inicio;