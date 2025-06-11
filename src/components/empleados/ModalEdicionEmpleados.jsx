import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionEmpleados = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  empleadoEditado,
  manejarCambioInputEdicion,
  actualizarEmpleado,
  errorCarga,
}) => {
  const validarletras = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Permitir solo letras {A-Z, a-z}
    if (
      (charCode < 65 || charCode > 90) && // Letras mayúsculas
      (charCode < 97 || charCode > 122) && // Letras minúsculas
      charCode !== 8 && // Retroceso
      charCode !== 46 && // Borrar
      charCode !== 9 // Tab
    ) {
      e.preventDefault(); // Evita que se escriba el caracter
    }
  };

  const validarnumeros = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (
      (charCode < 48 || charCode > 57) && // Números 0-9
      charCode !== 8 && // Retroceso
      charCode !== 46 // Borrar
    ) {
      e.preventDefault();
    }
  };

  const validacionFormulario = () => {
    return (
      (empleadoEditado?.primer_nombre || "").trim() !== "" &&
      (empleadoEditado?.primer_apellido || "").trim() !== "" &&
      (empleadoEditado?.celular || "").trim() !== "" &&
      (empleadoEditado?.cargo || "").trim() !== "" &&
      (empleadoEditado?.fecha_contratacion || "").trim() !== ""
    );
  };

  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formPrimerNombreEmpleado">
            <Form.Label>Primer Nombre</Form.Label>
            <Form.Control
              type="text"
              name="primer_nombre"
              value={empleadoEditado?.primer_nombre || ""}
              onChange={manejarCambioInputEdicion}
              onKeyDown={validarletras}
              placeholder="Ingresa el primer nombre (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSegundoNombreEmpleado">
            <Form.Label>Segundo Nombre</Form.Label>
            <Form.Control
              type="text"
              name="segundo_nombre"
              value={empleadoEditado?.segundo_nombre || ""}
              onChange={manejarCambioInputEdicion}
              onKeyDown={validarletras}
              placeholder="Ingresa el segundo nombre (máx. 20 caracteres)"
              maxLength={20}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrimerApellidoEmpleado">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              type="text"
              name="primer_apellido"
              value={empleadoEditado?.primer_apellido || ""}
              onChange={manejarCambioInputEdicion}
              onKeyDown={validarletras}
              placeholder="Ingresa el primer apellido (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSegundoApellidoEmpleado">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control
              type="text"
              name="segundo_apellido"
              value={empleadoEditado?.segundo_apellido || ""}
              onChange={manejarCambioInputEdicion}
              onKeyDown={validarletras}
              placeholder="Ingresa el segundo apellido (máx. 20 caracteres)"
              maxLength={20}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCelularEmpleado">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              type="text"
              name="celular"
              value={empleadoEditado?.celular || ""}
              onChange={manejarCambioInputEdicion}
              onKeyDown={validarnumeros} // Añadido para restringir a números
              placeholder="Ingresa el celular (máx. 12 caracteres)"
              maxLength={12}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCargoEmpleado">
            <Form.Label>Cargo</Form.Label>
            <Form.Control
              type="text"
              name="cargo"
              value={empleadoEditado?.cargo || ""}
              onChange={manejarCambioInputEdicion}
              placeholder="Ingresa el cargo (máx. 20 caracteres)"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFechaContratacionEmpleado">
            <Form.Label>Fecha de Contratación</Form.Label>
            <Form.Control
              type="date"
              name="fecha_contratacion"
              value={empleadoEditado?.fecha_contratacion || ""}
              onChange={manejarCambioInputEdicion}
              required
            />
          </Form.Group>

          {errorCarga && <div className="text-danger mt-2">{errorCarga}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={actualizarEmpleado}
          disabled={!validacionFormulario()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEmpleados;