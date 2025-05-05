// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaUsuarios from '../components/usuario/TablaUsuarios'; // Componente de tabla de usuarios
import ModalRegistroUsuarios from '../components/usuario/ModalRegistroUsuarios'; // Componente de modal para registro
import ModalEliminacionUsuarios from '../components/usuario/ModalEliminacionUsuarios'; // Modal para eliminar usuarios
import ModalEdicionUsuarios from '../components/usuario/ModalEdicionUsuarios'; // Modal para editar usuarios
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';

const Usuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    contraseña: ''
  });

  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 4;

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const [usuarioEditado, setUsuarioEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch('http://localhost:3001/api/usuarios');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los usuarios');
      }
      const datos = await respuesta.json();
      setListaUsuarios(datos);
      setUsuariosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarUsuario = async () => {
    if (!nuevoUsuario.usuario || !nuevoUsuario.contraseña) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3001/api/registrarusuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!respuesta.ok) {
        throw new Error('Error al agregar el usuario');
      }

      await obtenerUsuarios();
      setNuevoUsuario({ usuario: '', contraseña: '' });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);

    const filtrados = listaUsuarios.filter(
      (usuario) =>
        usuario.usuario.toLowerCase().includes(texto)
    );
    setUsuariosFiltrados(filtrados);
  };

  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const eliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    try {
      const respuesta = await fetch(`http://localhost:3001/api/eliminarusuario/${usuarioAEliminar.id_usuario}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      await obtenerUsuarios();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setUsuarioAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const actualizarUsuario = async () => {
    if (!usuarioEditado?.usuario || !usuarioEditado?.contraseña) {
      setErrorCarga("Por favor, completa todos los campos obligatorios antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:3001/api/actualizarusuario/${usuarioEditado.id_usuario}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioEditado),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      await obtenerUsuarios();
      setMostrarModalEdicion(false);
      setUsuarioEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditado(usuario);
    setMostrarModalEdicion(true);
  };

  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Usuarios</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
              Nuevo Usuario
            </Button>
          </Col>
          <Col lg={6} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>
        </Row>
        <br />

        <TablaUsuarios
          usuarios={usuariosPaginados}
          cargando={cargando}
          error={errorCarga}
          totalElementos={listaUsuarios.length}
          elementosPorPagina={elementosPorPagina}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          abrirModalEliminacion={abrirModalEliminacion}
          abrirModalEdicion={abrirModalEdicion}
        />

        <ModalRegistroUsuarios
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoUsuario={nuevoUsuario}
          manejarCambioInput={manejarCambioInput}
          agregarUsuario={agregarUsuario}
          errorCarga={errorCarga}
        />

        <ModalEliminacionUsuarios
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarUsuario={eliminarUsuario}
        />

        <ModalEdicionUsuarios
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          usuarioEditado={usuarioEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarUsuario={actualizarUsuario}
          errorCarga={errorCarga}
        />
      </Container>
    </>
  );
};

export default Usuarios;