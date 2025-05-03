import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // ✅ Asegúrate de que REACT_APP_API_URL esté definido en el archivo .env
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log('API URL:', apiUrl);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/login/`, { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { token, user } = response.data;

      // Guardar token y usuario en el localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

    // ✅ Debug: Verificar el rol recibido del backend
    //console.log('Rol del usuario:', user.rol); 
    //console.log('Usuario completo:', user); 

    Swal.fire('Bienvenido', `Hola ${user.nombres}`, 'success');

    // Redirigir según el rol (versión temporal con log)
    if (user?.rol === 'superadmin') {
      console.log('Redirigiendo a superadmin');
      navigate('/dashboard/superadmin');
    } else if (user?.rol === 'admin_local' || user?.rol === 'admin') {
      console.log('Redirigiendo a admin');
      navigate('/dashboard/admin');
    } else if (user?.rol === 'supervisor') {
      console.log('Redirigiendo a supervisor');
      navigate('/dashboard/supervisor');
    } else {
      console.log('Redirigiendo a encargado (rol no reconocido)');
      navigate('/dashboard/encargado');
    }

  } catch (error) {
    console.error('Error al iniciar sesión:', error.response?.data || error.message);
    Swal.fire('Error', 'Credenciales incorrectas', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group mb-2">
          <label>Correo</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group mb-2">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100 mt-3" type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
