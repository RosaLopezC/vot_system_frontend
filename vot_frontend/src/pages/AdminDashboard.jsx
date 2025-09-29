import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaChevronDown, FaChevronRight, FaBell } from 'react-icons/fa';
import './Dashboardadmin.css';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Configuración de Axios para incluir el token en los headers
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage
    if (token) {
      config.headers.Authorization = token; // Agrega el token al encabezado Authorization
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AdminDashboard = () => {
  // Simulación de usuario
  const user = {
    nombres: 'Userprueba',
    dni: '00123456'
  };

  // Estados para el manejo de datos
  const [activeSection, setActiveSection] = useState('dashboard');
  const [openMenus, setOpenMenus] = useState({
    usuarios: false, // Submenú de Gestión de Usuarios cerrado por defecto
    territorial: false, // Submenú de Gestión Territorial cerrado por defecto
    reportes: false, // Submenú de Gestión de Reportes cerrado por defecto
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // Estados adicionales para mostrar/ocultar listas
  const [showAllSupervisors, setShowAllSupervisors] = useState(false);
  const [showAllEncargados, setShowAllEncargados] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu], // Alterna el estado del submenú
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
   
    { mes: 'JUN', reportes: 1050 },
    { mes: 'JUL', reportes: 1100 },

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

  // Estados para manejar formularios
  const [supervisorForm, setSupervisorForm] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    empresa: '',
    estado_contrasena: 'por_defecto',
    estado: 'activo',
    password: ''
  });

  const [encargadoForm, setEncargadoForm] = useState({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    celular: '',
    empresa: '',
    supervisor: '',
    estado_contrasena: 'por_defecto',
    estado: 'activo',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  // Estado para supervisores
  const [supervisores, setSupervisores] = useState([]); // Estado para supervisores
  const [encargados, setEncargados] = useState([]); // Estado para encargados

  // Agregar este estado para la lista de supervisores disponibles
  const [supervisoresDisponibles, setSupervisoresDisponibles] = useState([]);

  // Función para manejar la edición
  const handleEdit = async (type, item) => {
    try {
      if (type === 'supervisor') {
        // Para supervisores, simplemente copia los datos (sin la contraseña)
        setSupervisorForm({
          ...item,
          password: '' // La contraseña no debe venir del backend por seguridad
        });
      } else {
        // Para encargados, necesitamos cargar la lista de supervisores
        await fetchSupervisoresParaSelect();
        
        // Asigna correctamente el supervisor (usando el ID del supervisor)
        setEncargadoForm({
          ...item,
          supervisor: item.supervisor, // Usa el ID del supervisor
          password: '' // La contraseña no debe venir del backend por seguridad
        });
      }
      
      setEditingItem(item);
      setModalType(type);
      setShowModal(true);
      
    } catch (error) {
      console.error('Error al preparar edición:', error);
      Swal.fire('Error', `No se pudo cargar los datos para editar`, 'error');
    }
  };

  // Agregar nueva función para manejar la actualización
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const isEditingSupervisor = modalType === 'supervisor';
      let formData = isEditingSupervisor ? {...supervisorForm} : {...encargadoForm};
      const itemId = editingItem?.id;
      
      // Si la contraseña está vacía, elimínala del formulario para no enviarla
      if (!formData.password) {
        delete formData.password;
      }
      
      const url = isEditingSupervisor 
        ? `http://localhost:8000/api/usuarios/supervisor/${itemId}/`
        : `http://localhost:8000/api/usuarios/encargado/${itemId}/`;

      const response = await axios.put(url, formData);
      
      if (response.status === 200) {
        Swal.fire('Éxito', `${modalType === 'supervisor' ? 'Supervisor' : 'Encargado'} actualizado correctamente`, 'success');
        setShowModal(false);
        if (isEditingSupervisor) {
          fetchSupervisores();
        } else {
          fetchEncargados();
        }
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire('Error', `No se pudo actualizar el ${modalType}`, 'error');
    }
    
    setLoading(false);
    setEditingItem(null);
  };

  // Función para manejar la eliminación
  const handleDelete = async (type, id) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar este ${type}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const url = type === 'supervisor'
          ? `http://localhost:8000/api/usuarios/supervisor/${id}/delete/`
          : `http://localhost:8000/api/usuarios/encargado/${id}/delete/`;

        const response = await axios.delete(url);
        
        if (response.status === 200) {
          // Actualizar el estado local inmediatamente
          if (type === 'supervisor') {
            setSupervisores(supervisores.filter(sup => sup.id !== id));
          } else {
            setEncargados(encargados.filter(enc => enc.id !== id));
          }
          
          Swal.fire('Eliminado', `El ${type} ha sido eliminado correctamente`, 'success');
        }
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      Swal.fire('Error', `No se pudo eliminar el ${type}. ${error.response?.data?.detail || 'Error del servidor'}`, 'error');
    }
  };

  // Función para manejar cambios en los formularios
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'supervisor') {
      setSupervisorForm({ ...supervisorForm, [name]: value });
    } else if (formType === 'encargado') {
      setEncargadoForm({ ...encargadoForm, [name]: value });
    }
  };

  // Función para crear un supervisor
  const handleCrearSupervisor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/usuarios/supervisor/', supervisorForm);
      Swal.fire('Éxito', 'El supervisor fue creado correctamente.', 'success');
      setShowModal(false);
      fetchSupervisores(); // Recargar la lista de supervisores
    } catch (err) {
      Swal.fire('Error', err.response?.data?.detail || 'No se pudo crear el supervisor.', 'error');
    }
    setLoading(false);
  };

  // Función para crear un encargado
  const handleCrearEncargado = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/usuarios/encargado/', encargadoForm);
      Swal.fire('Éxito', 'El encargado fue creado correctamente.', 'success');
      setShowModal(false);
      fetchEncargados(); // Recargar la lista de encargados
    } catch (err) {
      Swal.fire('Error', err.response?.data?.detail || 'No se pudo crear el encargado.', 'error');
    }
    setLoading(false);
  };

  // Función para cargar supervisores
  const fetchSupervisores = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/usuarios/supervisores/');
      setSupervisores(res.data);
    } catch (err) {
      console.error('Error al obtener supervisores:', err);
    }
  };

  // Función para cargar encargados
  const fetchEncargados = async () => {
    try {
      // Primero obtenemos los encargados
      const resEncargados = await axios.get('http://localhost:8000/api/usuarios/encargados/');
      console.log("Encargados recibidos:", resEncargados.data); // Para depuración
    
      // Luego obtenemos los supervisores para poder mapear IDs a nombres
      const resSupervisores = await axios.get('http://localhost:8000/api/usuarios/supervisores/');
      console.log("Supervisores recibidos:", resSupervisores.data); // Para depuración
    
      // Creamos un mapa de ID de supervisor a nombre completo
      const supervisoresMap = {};
      resSupervisores.data.forEach(supervisor => {
        supervisoresMap[supervisor.id] = `${supervisor.nombres} ${supervisor.apellidos}`;
      });
      console.log("Mapa de supervisores:", supervisoresMap); // Para depuración
    
      // Ahora podemos transformar los datos de encargados para incluir el nombre del supervisor
      const encargadosConNombresSupervisores = resEncargados.data.map(encargado => {
        console.log("Encargado:", encargado.id, "Supervisor ID:", encargado.supervisor); // Para depuración
        return {
          ...encargado,
          supervisor_nombre: encargado.supervisor && supervisoresMap[encargado.supervisor] 
            ? supervisoresMap[encargado.supervisor] 
            : 'Sin asignar'
        };
      });
      
      console.log("Encargados procesados:", encargadosConNombresSupervisores); // Para depuración
      setEncargados(encargadosConNombresSupervisores);
    } catch (err) {
      console.error('Error al obtener encargados:', err);
    }
  };

  // Agregar esta función para cargar los supervisores disponibles
  const fetchSupervisoresParaSelect = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/usuarios/supervisores/');
      setSupervisoresDisponibles(response.data);
    } catch (error) {
      console.error('Error al cargar supervisores:', error);
    }
  };

  // Cargar datos según la sección activa
  useEffect(() => {
    if (activeSection === 'usuarios-supervisores') {
      fetchSupervisores();
    } else if (activeSection === 'usuarios-encargados') {
      fetchEncargados();
    }
  }, [activeSection]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="FieldOps" className="logo-image" />
          <div className="logo-text"></div>
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
                  <span className="calendar-title">Julio 2025</span>
                  <button className="calendar-nav">›</button>
                </div>
                <div className="calendar-grid">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                    <div key={i} className="calendar-day-header">{d}</div>
                  ))}
                  {/* Solo una semana */}
                  <div className="calendar-day today">7</div>
                  <div className="calendar-day">8</div>
                  <div className="calendar-day">9</div>
                  <div className="calendar-day">10</div>
                  <div className="calendar-day">11</div>
                  <div className="calendar-day">12</div>
                  <div className="calendar-day">13</div>
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

            {/* Gráfico de líneas agregado aquí */}
            <div className="chart-card">
              <h3 className="chart-title">Reportes Mensuales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportesMensuales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="mes"
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    width={40}
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
          </>
        )}

        {/* Otras secciones */}
        {activeSection !== 'dashboard' && 
 !activeSection.includes('usuarios') && 
 !activeSection.includes('territorial') && (
  <div className="section-placeholder">
    <h2>Sección: {activeSection}</h2>
    <p>Contenido en desarrollo...</p>
  </div>
)}

        {/* Modal para crear o editar supervisor o encargado */}
        <Modal show={showModal} onHide={() => {
  setShowModal(false);
  setEditingItem(null);
}}>
  <Modal.Header closeButton>
    <Modal.Title>
      {editingItem ? 
        `Editar ${modalType === 'supervisor' ? 'Supervisor' : 'Encargado'}` : 
        `Crear ${modalType === 'supervisor' ? 'Supervisor' : 'Encargado'}`}
    </Modal.Title>
  </Modal.Header>
  <Form onSubmit={editingItem ? handleUpdate : (modalType === 'supervisor' ? handleCrearSupervisor : handleCrearEncargado)}>
    <Modal.Body>
      <Form.Group>
        <Form.Label>DNI</Form.Label>
        <Form.Control
          name="dni"
          value={modalType === 'supervisor' ? supervisorForm.dni : encargadoForm.dni}
          onChange={(e) => handleInputChange(e, modalType)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Nombres</Form.Label>
        <Form.Control
          name="nombres"
          value={modalType === 'supervisor' ? supervisorForm.nombres : encargadoForm.nombres}
          onChange={(e) => handleInputChange(e, modalType)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Apellidos</Form.Label>
        <Form.Control
          name="apellidos"
          value={modalType === 'supervisor' ? supervisorForm.apellidos : encargadoForm.apellidos}
          onChange={(e) => handleInputChange(e, modalType)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          type="email"
          value={modalType === 'supervisor' ? supervisorForm.email : encargadoForm.email}
          onChange={(e) => handleInputChange(e, modalType)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Celular</Form.Label>
        <Form.Control
          name="celular"
          value={modalType === 'supervisor' ? supervisorForm.celular : encargadoForm.celular}
          onChange={(e) => handleInputChange(e, modalType)}
        />
      </Form.Group>
      {modalType === 'encargado' && (
        <Form.Group>
          <Form.Label>Supervisor</Form.Label>
          <Form.Select
            name="supervisor"
            value={encargadoForm.supervisor}
            onChange={(e) => handleInputChange(e, 'encargado')}
            required
          >
            <option value="">Seleccione un supervisor</option>
            {supervisoresDisponibles.map((supervisor) => (
              <option 
                key={supervisor.id} 
                value={supervisor.id}
              >
                {`${supervisor.nombres} ${supervisor.apellidos}`}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label>{editingItem ? 'Contraseña (dejar vacío para mantener)' : 'Contraseña'}</Form.Label>
        <Form.Control
          name="password"
          type="password"
          value={modalType === 'supervisor' ? supervisorForm.password : encargadoForm.password}
          onChange={(e) => handleInputChange(e, modalType)}
          required={!editingItem} // Solo es requerido si estamos creando, no editando
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => {
        setShowModal(false);
        setEditingItem(null);
      }}>
        Cancelar
      </Button>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear')}
      </Button>
    </Modal.Footer>
  </Form>
</Modal>

        {activeSection.includes('usuarios') && (
          <>
            {/* Botones para elegir entre supervisores y encargados */}
            {activeSection === 'usuarios' && (
              <>
                {/* Botones para elegir entre supervisores y encargados */}
                <div className="user-management-options">
                  <h2>Gestión de Usuarios</h2>
                  <div className="user-management-buttons">
                    <Button
                      variant="primary"
                      onClick={() => setActiveSection('usuarios-supervisores')}
                    >
                      Ver Supervisores
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setActiveSection('usuarios-encargados')}
                    >
                      Ver Encargados
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Tabla de supervisores */}
            {activeSection === 'usuarios-supervisores' && (
              <div className="table-container">
    <div className="table-header">
      <h2>Supervisores</h2>
      <Button 
        onClick={() => { setShowModal(true); setModalType('supervisor'); }}
        className="create-button"
      >
        <span>+</span> Crear Supervisor
      </Button>
    </div>
    <table className="custom-table">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Email</th>
          <th>Celular</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {supervisores.map((supervisor) => (
          <tr key={supervisor.id}>
            <td>{supervisor.dni}</td>
            <td>{supervisor.nombres}</td>
            <td>{supervisor.apellidos}</td>
            <td className="email-cell" title={supervisor.email}>{supervisor.email}</td>
            <td>{supervisor.celular}</td>
            <td className="actions-column">
              <button 
                className="action-button edit"
                onClick={() => handleEdit('supervisor', supervisor)}
              >
                ✏️
              </button>
              <button 
                className="action-button delete"
                onClick={() => handleDelete('supervisor', supervisor.id)}
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{/* Tabla de encargados con el mismo diseño */}
{activeSection === 'usuarios-encargados' && (
  <div className="table-container">
    <div className="table-header">
      <h2>Encargados</h2>
      <Button 
        onClick={() => { setShowModal(true); setModalType('encargado'); }}
        className="create-button"
      >
        <span>+</span> Crear Encargado
      </Button>
    </div>
    <table className="custom-table">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Email</th>
          <th>Celular</th>
          <th>Supervisor</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {encargados.map((encargado) => (
          <tr key={encargado.id}>
            <td>{encargado.dni}</td>
            <td>{encargado.nombres}</td>
            <td>{encargado.apellidos}</td>
            <td className="email-cell" title={encargado.email}>{encargado.email}</td>
            <td>{encargado.celular}</td>
            <td>{encargado.supervisor_nombre || 'Sin asignar'}</td>
            <td className="actions-column">
              <button 
                className="action-button edit"
                onClick={() => handleEdit('encargado', encargado)}
              >
                ✏️
              </button>
              <button 
                className="action-button delete"
                onClick={() => handleDelete('encargado', encargado.id)}
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;