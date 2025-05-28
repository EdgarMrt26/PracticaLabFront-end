import React, { useState, useEffect } from 'react';
import { Container, Button, Col, Row } from "react-bootstrap";
import TablaProductos from '../components/producto/TablaProductos';// Importa el componente de tabla
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalEdicionProductos from '../components/producto/ModalEdicionProductos';
import ModalEliminacionProductos from '../components/producto/ModalEliminacionProductos';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Declaración del componente Categorias
const Productos = () => {
  // Estados para manejar los datos, carga y errores
  const [ListaProducto, setListaProducto] = useState([]); // Almacena los datos de la API
  const [listaCategorias, setListaCategorias] = useState([]); // Lista de categorías para mapeo
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

  // ESTADO CORREGIDO: Usando 'productoFiltradas' consistentemente
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
      setProductoFiltradas(datos); // Inicializa productos filtrados con todos los productos
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
  }, []);                          // Array vacío para que solo se ejecute una vez

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
      setErrorCarg(null);
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
      || !productoEditado?.stock) {
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

  const generarPDFProductos = () => {
    const doc = new jsPDF();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F'); // Barra superior azul
    // Título centrado con texto blanco
    doc.setTextColor(255, 255, 255); // Color del título
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    // Definición de columnas. Aseguramos que 'ID' esté para coincidir con los datos.
    const columnas = ["ID", "Nombre", "Descripción", "Categoría", "Precio", "Stock"];

    // Corrección: Usar 'productoFiltradas' y corregir el typo 'descripcion_profucto'
    // También, mapear id_categoria a nombre_categoria para mejor legibilidad.
    const filas = productoFiltradas.map((producto) => {
      const categoria = listaCategorias.find(cat => cat.id_categoria === producto.id_categoria);
      const nombreCategoria = categoria ? categoria.nombre_categoria : 'Desconocida'; // Si no encuentra la categoría

      return [
        producto.id_producto,
        producto.nombre_producto,
        producto.descripcion_producto, // CORREGIDO: typo aquí
        nombreCategoria, // Usar el nombre de la categoría
        `C$ ${producto.precio_unitario}`,
        producto.stock,
      ];
    });


    // Marcador para mostrar el total de páginas
    const totalPaginas = "{total_pages_count_string}"; // Esto es para jsPDF-autotable para el conteo final

    //Configuración de la tabla
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: "auto", // Ajuste de ancho automatico
      columnStyles: {
        0: { cellWidth: 'auto' }, // ID
        1: { cellWidth: 'auto' }, // Nombre
        2: { cellWidth: 'auto' }, // Descripción
        3: { cellWidth: 'auto' }, // Categoría
        4: { cellWidth: 'auto' }, // Precio
        5: { cellWidth: 'auto' }, // Stock
      },
      pageBreak: "auto",
      rowPageBreak: "auto",
      // Hook que se ejecuta al dibujar cada página
      didDrawPage: function (data) {
        // Altura y ancho de la página actual
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();

        // Número de página actual
        const numeroPagina = doc.internal.getNumberOfPages();

        // Definir texto de número de página en el centro del documento
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
      },
    });

    //Actualizar el marcador con el total real de páginas
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPaginas);
    }

    // Guardar el pdf con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;

    // Guardar el documento PDF
    doc.save(nombreArchivo);
  }

  const generarPDFDetalleProducto = (producto) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(producto.nombre_producto, anchoPagina / 2, 18, { align: "center" });

    let posicionY = 50;

    // Imagen
    if (producto.imagen) {
      // CORRECCIÓN: Asegurarse de que la cadena Base64 tenga el prefijo del tipo MIME
      // Asumimos que la imagen es PNG, como se usa en TablaProductos.jsx
      const base64ImageWithPrefix = `data:image/png;base64,${producto.imagen}`;
      try {
        const propiedadesImagen = pdf.getImageProperties(base64ImageWithPrefix);
        const anchoImagen = 100;
        const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
        const posicionX = (anchoPagina - anchoImagen) / 2;

        // CORRECCIÓN: El segundo argumento es el tipo de imagen (ej. 'PNG')
        pdf.addImage(base64ImageWithPrefix, 'PNG', posicionX, 40, anchoImagen, altoImagen);
        posicionY = 40 + altoImagen + 10;
      } catch (error) {
        console.error("Error al añadir la imagen al PDF (asegúrate de que es PNG o ajusta el tipo):", error);
        pdf.text("Imagen no disponible", anchoPagina / 2, posicionY, { align: "center" });
        posicionY += 10; // Ajusta la posición para el siguiente texto si no hay imagen
      }
    }

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    // Mapear id_categoria a nombre_categoria para el detalle del producto
    const categoria = listaCategorias.find(cat => cat.id_categoria === producto.id_categoria);
    const nombreCategoria = categoria ? categoria.nombre_categoria : 'Desconocida';

    pdf.text(`Descripción: ${producto.descripcion_producto}`, anchoPagina / 2, posicionY, { align: "center" });
    pdf.text(`Categoría: ${nombreCategoria}`, anchoPagina / 2, posicionY + 10, { align: "center" });
    pdf.text(`Precio: C$ ${producto.precio_unitario}`, anchoPagina / 2, posicionY + 20, { align: "center" });
    pdf.text(`Stock: ${producto.stock}`, anchoPagina / 2, posicionY + 30, { align: "center" });

    pdf.save(`${producto.nombre_producto}.pdf`);
  }

  const exportarExcelProductos = () => {
    // CORRECCIÓN: Usar 'productoFiltradas' consistentemente
    const datos = productoFiltradas.map((producto) => ({
      ID: producto.id_producto,
      Nombre: producto.nombre_producto,
      Descripcion: producto.descripcion_producto,
      Id_Categoria: producto.id_categoria, // Aquí puedes decidir si quieres el ID o el nombre de la categoría
      Precio: parseFloat(producto.precio_unitario),
      Stock: producto.stock
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `Productos_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  }

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Productos</h4>

        <Row>
          <Col lg={2} md={4} sm={4} xs={5}>
            <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
              Nuevo Producto
            </Button>
          </Col>

          <Col lg={6} md={8} sm={8} xs={7}>
            <CuadroBusquedas
              textoBusqueda={textoBusqueda}
              manejarCambioBusqueda={manejarCambioBusqueda}
            />
          </Col>

          <Col lg={3} md={4} sm={4} xs={5}>
            <Button
              className="mb-3"
              onClick={generarPDFProductos}
              variant="secondary"
              style={{ width: "100%" }}
            >
              Generar reporte PDF
            </Button>
          </Col>

          <Col lg={3} md={4} sm={4} xs={5}>
            <Button
              className="mb-3"
              onClick={exportarExcelProductos}
              variant="secondary"
              style={{ width: "100%" }}
            >
              Generar Excel
            </Button>
          </Col>

        </Row>
        <br />


        {/* Pasa los estados como props al componente TablaCategorias */}
        <TablaProductos
          productos={productoPaginadas}
          cargando={cargando}
          error={errorCarga}
          totalElementos={productoFiltradas.length} // Usa productoFiltradas para el total real
          elementosPorPagina={elementosPorPagina} // Elementos por página
          paginaActual={paginaActual} // Página actual
          establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
          generarPDFDetalleProducto={generarPDFDetalleProducto}
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
          categorias={listaCategorias} // Pasa las categorías al modal de edición también
        />


      </Container>
    </>
  );
};


// Exportación del componente
export default Productos;