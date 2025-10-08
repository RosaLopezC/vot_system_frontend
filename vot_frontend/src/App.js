import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SupervisorDashboard from './pages/SupervisorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      
      // Intentar obtener el rol del usuario
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserRole(user.rol);
        }
      } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
      }
    }
  }, []);

  // Componente protegido que redirige según el rol
  const ProtectedRoute = ({ children, requiredRole }) => {
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    console.log("ProtectedRoute - userRole:", userRole);
    console.log("ProtectedRoute - requiredRole:", requiredRole);

    if (!isAuthenticated) {
      console.log("No autenticado, redirigiendo a login");
      return <Navigate to="/login" />;
    }
    
    if (requiredRole && userRole !== requiredRole) {
      console.log("Rol incorrecto, redirigiendo según rol actual");
      // Redirigir según el rol que tenga
      if (userRole === 'admin') {
        return <Navigate to="/admin" />;
      } else if (userRole === 'supervisor') {
        return <Navigate to="/supervisor" />;
      } else if (userRole === 'encargado') {
        return <Navigate to="/encargado" />;
      } else {
        // Si no tiene rol válido, enviarlo al login
        return <Navigate to="/login" />;
      }
    }
    
    console.log("Renderizando componente protegido");
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        
        {/* Ruta para administrador */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta para supervisor */}
        <Route 
          path="/supervisor" 
          element={
            <ProtectedRoute requiredRole="supervisor">
              <SupervisorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirigir la ruta principal según el rol */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              userRole === 'admin' ? <Navigate to="/admin" /> :
              userRole === 'supervisor' ? <Navigate to="/supervisor" /> :
              userRole === 'encargado' ? <Navigate to="/encargado" /> :
              <Navigate to="/login" />
            ) : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;