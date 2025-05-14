
import React, { useState, useEffect } from 'react'; 
import { Container, Button, Col, Row } from "react-bootstrap";
import TablaProductos from '../components/producto/TablaProductos';// Importa el componente de tabla
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEdicionProductos from '../components/producto/ModalEdicionProductos';
import ModalEliminacionProductos from '../components/producto/ModalEliminacionProductos';


// Declaración del componente Categorias
const Productos = () => {
  // Estados para manejar los datos, carga y errores
  const [ListaProducto, setListaProducto] = useState([]); // Almacena los datos de la API
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });


   const [productoFiltradas, setProductoFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
  
    const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página
  

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ProductoAEliminar, setProductoAEliminar] = useState(null);
  
  const [productoEditado, setProductoEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerProductos = async () => { // Método renombrado a español
    try {
      const respuesta = await fetch('http://localhost:3001/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar las productos');
      }
      const datos = await respuesta.json();
      setListaProducto(datos);    // Actualiza el estado con los datos
      setProductoFiltradas(datos  )
      setCargando(false);           // Indica que la carga terminó
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error
      setCargando(false);           // Termina la carga aunque haya error
    }
  };

  // Obtener categorías para el dropdown
  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3001/api/categoria');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    obtenerProductos();            // Ejecuta la función al montar el componente
    obtenerCategorias();
  }, []);                           // Array vacío para que solo se ejecute una vez

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto || !nuevoProducto.id_categoria || 
        !nuevoProducto.precio_unitario || !nuevoProducto.stock) {
      setErrorCarga("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      const respuesta = await fetch('http://localhost:3001/api/registrarproducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      });

      if (!respuesta.ok) throw new Error('Error al agregar el producto');

      await obtenerProductos();
      setNuevoProducto({
        nombre_producto: '',
        descripcion_producto: '',
        id_categoria: '',
        precio_unitario: '',
        stock: '',
        imagen: ''
      });
      setMostrarModal(false);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };


  
const eliminarProducto = async () => {
  if (!ProductoAEliminar) return;

  try {
    const respuesta = await fetch(`http://localhost:3001/api/eliminarproductos/${ProductoAEliminar.id_producto}`, {
      method: 'DELETE',
    });

    if (!respuesta.ok) {
      throw new Error('Error al eliminar la producto');
    }

    await obtenerProductos(); // Refresca la lista
    setMostrarModalEliminacion(false);
    establecerPaginaActual(1); // Regresa a la primera página
    setProductoAEliminar(null);
    setErrorCarga(null);
  } catch (error) {
    setErrorCarga(error.message);
  }
};


const abrirModalEliminacion = (producto) => {
  setProductoAEliminar(producto);
  setMostrarModalEliminacion(true);
};


const manejarCambioInputEdicion = (e) => {
  const { name, value } = e.target;
  setProductoEditado(prev => ({
    ...prev,
    [name]: value
  }));
};


const actualizarProductos = async () => {
  if (!productoEditado?.nombre_producto 
    || !productoEditado?.descripcion_producto
    || !productoEditado?.id_categoria
    || !productoEditado?.precio_unitario
    || !productoEditado?.stock)
     {
    setErrorCarga("Por favor, completa todos los campos antes de guardar.");
    return;
  }

  try {
    const respuesta = await fetch(`http://localhost:3001/api/actualizarproductos/${productoEditado.id_producto}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre_producto: productoEditado.nombre_producto,
        descripcion_producto: productoEditado.descripcion_producto,
        id_categoria: productoEditado.id_categoria,
        precio_unitario: productoEditado.precio_unitario,
        stock: productoEditado.stock,
      }),
    });

    if (!respuesta.ok) {
      throw new Error('Error al actualizar la producto');
    }

    await obtenerProductos();
    setMostrarModalEdicion(false);
    setProductoEditado(null);
    setErrorCarga(null);
  } catch (error) {
    setErrorCarga(error.message);
  }
};


const abrirModalEdicion = (producto) => {
  setProductoEditado(producto);
  setMostrarModalEdicion(true);
};


  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    establecerPaginaActual(1);
    
    const filtradas = ListaProducto.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(texto) ||
        producto.descripcion_producto.toLowerCase().includes(texto)
    );
    setProductoFiltradas(filtradas);
  };
  

  // Calcular elementos paginados
    const productoPaginadas = productoFiltradas.slice(
      (paginaActual - 1) * elementosPorPagina,
      paginaActual * elementosPorPagina
    );

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Productos</h4>

        <Row>
        <Col lg={2} md={4} sm={4} xs={5}> 
        <Button variant="primary" onClick={() => setMostrarModal(true)}  style={{ width: "100%"}}>
          Nuevo Producto
        </Button>
        </Col>

        <Col lg={6} md={8} sm={8} xs={7}> 
              <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
          </Col>

        </Row>
        <br/>


        {/* Pasa los estados como props al componente TablaCategorias */}
        <TablaProductos
          productos={productoPaginadas} 
          cargando={cargando} 
          error={errorCarga} 
          totalElementos={ListaProducto.length} // Total de elementos
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorCarga}
          categorias={listaCategorias}
        />

        <ModalEliminacionProductos
          mostrarModalEliminacion={mostrarModalEliminacion}
          setMostrarModalEliminacion={setMostrarModalEliminacion}
          eliminarProducto={eliminarProducto}
        />


        <ModalEdicionProductos
          mostrarModalEdicion={mostrarModalEdicion}
          setMostrarModalEdicion={setMostrarModalEdicion}
          productoEditado={productoEditado}
          manejarCambioInputEdicion={manejarCambioInputEdicion}
          actualizarProducto={actualizarProductos}
          errorCarga={errorCarga}
        />


      </Container>
    </>
  );
};

// Exportación del componente
export default Productos;