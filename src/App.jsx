import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import './App.css';
import Encabezado from "./components/encabezado/Encabezado";
import Clientes from "./views/Clientes";
import Productos from "./views/Productos";
import Categorias from "./views/Categorias";
import Ventas from "./views/ventas";
import Usuarios from "./views/Usuarios";
import Empleados from "./views/Empleados";
import Compras from "./views/Compras";
import Catalogo from "./views/CatalogoProductos";
import Grafico from "./views/Estadisticas";
import Dashboards from "./views/Dashboards";


const App = () => {
  return (
    
    <Router>
      <main className="margen-superior-main">
      <Encabezado/>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/Categorias" element={<Categorias />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/grafico" element={<Grafico />} />
          <Route path="/dashboards" element={<Dashboards />} />
        </Routes>
      </main>
    </Router>
  );
};


export default App;