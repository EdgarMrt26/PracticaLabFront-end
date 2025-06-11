// Importaciones necesarias para el componente visual
import React from "react";
import { Table, Button } from "react-bootstrap";
import Paginacion from "../ordenamiento/Paginacion";
import "bootstrap/dist/css/bootstrap.min.css";

// Componente funcional de tabla de ventas
const TablaVentas = ({
  ventas,
  cargando,
  error,
  obtenerDetalles,
  abrirModalEliminacion,
  abrirModalActualizacion,
  generarPDFDetalleVenta,
  elementosPorPagina,
  paginaActual,
  totalElementos,
  establecerPaginaActual,
}) => {
  // Muestra mensaje de carga si los datos están en proceso
  if (cargando) {
    return <div>Cargando ventas...</div>;
  }

  // Muestra mensaje de error si ocurre alguno
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Renderiza la tabla con los datos recibidos
  return (
    <div className="d-flex flex-column justify-content-between" style={{ minHeight: "60vh" }}>
      <div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Fecha Venta</th>
              <th>Cliente</th>
              <th>Empleado</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id_venta}>
                <td>{venta.id_venta}</td>
                <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                <td>{venta.nombre_cliente}</td>
                <td>{venta.nombre_empleado}</td>
                <td>C$ {venta.total_venta.toFixed(2)}</td>
                <td>
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="me-2"
                    onClick={() => obtenerDetalles(venta.id_venta)}
                  >
                    <i className="bi bi-list-ul"></i>
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => generarPDFDetalleVenta(venta)}
                  >
                    <i className="bi bi-filetype-pdf"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(venta)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => abrirModalActualizacion(venta)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Paginación común */}
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
export default TablaVentas;