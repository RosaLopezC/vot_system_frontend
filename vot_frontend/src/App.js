import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<LoginPage />} />

        {/* Rutas privadas */}
        <Route 
          path="/dashboard/superadmin" 
          element={
            <PrivateRoute 
              element={<Dashboard role="superadmin" />} 
              allowedRoles={['superadmin']} 
            />
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <PrivateRoute 
              element={<Dashboard role="admin" />} 
              allowedRoles={['admin', 'admin_local']} 
            />
          } 
        />
        <Route 
          path="/dashboard/supervisor" 
          element={
            <PrivateRoute 
              element={<Dashboard role="supervisor" />} 
              allowedRoles={['supervisor']} 
            />
          } 
        />
        <Route 
          path="/dashboard/encargado" 
          element={
            <PrivateRoute 
              element={<Dashboard role="encargado" />} 
              allowedRoles={['encargado']} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;