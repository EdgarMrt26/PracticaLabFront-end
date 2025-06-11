import React, { useState, useEffect } from "react";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleados";
import ModalEliminacionEmpleados from "../components/empleados/ModalEliminacionEmpleados";
import ModalEdicionEmpleados from "../components/empleados/ModalEdicionEmpleados";
import { Container, Button, Row, Col } from "react-bootstrap";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import jsPDF from "jspdf"; // Importar jsPDF
import autoTable from "jspdf-autotable"; // Importar autoTable para tablas en PDF
import * as XLSX from "xlsx"; // Importar xlsx para Excel
import { saveAs } from "file-saver"; // Importar file-saver para guardar archivos

const Empleados = () => {
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    celular: "",
    cargo: "",
    fecha_contratacion: "",
  });

  const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

  const [empleadoEditado, setEmpleadoEditado] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerEmpleados = async () => {
    try {
      const respuesta = await fetch("http://localhost:3001/api/empleados");
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
      const datos = await respuesta.json();
      setListaEmpleados(datos);
      setEmpleadosFiltrados(datos);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarEmpleado = async () => {
    if (
      !nuevoEmpleado.primer_nombre ||
      !nuevoEmpleado.primer_apellido ||
      !nuevoEmpleado.celular ||
      !nuevoEmpleado.cargo ||
      !nuevoEmpleado.fecha_contratacion
    ) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3001/api/registrarempleado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoEmpleado),
      });

      if (!respuesta.ok) {
        throw new Error("Error al agregar el empleado");
      }

      await obtenerEmpleados();
      setNuevoEmpleado({
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        celular: "",
        cargo: "",
        fecha_contratacion: "",
      });
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

    const filtrados = listaEmpleados.filter(
      (empleado) =>
        empleado.primer_nombre.toLowerCase().includes(texto) ||
        (empleado.segundo_nombre || "").toLowerCase().includes(texto) ||
        empleado.primer_apellido.toLowerCase().includes(texto) ||
        (empleado.segundo_apellido || "").toLowerCase().includes(texto) ||
        empleado.celular.includes(texto) ||
        empleado.cargo.toLowerCase().includes(texto) ||
        empleado.fecha_contratacion.includes(texto)
    );
    setEmpleadosFiltrados(filtrados);
  };

  const empleadosPaginados = Array.isArray(empleadosFiltrados)
    ? empleadosFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
      )
    : [];

  const eliminarEmpleado = async () => {
    if (!empleadoAEliminar) return;

    try {
      const respuesta = await fetch(
        `http://localhost:3001/api/eliminarempleado/${empleadoAEliminar.id_empleado}`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al eliminar el empleado");
      }

      await obtenerEmpleados();
      setMostrarModalEliminacion(false);
      establecerPaginaActual(1);
      setEmpleadoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setMostrarModalEliminacion(true);
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setEmpleadoEditado((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const actualizarEmpleado = async () => {
    if (
      !empleadoEditado?.primer_nombre ||
      !empleadoEditado?.primer_apellido ||
      !empleadoEditado?.celular ||
      !empleadoEditado?.cargo ||
      !empleadoEditado?.fecha_contratacion
    ) {
      setErrorCarga("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3001/api/actualizarempleado/${empleadoEditado.id_empleado}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            primer_nombre: empleadoEditado.primer_nombre,
            segundo_nombre: empleadoEditado.segundo_nombre,
            primer_apellido: empleadoEditado.primer_apellido,
            segundo_apellido: empleadoEditado.segundo_apellido,
            celular: empleadoEditado.celular,
            cargo: empleadoEditado.cargo,
            fecha_contratacion: empleadoEditado.fecha_contratacion,
          }),
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al actualizar el empleado");
      }

      await obtenerEmpleados();
      setMostrarModalEdicion(false);
      setEmpleadoEditado(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEdicion = (empleado) => {
    setEmpleadoEditado(empleado);
    setMostrarModalEdicion(true);
  };

  // --- INICIO: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  const generarPDFEmpleados = () => {
    const doc = new jsPDF();
    const anchoPagina = doc.internal.pageSize.getWidth();

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51); // Color de fondo para el encabezado
    doc.rect(0, 0, anchoPagina, 30, "F"); // Rectángulo para el encabezado
    doc.setTextColor(255, 255, 255); // Color de texto blanco
    doc.setFontSize(22);
    doc.text("Lista de Empleados", anchoPagina / 2, 18, { align: "center" });

    // Definición de columnas
    const columnas = [
      "ID",
      "Primer Nombre",
      "Segundo Nombre",
      "Primer Apellido",
      "Segundo Apellido",
      "Celular",
      "Cargo",
      "Fecha de Contratación",
    ];

    // Preparación de los datos de las filas
    const filas = empleadosFiltrados.map((empleado) => [
      empleado.id_empleado,
      empleado.primer_nombre,
      empleado.segundo_nombre || "",
      empleado.primer_apellido,
      empleado.segundo_apellido || "",
      empleado.celular,
      empleado.cargo,
      empleado.fecha_contratacion,
    ]);

    // Marcador para el total de páginas
    const totalPaginasPlaceholder = "{total_pages_count_string}";

    // Configuración y generación de la tabla con autoTable
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40, // Posición inicial Y de la tabla
      theme: "grid", // Estilo de la tabla
      styles: { fontSize: 9, cellPadding: 2, overflow: "linebreak" }, // Estilos de celda
      margin: { top: 20, left: 14, right: 14 }, // Márgenes del documento
      tableWidth: "auto", // Ancho de la tabla ajustado al contenido
      columnStyles: {
        // Estilos específicos para columnas si es necesario
        0: { cellWidth: "auto" }, // ID
        1: { cellWidth: "auto" }, // Primer Nombre
        2: { cellWidth: "auto" }, // Segundo Nombre
        3: { cellWidth: "auto" }, // Primer Apellido
        4: { cellWidth: "auto" }, // Segundo Apellido
        5: { cellWidth: "auto" }, // Celular
        6: { cellWidth: "auto" }, // Cargo
        7: { cellWidth: "auto" }, // Fecha de Contratación
      },
      pageBreak: "auto", // Salto de página automático
      rowPageBreak: "auto", // Salto de página por fila si la fila es muy grande
      // Hook que se ejecuta al dibujar cada página para añadir pie de página
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();
        const numeroPagina = doc.internal.getNumberOfPages();

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Color de texto negro para el pie de página
        const piePaginaTexto = `Página ${numeroPagina} de ${totalPaginasPlaceholder}`;
        doc.text(piePaginaTexto, anchoPagina / 2, alturaPagina - 10, {
          align: "center",
        });
      },
    });

    // Reemplazar el placeholder con el número total de páginas real
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPaginasPlaceholder);
    }

    // Guardar el PDF con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    const nombreArchivo = `ReporteEmpleados_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const generarPDFDetalleEmpleado = (empleado) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    // Encabezado
    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 0, 220, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(
      `${empleado.primer_nombre} ${empleado.primer_apellido}`,
      anchoPagina / 2,
      18,
      { align: "center" }
    );

    let posicionY = 50;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    pdf.text(
      `Primer Nombre: ${empleado.primer_nombre}`,
      anchoPagina / 2,
      posicionY,
      { align: "center" }
    );
    pdf.text(
      `Primer Apellido: ${empleado.primer_apellido}`,
      anchoPagina / 2,
      posicionY + 10,
      { align: "center" }
    );
    pdf.text(`Celular: ${empleado.celular}`, anchoPagina / 2, posicionY + 20, {
      align: "center",
    });
    pdf.text(`Cargo: ${empleado.cargo}`, anchoPagina / 2, posicionY + 30, {
      align: "center",
    });
    pdf.text(
      `Fecha de Contratación: ${empleado.fecha_contratacion}`,
      anchoPagina / 2,
      posicionY + 40,
      { align: "center" }
    );

    pdf.save(`${empleado.primer_nombre}_${empleado.primer_apellido}.pdf`);
  };

  const exportarExcelEmpleados = () => {
    // Estructura de datos para la hoja Excel
    const datos = empleadosFiltrados.map((empleado) => ({
      "ID Empleado": empleado.id_empleado,
      "Primer Nombre": empleado.primer_nombre,
      "Segundo Nombre": empleado.segundo_nombre || "",
      "Primer Apellido": empleado.primer_apellido,
      "Segundo Apellido": empleado.segundo_apellido || "",
      Celular: empleado.celular,
      Cargo: empleado.cargo,
      "Fecha de Contratación": empleado.fecha_contratacion,
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Empleados");

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    const nombreArchivo = `ReporteEmpleados_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, nombreArchivo);
  };

  // --- FIN: NUEVAS FUNCIONES PARA PDF Y EXCEL ---

  return (
    <Container className="mt-5">
      <br />
      <h4>Empleados</h4>

      <Row>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
            style={{ width: "100%" }}
          >
            Nuevo Empleado
          </Button>
        </Col>
        <Col lg={6} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
        {/* Botones para exportar PDF y Excel */}
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={generarPDFEmpleados}
            variant="danger"
            style={{ width: "100%" }}
          >
            Generar Reporte PDF
          </Button>
        </Col>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={exportarExcelEmpleados}
            variant="success"
            style={{ width: "100%" }}
          >
            Generar Excel
          </Button>
        </Col>
      </Row>
      <br />

      <TablaEmpleados
        empleados={empleadosPaginados}
        cargando={cargando}
        error={errorCarga}
        totalElementos={empleadosFiltrados.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
        abrirModalEliminacion={abrirModalEliminacion}
        abrirModalEdicion={abrirModalEdicion}
        generarPDFDetalleEmpleado={generarPDFDetalleEmpleado}
      />

      <ModalRegistroEmpleado
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoEmpleado={nuevoEmpleado}
        manejarCambioInput={manejarCambioInput}
        agregarEmpleado={agregarEmpleado}
        errorCarga={errorCarga}
      />

      <ModalEliminacionEmpleados
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarEmpleado={eliminarEmpleado}
      />

      <ModalEdicionEmpleados
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        empleadoEditado={empleadoEditado}
        manejarCambioInputEdicion={manejarCambioInputEdicion}
        actualizarEmpleado={actualizarEmpleado}
        errorCarga={errorCarga}
      />
    </Container>
  );
};

export default Empleados;