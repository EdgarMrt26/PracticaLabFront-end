// Importaciones necesarias para el componente visual
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Paginacion from '../ordenamiento/Paginacion';

// Declaración del componente TablaCategorias que recibe props
const TablaProductos = ({ productos,
    cargando,
     error,
     totalElementos,
     elementosPorPagina,
     paginaActual,
     establecerPaginaActual,
     abrirModalEliminacion,
     abrirModalEdicion  
    }) => {
  // Renderizado condicional según el estado recibido por props
  if (cargando) {
    return <div>Cargando productos...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;         // Muestra error si ocurre
  }
  


  

  // Renderizado de la tabla con los datos recibidos
  return (
    <>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID producto</th>
          <th>Nombre de producto</th>
          <th>Descripcion del producto</th>
          <th>ID categoria</th>
          <th>Precio Unitario</th>
          <th>Stock</th>
          <th>imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
      {productos.map((producto) => (
          <tr key={producto.id_producto}>
          <td>{producto.id_producto}</td>
          <td>{producto.nombre_producto}</td>
          <td>{producto.descripcion_producto}</td>
          <td>{producto.id_categoria}</td>
          <td>C$ {producto.precio_unitario}</td>
          <td>{producto.stock}</td>
          <td>
            {producto.imagen ? (
              <img
                src={`data:image/png;base64,${producto.imagen}`}
                alt={producto.nombre_producto}
                style={{ maxWidth: '100px' }}
              />
            ) : (
              'Sin imagen'
            )}
          </td>
                
          <td>

            <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(producto)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>


                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(producto)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <Paginacion
        elementosPorPagina={elementosPorPagina}
        totalElementos={totalElementos}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />
    </>
  );
};

// Exportación del componente
export default TablaProductos;