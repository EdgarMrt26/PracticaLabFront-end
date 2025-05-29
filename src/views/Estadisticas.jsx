import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import VentasPorMes from '../components/graficos/VentasPorMes';
import VentasPorEmpleado from '../components/graficos/VentasPorEmpleado';
import ChatIA from '../components/chat/ChatIA';

const Estadisticas = () => {

  const [meses, setMeses] = useState([]);
  const [totalesPorMes, setTotalesPorMes] = useState([]);

  const [empleados, setEmpleados] = useState([]);
  const [ventasPorEmpleado, setVentasPorEmpleado] = useState([]);

  // Variable de estado para IA
  const [mostrarChatModal, setMostrarChatModal] = useState(false); // Estado para el modal

  const cargaVentas = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/totalVentasPorMes');
            const data = await response.json();

            setMeses(data.map(item => item.mes));
            setTotalesPorMes(data.map(item => item.total_ventas));
        } catch (error) {
            console.error('Error al cargar ventas:', error);
            alert('Error al cargar ventas: ' + error.message);
        }
    };

    const cargaVentasPorEmpleado = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/totalventasporempleado");
        const data = await response.json();
        setEmpleados(data.map((item) => item.primer_nombre + " " + item.primer_apellido));
        setVentasPorEmpleado(data.map((item) => item.total_ventas));
      } catch (error) {
        console.error("Error al cargar ventas por empleado:", error);
        alert("Error al cargar ventas por empleado: " + error.message);
      }
    };





useEffect(() => {
    cargaVentas();
    cargaVentasPorEmpleado();
}, []);

    return (
        <Container className="mt-5">
        <br />
        <h4>Estadísticas</h4>
          <Button 
            variant="primary" 
            className="mb-4"
            onClick={() => setMostrarChatModal(true)}
          >
            Consultar con IA
          </Button>
        <Row className="mt-4">
            <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
                <VentasPorMes meses={meses} totales_por_mes={totalesPorMes} />
            </Col>
      
        <Col xs={12} sm={12} md={12} lg={6} className="mb-4">
        <VentasPorEmpleado empleados={empleados} totales_por_empleado={ventasPorEmpleado} />
        </Col>

        </Row>
        <ChatIA mostrarChatModal={mostrarChatModal} setMostrarChatModal={setMostrarChatModal} />

    </Container>

    );
};

export default Estadisticas;