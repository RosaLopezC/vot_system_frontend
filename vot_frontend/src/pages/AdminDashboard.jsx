import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { FaUsers, FaProjectDiagram, FaClipboardList, FaCog, FaBuilding, FaSignOutAlt, FaChevronRight, FaChevronDown, FaBell } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Dashboardadmin.css';

const AdminDashboard = () => {
  // Simulación de usuario
  const user = {
    nombres: 'Userprueba',
    dni: '00123456'
  };

  // Estados para el manejo de datos
  const [activeSection, setActiveSection] = useState('dashboard');
  const [openMenus, setOpenMenus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Estados adicionales para mostrar/ocultar listas
  const [showAllSupervisors, setShowAllSupervisors] = useState(false);
  const [showAllEncargados, setShowAllEncargados] = useState(false);

  // Datos para dispositivos con valores específicos
  const dispositivosData = {
    web: 28,
    mobile: 15,
    total: 43
  };

  // Datos coherentes para todo el dashboard
  const totalReportesValidados = 1450;
  const totalReportesPendientes = 150;
  const totalUsuariosActivos = dispositivosData.total; // 43 usuarios activos = dispositivos conectados
  const totalReportes = totalReportesValidados + totalReportesPendientes; // 1600
  
  // Porcentajes para el gráfico circular
  const porcentajeValidados = Math.round((totalReportesValidados / totalReportes) * 100); // 91%
  const porcentajePendientes = Math.round((totalReportesPendientes / totalReportes) * 100); // 9%

  // Estado para manejar los submenús
  const toggleSubmenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Datos actualizados para coincidir con la imagen
  const reportesMensuales = [
    { mes: 'ENE', reportes: 800 },
    { mes: 'FEB', reportes: 750 },
    { mes: 'MAR', reportes: 650 },
    { mes: 'ABR', reportes: 700 },
    { mes: 'MAY', reportes: 950 },
    { mes: 'JUN', reportes: 1050 },
    { mes: 'JUL', reportes: 1100 },
    { mes: 'AGO', reportes: 900 },
    { mes: 'SEP', reportes: 850 },
    { mes: 'OCT', reportes: 750 },
    { mes: 'NOV', reportes: 800 },
    { mes: 'DIC', reportes: 900 },
  ];

  const donutData = [
    { name: 'REGISTRADOS', value: porcentajeValidados },
    { name: 'PENDIENTES', value: porcentajePendientes },
  ];

  const donutColors = ['#10b981', '#f59e0b'];

  // Datos para "Reportes por distrito" - coherentes con el total
  const distritos = [
    { nombre: 'Miraflores', cantidad: 8720 },
    { nombre: 'San Isidro', cantidad: 7378 },
    { nombre: 'Surco', cantidad: 6840 },
    { nombre: 'Chorrillos', cantidad: 4509 },
  ];

  // Supervisores activos
  const supervisoresActivos = [
    'Carlos Mendoza (Z02502) - Activo',
    'Roxana Mercedes (Z03502) - Activo', 
    'Jorge Ramírez (Z02501) - Activo',
    'Mollie López (Z04505) - Activo',
    'Luis Salazar (Z06507) - Activo',
    'Karla Bojarca (Z05506) - Activo',
  ];

  // Encargados activos
  const encargadosActivos = [
    'Carlos Mendoza (Z02502) - Activo',
    'Roxana Mercedes (Z03502) - Activo',
    'Jorge Ramírez (Z02501) - Activo', 
    'Mollie López (Z04505) - Activo',
    'Carlos Mendoza (Z02502) - Activo',
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'white', 
          border: '1px solid #e5e7eb', 
          padding: '12px 16px', 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
            {label}
          </div>
          <div style={{ color: '#6b7280' }}>
            Reportes: {payload[0].value}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'white', 
          border: '1px solid #e5e7eb', 
          padding: '12px 16px', 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <div style={{ 
            color: '#1f2937', 
            marginBottom: '4px',
            fontWeight: '600'
          }}>
            {payload[0].name}
          </div>
          <div style={{ color: '#6b7280' }}>
            {payload[0].value}% del total
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <img src="logo.png" alt="FieldOps" className="logo-image" />
          <div className="logo-text">FieldOps</div>
        </div>
        
        <div className="nav-section">
          <div className="nav-title">ACCIONES</div>
          
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <div className="nav-item-icon">📊</div>
            Dashboard
          </button>
          
          <div className="nav-item-container">
            <button 
              className={`nav-item ${activeSection.includes('usuarios') ? 'active' : ''}`}
              onClick={() => toggleSubmenu('usuarios')}
            >
              <div className="nav-item-icon">👥</div>
              Gestión de Usuarios
              <div className={`menu-arrow ${openMenus.usuarios ? 'open' : ''}`}>
                {openMenus.usuarios ? <FaChevronDown /> : <FaChevronRight />}
              </div>
            </button>
            <div className={`submenu ${openMenus.usuarios ? 'open' : ''}`}>
              <button 
                className="nav-link submenu-item"
                onClick={() => setActiveSection('usuarios-supervisores')}
              >
                Supervisores
              </button>
              <button 
                className="nav-link submenu-item"
                onClick={() => setActiveSection('usuarios-encargados')}
              >
                Encargados
              </button>
            </div>
          </div>
          
          <div className="nav-item-container">
            <button 
              className={`nav-item ${activeSection.includes('territorial') ? 'active' : ''}`}
              onClick={() => toggleSubmenu('territorial')}
            >
              <div className="nav-item-icon">🗺️</div>
              Gestión Territorial
              <div className={`menu-arrow ${openMenus.territorial ? 'open' : ''}`}>
                {openMenus.territorial ? <FaChevronDown /> : <FaChevronRight />}
              </div>
            </button>
            <div className={`submenu ${openMenus.territorial ? 'open' : ''}`}>
              <button 
                className="nav-link submenu-item"
                onClick={() => setActiveSection('territorial-zonas')}
              >
                Zonas
              </button>
              <button 
                className="nav-link submenu-item"
                onClick={() => setActiveSection('territorial-sectores')}
              >
                Sectores
              </button>
            </div>
          </div>
          
          <div className="nav-item-container">
            <button 
              className={`nav-item ${activeSection.includes('reportes') ? 'active' : ''}`}
              onClick={() => toggleSubmenu('reportes')}
            >
              <div className="nav-item-icon">📋</div>
              Gestión de Reportes
              <div className={`menu-arrow ${openMenus.reportes ? 'open' : ''}`}>
                {openMenus.reportes ? <FaChevronDown /> : <FaChevronRight />}
              </div>
            </button>
            <div className={`submenu ${openMenus.reportes ? 'open' : ''}`}>
              <button 
                className="nav-link submenu-item"
                onClick={() => setActiveSection('reportes-validacion')}
              >
                Validación
              </button>
              <button 
                className="nav-link submenu-item"
                onClick={() => setActiveSection('reportes-historial')}
              >
                Historial
              </button>
            </div>
          </div>
          
          <button 
            className={`nav-item ${activeSection === 'configuracion' ? 'active' : ''}`}
            onClick={() => setActiveSection('configuracion')}
          >
            <div className="nav-item-icon">⚙️</div>
            Configuración
          </button>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <div className="top-bar">
          <h1 className="page-title">Dashboard</h1>
          <div className="top-bar-right">
            <button className="notification-btn">
              <FaBell />
            </button>
            <div className="user-info">
              <div className="user-avatar">U</div>
              <div className="user-details">
                <span className="user-name">{user.nombres}</span>
                <span className="user-dni">DNI: {user.dni}</span>
              </div>
            </div>
          </div>
        </div>

        {activeSection === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card reports">
                <div className="stat-info">
                  <div className="stat-number">{totalReportesValidados}</div>
                  <div className="stat-label">Reportes<br />Validados</div>
                </div>
                <div className="stat-icon">
                  <img src="/1.png" alt="Reportes validados" />
                </div>
              </div>
              
              <div className="stat-card pending">
                <div className="stat-info">
                  <div className="stat-number">{totalReportesPendientes}</div>
                  <div className="stat-label">Reportes<br />Pendientes</div>
                </div>
                <div className="stat-icon">
                  <img src="/2.png" alt="Reportes pendientes" />
                </div>
              </div>
              
              <div className="stat-card users">
                <div className="stat-info">
                  <div className="stat-number">{totalUsuariosActivos}</div>
                  <div className="stat-label">Usuarios<br />activos</div>
                </div>
                <div className="stat-icon">
                  <img src="/3.png" alt="Usuarios activos" />
                </div>
              </div>
              
              <div className="calendar-widget">
                <div className="calendar-header">
                  <button className="calendar-nav">‹</button>
                  <span className="calendar-title">Junio 2025</span>
                  <button className="calendar-nav">›</button>
                </div>
                <div className="calendar-grid">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                    <div key={i} className="calendar-day-header">{d}</div>
                  ))}
                  {/* Solo una semana */}
                  <div className="calendar-day"></div>
                  <div className="calendar-day">1</div>
                  <div className="calendar-day">2</div>
                  <div className="calendar-day">3</div>
                  <div className="calendar-day">4</div>
                  <div className="calendar-day">5</div>
                  <div className="calendar-day today">6</div>
                </div>
              </div>
            </div>

            <div className="main-charts-grid">
              <div className="chart-card large-chart">
                <div className="chart-header">
                  <h3 className="chart-title">Registro de Reportes mensual</h3>
                  <div className="chart-controls">
                    <select className="year-select">
                      <option>2025</option>
                      <option>2024</option>
                    </select>
                    <button className="export-btn">📁 Exportar</button>
                  </div>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportesMensuales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="mes" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="reportes" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#f59e0b' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="chart-card large-chart donut-chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">Número total de reportes</h3>
                </div>
                <div className="donut-container">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={2}
                        startAngle={90}
                        endAngle={450}
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={donutColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="donut-bottom-info">
                    <div className="donut-total">{totalReportes} REPORTES</div>
                    <div className="donut-subtitle">TOTALES</div>
                    <div className="donut-legend">
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                        <span>Registrados</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                        <span>Pendientes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bottom-charts-grid">
              <div className="chart-card fixed-height-chart">
                <h3 className="chart-title">Reportes por distrito</h3>
                <div className="district-selector">
                  <select className="district-select">
                    <option>Lima</option>
                    <option>Callao</option>
                  </select>
                </div>
                <div className="district-list">
                  {distritos.map((distrito, i) => (
                    <div key={distrito.nombre} className="district-item">
                      <div className="district-info">
                        <div className="district-name">{distrito.nombre}</div>
                        <div className="district-count">{distrito.cantidad}</div>
                      </div>
                      <div className="district-bar">
                        <div 
                          className="district-progress" 
                          style={{ width: `${(distrito.cantidad / 9000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-card fixed-height-chart">
                <h3 className="chart-title">Supervisores activos ahora</h3>
                <div className="supervisor-list">
                  {supervisoresActivos.slice(0, showAllSupervisors ? supervisoresActivos.length : 4).map((supervisor, i) => (
                    <div key={i} className="supervisor-item">
                      <span className="supervisor-name">{supervisor}</span>
                    </div>
                  ))}
                  {supervisoresActivos.length > 4 && (
                    <button 
                      className="show-more-btn"
                      onClick={() => setShowAllSupervisors(!showAllSupervisors)}
                    >
                      {showAllSupervisors ? 'Mostrar menos' : `Mostrar ${supervisoresActivos.length - 4} más`}
                    </button>
                  )}
                </div>
                
                <h3 className="chart-title encargados-title">Encargados activos ahora</h3>
                <div className="supervisor-list">
                  {encargadosActivos.slice(0, showAllEncargados ? encargadosActivos.length : 3).map((encargado, i) => (
                    <div key={i} className="supervisor-item">
                      <span className="supervisor-name">{encargado}</span>
                    </div>
                  ))}
                  {encargadosActivos.length > 3 && (
                    <button 
                      className="show-more-btn"
                      onClick={() => setShowAllEncargados(!showAllEncargados)}
                    >
                      {showAllEncargados ? 'Mostrar menos' : `Mostrar ${encargadosActivos.length - 3} más`}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="chart-card fixed-height-chart">
                <h3 className="chart-title">Dispositivos activos</h3>
                <div className="devices-chart-improved">
                  <div className="device-bars-improved">
                    <div className="device-item-improved" data-tooltip={`${dispositivosData.web} usuarios`}>
                      <div className="device-bar-improved">
                        <div 
                          className="device-bar-fill web" 
                          style={{ height: `${(dispositivosData.web / 35) * 80}%` }}
                        ></div>
                      </div>
                      <div className="device-info">
                        <div className="device-label">Web</div>
                        <div className="device-value">{dispositivosData.web}</div>
                      </div>
                    </div>
                    <div className="device-item-improved" data-tooltip={`${dispositivosData.mobile} usuarios`}>
                      <div className="device-bar-improved">
                        <div 
                          className="device-bar-fill mobile" 
                          style={{ height: `${(dispositivosData.mobile / 35) * 80}%` }}
                        ></div>
                      </div>
                      <div className="device-info">
                        <div className="device-label">Móvil</div>
                        <div className="device-value">{dispositivosData.mobile}</div>
                      </div>
                    </div>
                  </div>
                  <div className="devices-footer-improved">
                    <span className="devices-title">Dispositivos</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Otras secciones */}
        {activeSection !== 'dashboard' && (
          <div className="section-placeholder">
            <h2>Sección: {activeSection}</h2>
            <p>Contenido en desarrollo...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;