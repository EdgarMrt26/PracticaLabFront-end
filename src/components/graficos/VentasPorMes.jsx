import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart,  { plugins } from 'chart.js/auto';




const VentasPorMes = ({ meses, totales_por_mes }) => {

  const data = {
    labels: meses, 
    datasets : [
      {
        label: 'Ventas(C$)',
        data: totales_por_mes,
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        borderColor: 'rgba(75, 192, 192, 1)', 
        borderWidth: 1, 
      },
    ],
  };


  const options = {
    responsive: true, 
    plugins: {
      legend:{
        Position: 'top', 
      }
    },
    Scales: {
      y: {
        benginAtZero: true,
        title: {
          display: true, 
          text: 'Cordobas (C$)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Meses',
        },
      },
    },
  };


return (
  <Card style={{ height: "100%" }}>
    <Card.Body>
      <Card.Title>Ventas por mes</Card.Title>
      <div style={{ height: "100%", position: "relative" }}>
        <Bar data={data} options={options} />
      </div>
    </Card.Body>
  </Card>

);
};
export default VentasPorMes;