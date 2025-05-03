import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Si no hay usuario, redirigir al login
  if (!user || !user.rol) {
    return <Navigate to="/" replace />;
  }

  // Verificar si el rol del usuario está permitido
  if (!allowedRoles.includes(user.rol)) {
    // Si el rol no está permitido, redirigir al dashboard correspondiente
    const dashboardPath = getDashboardPath(user.rol);
    return <Navigate to={dashboardPath} replace />;
  }

  // Si todo está bien, renderizar el componente
  return element;
};

// Función auxiliar para obtener la ruta del dashboard según el rol
const getDashboardPath = (rol) => {
  switch (rol) {
    case 'superadmin':
      return '/dashboard/superadmin';
    case 'admin':
    case 'admin_local':
      return '/dashboard/admin';
    case 'supervisor':
      return '/dashboard/supervisor';
    default:
      return '/dashboard/encargado';
  }
};

export default PrivateRoute;