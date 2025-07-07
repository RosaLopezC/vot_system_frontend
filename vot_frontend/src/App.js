import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import SupervisorDashboard from './pages/SupervisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
              element={<SuperAdminDashboard />} 
              allowedRoles={['superadmin']} 
            />
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <PrivateRoute 
              element={<AdminDashboard />} 
              allowedRoles={['admin', 'admin_local']} 
            />
          } 
        />
        <Route 
          path="/dashboard/supervisor" 
          element={
            <PrivateRoute 
              element={<SupervisorDashboard />} 
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