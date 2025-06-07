import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from "react-bootstrap";
import logo from "../../assets/llave.jpg"; // Corrección de la ruta
import "bootstrap-icons/font/bootstrap-icons.css"; // Importación de íconos de Bootstrap
import "../../App.css"; // Estilos personalizados de la aplicación

const Encabezado = () => {
  // Estado para controlar el colapso del menú lateral
  const [estaColapsado, setEstaColapsado] = useState(false);
  
  // Hook para manejar la navegación entre rutas
  const navegar = useNavigate();
  
  // Hook para obtener la ubicación actual de la ruta
  const ubicacion = useLocation();

  // Validación del estado de autenticación con localStorage
  const estaLogueado = !!localStorage.getItem("usuario") && !!localStorage.getItem("contraseña");

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setEstaColapsado(false); // Cierra el menú lateral
    localStorage.removeItem("usuario"); // Elimina el usuario de localStorage
    localStorage.removeItem("contraseña"); // Elimina la contraseña de localStorage
    navegar("/"); // Redirige a la página principal
  };

  // Función para alternar el estado del menú lateral
  const alternarColapso = () => setEstaColapsado(!estaColapsado);

  // Función genérica de navegación
  const navegarA = (ruta) => {
    navegar(ruta); // Navega a la ruta especificada
    setEstaColapsado(false); // Cierra el menú lateral
  };

  return (
    // Barra de navegación fija en la parte superior
    <Navbar expand="sm" fixed="top" className="color-navbar">
      <Container>
        {/* Logo y nombre de la ferretería */}
        <Navbar.Brand
          onClick={() => navegarA("/inicio")}
          className="text-white"
          style={{ cursor: "pointer" }}
        >
          <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" />{" "}
          <strong>Ferretería Martínez</strong>
        </Navbar.Brand>

        {/* Botón para alternar el menú lateral en pantallas pequeñas */}
        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-sm"
          onClick={alternarColapso}
        />

        {/* Menú lateral (Offcanvas) */}
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          aria-labelledby="offcanvasNavbarLabel-expand-sm"
          placement="end"
          show={estaColapsado}
          onHide={() => setEstaColapsado(false)}
        >
          {/* Encabezado del menú lateral */}
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel-expand-sm"
              className={estaColapsado ? "color-texto-marca" : "text-white"}
            >
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>

          {/* Cuerpo del menú lateral */}
          <Offcanvas.Body>
            {/* Navegación */}
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {estaLogueado ? (
                <>
                  {/* Opción de navegación a Inicio */}
                  <Nav.Link
                    onClick={() => navegarA("/inicio")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi-house-door-fill me-2"></i> : null}
                    <strong>Inicio</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Usuarios */}
                  <Nav.Link
                    onClick={() => navegarA("/Usuarios")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi-house-door-fill me-2"></i> : null}
                    <strong>Usuarios</strong>
                  </Nav.Link>

                  {/* Dropdown de Productos */}
                  <NavDropdown 
                    title={
                      <span>
                        {estaColapsado && <i className="bi-bag-heart-fill me-2"></i>}
                        Productos
                      </span>
                    }
                    id="basic-nav-dropdown"  
                    className={estaColapsado ? "titulo-negro" : "titulo-blanco"}
                  >
                    <NavDropdown.Item
                      onClick={() => navegarA("/productos")}
                      className="text-black"
                    >
                      {estaColapsado ? <i className="bi-box2-heart-fill me-2"></i> : null}
                      <strong>Gestión Productos</strong>
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      onClick={() => navegarA("/categorias")}
                      className="text-black"
                    >
                      {estaColapsado ? <i className="bi-bookmarks-fill me-2"></i> : null}
                      <strong>Gestión Categorías</strong>
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      onClick={() => navegarA("/Catalogo")}
                      className="text-black"
                    >
                      {estaColapsado ? <i className="bi-images me-2"></i> : null}
                      <strong>Catálogo Productos</strong>
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Dropdown de Personas */}
                  <NavDropdown 
                    title={
                      <span>
                        {estaColapsado && <i className="bi-bag-heart-fill me-2"></i>}
                        Personas
                      </span>
                    }
                    id="basic-nav-dropdown"  
                    className={estaColapsado ? "titulo-negro" : "titulo-blanco"}
                  >
                    <NavDropdown.Item
                      onClick={() => navegarA("/Clientes")}
                      className="text-black"
                    >
                      {estaColapsado ? <i className="bi-box2-heart-fill me-2"></i> : null}
                      <strong>Gestión Clientes</strong>
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      onClick={() => navegarA("/Empleados")}
                      className="text-black"
                    >
                      {estaColapsado ? <i className="bi-bookmarks-fill me-2"></i> : null}
                      <strong>Gestión Empleados</strong>
                    </NavDropdown.Item>
                  </NavDropdown>

                  {/* Opción de navegación a Gráfico */}
                  <Nav.Link
                    onClick={() => navegarA("/Grafico")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi-house-door-fill me-2"></i> : null}
                    <strong>Gráfico</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Dashboards */}
                  <Nav.Link
                    onClick={() => navegarA("/Dashboards")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi-house-door-fill me-2"></i> : null}
                    <strong>Dashboards</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Ventas */}
                  <Nav.Link
                    onClick={() => navegarA("/Ventas")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi-house-door-fill me-2"></i> : null}
                    <strong>Ventas</strong>
                  </Nav.Link>

                  {/* Opción de navegación a Compras */}
                  <Nav.Link
                    onClick={() => navegarA("/Compras")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi-house-door-fill me-2"></i> : null}
                    <strong>Compras</strong>
                  </Nav.Link>

                  {/* Opción de cerrar sesión */}
                  <Nav.Link
                    onClick={cerrarSesion}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi-box-arrow-right me-2"></i> : null}
                    <strong>Cerrar Sesión</strong>
                  </Nav.Link>
                </>
              ) : (
                ubicacion.pathname === "/" && (
                  // Opción de iniciar sesión (solo en la ruta raíz)
                  <Nav.Link
                    onClick={() => navegarA("/")}
                    className={estaColapsado ? "text-black" : "text-white"}
                  >
                    {estaColapsado ? <i className="bi-box-arrow-in-right me-2"></i> : null}
                    <strong>Iniciar Sesión</strong>
                  </Nav.Link>
                )
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;