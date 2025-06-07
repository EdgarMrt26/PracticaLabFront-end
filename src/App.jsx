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
import RutaProtegida from "./components/Rutas/RutaProtegida";
import PiePagina from "./components/infopie/PiePagina";


const App = () => {
  return (
    <Router>
      <div className="app-wrapper">
        <Encabezado />
        <main className="margen-superior-main content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<RutaProtegida vista={<Inicio />} />} />
            <Route path="/clientes" element={<RutaProtegida vista={<Clientes />} />} />
            <Route path="/productos" element={<RutaProtegida vista={<Productos />} />} />
            <Route path="/Categorias" element={<RutaProtegida vista={<Categorias />} />} />
            <Route path="/ventas" element={<RutaProtegida vista={<Ventas />} />} />
            <Route path="/usuarios" element={<RutaProtegida vista={<Usuarios />} />} />
            <Route path="/empleados" element={<RutaProtegida vista={<Empleados />} />} />
            <Route path="/compras" element={<RutaProtegida vista={<Compras />} />} />
            <Route path="/catalogo" element={<RutaProtegida vista={<Catalogo />} />} />
            <Route path="/grafico" element={<RutaProtegida vista={<Grafico />} />} />
            <Route path="/dashboards" element={<RutaProtegida vista={<Dashboards />} />} />
          </Routes>
        </main>
        <PiePagina />
      </div>
    </Router>
  );
};

export default App;