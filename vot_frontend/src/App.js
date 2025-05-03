import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard'; // Asegúrate de importar tu archivo de Dashboard (se asume que ya existe)

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal para login */}
        <Route path="/" element={<LoginPage />} />

        {/* Rutas para los diferentes dashboards según el rol */}
        <Route path="/dashboard/superadmin" element={<Dashboard role="superadmin" />} />
        <Route path="/dashboard/admin" element={<Dashboard role="admin" />} />
        <Route path="/dashboard/supervisor" element={<Dashboard role="supervisor" />} />
        <Route path="/dashboard/encargado" element={<Dashboard role="encargado" />} />
      </Routes>
    </Router>
  );
}

export default App;
