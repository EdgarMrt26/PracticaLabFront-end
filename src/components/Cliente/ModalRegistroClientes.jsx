import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroClientes = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejarCambioInput,
  agregarCliente,
  errorCarga,
}) => {
  const validarLetras = (e) => {
    const charCode = e.which ? e.mhich : e.keyCode;
    // Permitir solo letras (A-Z, a-z)
    if (
      (charCode < 65 || charCode > 90) && // Letras mayúsculas
      (charCode < 97 || charCode > 122) && // Letras minúsculas
      charCode !== 8 && // Retroceso
      charCode !== 46 && // Borrar
      charCode !== 9 // Tab
    ) {
      e.preventDefault(); // Evita que escriba el carácter
    }
  };
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formPrimerNombre">
            <Form.Label>Primer Nombre</Form.Label>
            <Form.Control
              type="text"
              name="primer_nombre"
              value={nuevoCliente.primer_nombre}
              onChange={manejarCambioInput}
              onKeyDown={validarLetras}
              placeholder="Ingresa el primer nombre"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSegundoNombre">
            <Form.Label>Segundo Nombre</Form.Label>
            <Form.Control
              type="text"
              name="segundo_nombre"
              value={nuevoCliente.segundo_nombre}
              onChange={manejarCambioInput}
              placeholder="Ingresa el segundo nombre"
              maxLength={20}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPrimerApellido">
            <Form.Label>Primer Apellido</Form.Label>
            <Form.Control
              type="text"
              name="primer_apellido"
              value={nuevoCliente.primer_apellido}
              onChange={manejarCambioInput}
              placeholder="Ingresa el primer apellido"
              maxLength={20}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSegundoApellido">
            <Form.Label>Segundo Apellido</Form.Label>
            <Form.Control
              type="text"
              name="segundo_apellido"
              value={nuevoCliente.segundo_apellido}
              onChange={manejarCambioInput}
              placeholder="Ingresa el segundo apellido"
              maxLength={20}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCelular">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              type="tel"
              name="celular"
              value={nuevoCliente.celular}
              onChange={manejarCambioInput}
              placeholder="Ingresa el número celular"
              maxLength={8}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="direccion"
              value={nuevoCliente.direccion}
              onChange={manejarCambioInput}
              placeholder="Ingresa la dirección"
              maxLength={150}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={nuevoCliente.cedula}
              onChange={manejarCambioInput}
              placeholder="Ingresa la cédula"
              maxLength={14}
              required
            />
          </Form.Group>

          {errorCarga && (
            <div className="text-danger mt-2">{errorCarga}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={agregarCliente}>
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroClientes;