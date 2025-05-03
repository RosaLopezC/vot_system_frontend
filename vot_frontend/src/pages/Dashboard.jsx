import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login'); // Si no hay usuario, redirige al login
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // Función que renderiza el dashboard según el rol
  const renderDashboard = () => {
    if (user?.rol === 'superadmin') {
      return <SuperAdminDashboard />;
    } else if (user?.rol === 'admin') {
      return <AdminLocalDashboard />;
    } else if (user?.rol === 'supervisor') {
      return <SupervisorDashboard />;
    } else if (user?.rol === 'encargado') {
      return <EncargadoDashboard />;
    }
  };

  return (
    <div>
      <h1>Dashboard de {user?.nombres}</h1>
      {renderDashboard()}
    </div>
  );
};

// Componente para SuperAdmin
const SuperAdminDashboard = () => {
  return <div>Vista del Superadmin</div>;
};

// Componente para Admin Local
const AdminLocalDashboard = () => {
  return <div>Vista del Admin Local</div>;
};

// Componente para Supervisor
const SupervisorDashboard = () => {
  return <div>Vista del Supervisor</div>;
};

// Componente para Encargado
const EncargadoDashboard = () => {
  return <div>Vista del Encargado</div>;
};

export default Dashboard;
