import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        dni,
        password
      });

      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (remember) {
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('remember');
      }

      const user = response.data.user;
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
      Swal.fire('Error', 'Credenciales incorrectas', 'error');
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
              <input
                type="password"
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
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.borderColor = '#F57E1C'}
                onBlur={e => e.target.style.borderColor = '#005097'}
              />
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