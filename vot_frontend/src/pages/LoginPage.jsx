import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://31.97.91.123/api/login/', {
        dni,
        password
      });

      // Agregar logs para ver la respuesta completa
      console.log('Respuesta completa del login:', response.data);
      console.log('Token de acceso:', response.data.access);
      console.log('Token de refresh:', response.data.refresh);
      console.log('Datos del usuario:', response.data.user);

      // Guardar tokens y datos del usuario
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (remember) {
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('remember');
      }

      const user = response.data.user;
      
      // Redireccionar según el rol
      if (user.rol === 'superadmin') {
        navigate('/dashboard/superadmin');
      } else if (user.rol === 'admin' || user.rol === 'admin_local') {
        navigate('/dashboard/admin');
      } else if (user.rol === 'supervisor') {
        navigate('/dashboard/supervisor');
      } else if (user.rol === 'encargado') {
        navigate('/dashboard/encargado');
      } else {
        navigate('/dashboard');
      }

      Swal.fire('Bienvenido', `Hola ${user.nombres}`, 'success');
    } catch (error) {
      console.error('Error detallado del login:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      Swal.fire('Error', error.response?.data?.detail || 'Error al iniciar sesión', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #005097 60%, #F57E1C 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        padding: '1.5rem 1.2rem 4rem 1.2rem',
        maxWidth: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: 200, marginBottom: 8 }}
        />
        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 300 }}>
            <div className="form-group" style={{ width: '100%', marginBottom: 16 }}>
              <label style={{
                color: '#005097',
                fontWeight: 600,
                fontSize: '1rem',
                marginBottom: 8,
                display: 'block'
              }}>DNI</label>
              <input
                type="text"
                className="form-control"
                required
                value={dni}
                maxLength={8}
                pattern="\d{8}"
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ingrese su DNI"
                style={{
                  borderColor: '#005097',
                  borderWidth: 2,
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#F57E1C'}
                onBlur={e => e.target.style.borderColor = '#005097'}
              />
            </div>
            <div className="form-group" style={{ width: '100%', marginBottom: 8 }}>
              <label style={{
                color: '#005097',
                fontWeight: 600,
                fontSize: '1rem',
                marginBottom: 8,
                display: 'block'
              }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  style={{
                    borderColor: '#005097',
                    borderWidth: 2,
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    width: '100%',
                    boxSizing: 'border-box',
                    paddingRight: '40px' // Space for the icon
                  }}
                  onFocus={e => e.target.style.borderColor = '#F57E1C'}
                  onBlur={e => e.target.style.borderColor = '#005097'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#005097'
                  }}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="form-check mb-4" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  borderColor: '#005097',
                  cursor: 'pointer',
                  marginRight: 8
                }}
              />
              <label className="form-check-label" htmlFor="remember" style={{
                color: '#005097',
                fontWeight: 500,
                fontSize: '0.97rem',
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                Recordar contraseña
              </label>
            </div>
            <button
              className="btn w-100"
              type="submit"
              style={{
                background: '#F57E1C',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                borderRadius: 10,
                fontSize: 17,
                padding: '10px 0',
                width: '100%',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 126, 28, 0.4)',
                transition: 'background-color 0.3s ease',
                marginTop: 18
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e06a00'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F57E1C'}
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;