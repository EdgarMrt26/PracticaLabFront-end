import React from "react";
import { Table, Button, Card } from "react-bootstrap";
import Paginacion from "../ordenamiento/Paginacion";
import "bootstrap/dist/css/bootstrap.min.css";

// Declaración del componente TablaEmpleados que recibe props
const TablaEmpleados = ({
  empleados,
  cargando,
  error,
  totalElementos,
  elementosPorPagina,
  paginaActual,
  establecerPaginaActual,
  abrirModalEliminacion,
  abrirModalEdicion,
  generarPDFDetalleEmpleado, // Añadido para generar PDF
}) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando empleados...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>; // Muestra error si ocurre
  }

  // Renderizado de la tabla y tarjetas con los datos recibidos
  return (
    <div className="d-flex flex-column justify-content-between" style={{ minHeight: "60vh" }}>
      {/* Vista de tabla para pantallas medianas y grandes */}
      <div className="d-none d-md-block">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Primer Nombre</th>
              <th>Segundo Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Celular</th>
              <th>Cargo</th>
              <th>Fecha de Contratación</th>
              <th>Acciones</th> {/* Columna para acciones */}
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id_empleado}>
                <td>{empleado.id_empleado}</td>
                <td>{empleado.primer_nombre}</td>
                <td>{empleado.segundo_nombre}</td>
                <td>{empleado.primer_apellido}</td>
                <td>{empleado.segundo_apellido}</td>
                <td>{empleado.celular}</td>
                <td>{empleado.cargo}</td>
                <td>{new Date(empleado.fecha_contratacion).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalEdicion(empleado)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => generarPDFDetalleEmpleado(empleado)}
                  >
                    <i className="bi bi-filetype-pdf"></i>
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
      </div>

      {/* Vista de tarjetas para pantallas pequeñas */}
      <div className="d-block d-md-none">
        {empleados.map((empleado) => (
          <Card key={empleado.id_empleado} className="mb-2 shadow-sm">
            <Card.Body>
              <Card.Title>
                {empleado.primer_nombre} {empleado.primer_apellido}
              </Card.Title>
              <Card.Text>
                <strong>ID:</strong> {empleado.id_empleado}
              </Card.Text>
              <Card.Text>
                <strong>Celular:</strong> {empleado.celular}
              </Card.Text>
              <Card.Text>
                <strong>Cargo:</strong> {empleado.cargo}
              </Card.Text>
              <Card.Text>
                <strong>Fecha:</strong>{" "}
                {new Date(empleado.fecha_contratacion).toLocaleDateString()}
              </Card.Text>
              <div>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(empleado)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={() => generarPDFDetalleEmpleado(empleado)}
                >
                  <i className="bi bi-filetype-pdf"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(empleado)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Paginación común para ambas vistas */}
      <div className="mt-auto">
        <Paginacion
          elementosPorPagina={elementosPorPagina}
          totalElementos={totalElementos}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
        />
      </div>
    </div>
  );
};

// Exportación del componente
export default TablaEmpleados;