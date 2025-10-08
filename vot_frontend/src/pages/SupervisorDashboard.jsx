import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Tabs, Tab, Badge } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaChevronDown, FaChevronRight, FaBell, FaSearch } from 'react-icons/fa';
import './SupervisorDashboard.css'; // Crearemos este archivo después

// Configuración de Axios para incluir el token en los headers
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const API_URL = 'http://31.97.91.123/api';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  
  // Estado para el usuario actual
  const [user, setUser] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    rol: 'supervisor'
  });
  
  // Estados para controlar la visualización
  const [activeSection, setActiveSection] = useState('reportes-predios');
  const [openMenus, setOpenMenus] = useState({
    reportes: false,
  });
  
  // Estados para datos y paginación
  const [reportesPredios, setReportesPredios] = useState([]);
  const [reportesPostes, setReportesPostes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estado para filtros
  const [filtros, setFiltros] = useState({
    estado: '',
    fecha_desde: '',
    fecha_hasta: '',
    busqueda: '',
  });
  
  // Estado para modal de detalle
  const [showModal, setShowModal] = useState(false);
  const [detalleReporte, setDetalleReporte] = useState(null);
  
  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  // Toggle para submenús
  const toggleSubmenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };
  
  // Función para obtener la información del usuario
  const fetchUserInfo = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Obtener datos del usuario desde el backend
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${API_URL}/usuarios/me/`);
          if (response.status === 200) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Sesión expirada',
          text: 'Por favor, inicie sesión nuevamente'
        }).then(() => {
          handleLogout();
        });
      }
    }
  }, []);
  
  // Función para cargar reportes de predios
  const fetchReportesPredios = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      
      // Construir parámetros de consulta para filtros
      let params = new URLSearchParams();
      params.append('page', page);
      
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      
      const response = await axios.get(`${API_URL}/reportes/?${params.toString()}`);
      
      setReportesPredios(response.data.results || response.data);
      
      // Si hay información de paginación
      if (response.data.count !== undefined) {
        setTotalPages(Math.ceil(response.data.count / 10)); // Asumiendo 10 elementos por página
      } else {
        setTotalPages(1);
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error("Error al cargar reportes de predios:", error);
      Swal.fire('Error', 'No se pudieron cargar los reportes de predios', 'error');
    } finally {
      setLoading(false);
    }
  }, [filtros]);
  
  // Función para cargar reportes de postes
  const fetchReportesPostes = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      
      // Construir parámetros de consulta para filtros
      let params = new URLSearchParams();
      params.append('page', page);
      
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      
      const response = await axios.get(`${API_URL}/postes/reportes/?${params.toString()}`);
      
      setReportesPostes(response.data.results || response.data);
      
      // Si hay información de paginación
      if (response.data.count !== undefined) {
        setTotalPages(Math.ceil(response.data.count / 10)); // Asumiendo 10 elementos por página
      } else {
        setTotalPages(1);
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error("Error al cargar reportes de postes:", error);
      Swal.fire('Error', 'No se pudieron cargar los reportes de postes', 'error');
    } finally {
      setLoading(false);
    }
  }, [filtros]);
  
  // Función para ver detalle de reporte
  const verDetalleReporte = async (id, tipo) => {
    try {
      setLoading(true);
      
      const endpoint = tipo === 'predio' 
        ? `${API_URL}/reportes/${id}/` 
        : `${API_URL}/postes/reportes/${id}/`;
      
      const response = await axios.get(endpoint);
      
      setDetalleReporte({
        ...response.data,
        tipo_reporte: tipo // para distinguir si es predio o poste
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error al cargar detalle del reporte:", error);
      Swal.fire('Error', 'No se pudo cargar el detalle del reporte', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para validar un reporte
  const validarReporte = async (id, tipo) => {
    try {
      const result = await Swal.fire({
        title: '¿Validar este reporte?',
        text: 'Esta acción marcará el reporte como validado',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, validar',
        cancelButtonText: 'Cancelar'
      });
      
      if (result.isConfirmed) {
        const endpoint = tipo === 'predio' 
          ? `${API_URL}/reportes/${id}/validar/` 
          : `${API_URL}/postes/reportes/${id}/validar/`;
        
        await axios.post(endpoint);
        
        Swal.fire('Validado', 'El reporte ha sido validado correctamente', 'success');
        
        // Recargar la lista correspondiente
        if (tipo === 'predio') {
          fetchReportesPredios(currentPage);
        } else {
          fetchReportesPostes(currentPage);
        }
      }
    } catch (error) {
      console.error("Error al validar reporte:", error);
      Swal.fire('Error', 'No se pudo validar el reporte', 'error');
    }
  };
  
  // Función para rechazar un reporte
  const rechazarReporte = async (id, tipo) => {
    try {
      const { value: motivo } = await Swal.fire({
        title: 'Motivo de rechazo',
        input: 'textarea',
        inputPlaceholder: 'Ingrese el motivo del rechazo...',
        inputAttributes: {
          'aria-label': 'Motivo del rechazo'
        },
        showCancelButton: true,
        confirmButtonText: 'Rechazar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar un motivo para el rechazo';
          }
        }
      });
      
      if (motivo) {
        const endpoint = tipo === 'predio' 
          ? `${API_URL}/reportes/${id}/rechazar/` 
          : `${API_URL}/postes/reportes/${id}/rechazar/`;
        
        await axios.post(endpoint, { motivo });
        
        Swal.fire('Rechazado', 'El reporte ha sido rechazado', 'info');
        
        // Recargar la lista correspondiente
        if (tipo === 'predio') {
          fetchReportesPredios(currentPage);
        } else {
          fetchReportesPostes(currentPage);
        }
      }
    } catch (error) {
      console.error("Error al rechazar reporte:", error);
      Swal.fire('Error', 'No se pudo rechazar el reporte', 'error');
    }
  };
  
  // Función para aplicar filtros
  const aplicarFiltros = () => {
    if (activeSection === 'reportes-predios') {
      fetchReportesPredios(1); // Reiniciar a primera página
    } else {
      fetchReportesPostes(1); // Reiniciar a primera página
    }
  };
  
  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      fecha_desde: '',
      fecha_hasta: '',
      busqueda: '',
    });
    
    // Recargar datos sin filtros
    if (activeSection === 'reportes-predios') {
      fetchReportesPredios(1);
    } else {
      fetchReportesPostes(1);
    }
  };
  
  // Cambiar página
  const cambiarPagina = (pagina) => {
    if (activeSection === 'reportes-predios') {
      fetchReportesPredios(pagina);
    } else {
      fetchReportesPostes(pagina);
    }
  };
  
  // Efecto para cargar usuario al montar
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);
  
  // Efecto para cargar reportes según la sección activa
  useEffect(() => {
    if (activeSection === 'reportes-predios') {
      fetchReportesPredios(1);
    } else if (activeSection === 'reportes-postes') {
      fetchReportesPostes(1);
    }
  }, [activeSection, fetchReportesPredios, fetchReportesPostes]);
  
  // Función auxiliar para formatear fechas
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'N/A';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Función para mostrar estado con estilo
  const getBadgeForEstado = (estado) => {
    let variant = 'secondary';
    
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        variant = 'warning';
        break;
      case 'validado':
        variant = 'success';
        break;
      case 'rechazado':
        variant = 'danger';
        break;
      case 'registrado':
        variant = 'info';
        break;
      default:
        variant = 'secondary';
    }
    
    return <Badge bg={variant}>{estado || 'Desconocido'}</Badge>;
  };

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
                className={`nav-link submenu-item ${activeSection === 'reportes-predios' ? 'active' : ''}`}
                onClick={() => setActiveSection('reportes-predios')}
              >
                Predios
              </button>
              <button
                className={`nav-link submenu-item ${activeSection === 'reportes-postes' ? 'active' : ''}`}
                onClick={() => setActiveSection('reportes-postes')}
              >
                Postes
              </button>
            </div>
          </div>
          
          <button 
            className={`nav-item ${activeSection === 'encargados' ? 'active' : ''}`}
            onClick={() => setActiveSection('encargados')}
          >
            <div className="nav-item-icon">👥</div>
            Mis Encargados
          </button>
          
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
          <h1 className="page-title">
            {activeSection === 'reportes-predios' && 'Reportes de Predios'}
            {activeSection === 'reportes-postes' && 'Reportes de Postes'}
            {activeSection === 'encargados' && 'Mis Encargados'}
            {activeSection === 'configuracion' && 'Configuración'}
          </h1>
          <div className="top-bar-right">
            <button className="notification-btn">
              <FaBell />
            </button>
            <div className="user-info">
              <div className="user-avatar">{user.nombres?.[0] || 'S'}</div>
              <div className="user-details">
                <span className="user-name">{user.nombres} {user.apellidos}</span>
                <span className="user-dni">Supervisor - DNI: {user.dni}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de Reportes de Predios */}
        {activeSection === 'reportes-predios' && (
          <div className="reportes-container">
            <div className="filtros-container">
              <div className="filtros-grid">
                <div className="filtro-item">
                  <label htmlFor="estado">Estado</label>
                  <select 
                    id="estado" 
                    className="form-control"
                    value={filtros.estado}
                    onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="validado">Validado</option>
                    <option value="rechazado">Rechazado</option>
                    <option value="registrado">Registrado</option>
                  </select>
                </div>
                <div className="filtro-item">
                  <label htmlFor="fecha_desde">Fecha desde</label>
                  <input
                    type="date"
                    id="fecha_desde"
                    className="form-control"
                    value={filtros.fecha_desde}
                    onChange={(e) => setFiltros({...filtros, fecha_desde: e.target.value})}
                  />
                </div>
                <div className="filtro-item">
                  <label htmlFor="fecha_hasta">Fecha hasta</label>
                  <input
                    type="date"
                    id="fecha_hasta"
                    className="form-control"
                    value={filtros.fecha_hasta}
                    onChange={(e) => setFiltros({...filtros, fecha_hasta: e.target.value})}
                  />
                </div>
                <div className="filtro-item">
                  <label htmlFor="busqueda">Buscar</label>
                  <div className="search-input-container">
                    <input
                      type="text"
                      id="busqueda"
                      className="form-control"
                      placeholder="Código, dirección..."
                      value={filtros.busqueda}
                      onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                    />
                    <FaSearch className="search-icon" />
                  </div>
                </div>
                <div className="filtro-buttons">
                  <button 
                    className="btn btn-primary" 
                    onClick={aplicarFiltros}
                  >
                    Aplicar Filtros
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={limpiarFiltros}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Código Predio</th>
                    <th>Fecha Reporte</th>
                    <th>Encargado</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  ) : reportesPredios.length > 0 ? (
                    reportesPredios.map((reporte) => (
                      <tr key={reporte.id}>
                        <td>{reporte.id}</td>
                        <td>{reporte.tipo}</td>
                        <td>{reporte.detalle_predio?.codigo_predio || 'Sin código'}</td>
                        <td>{formatearFecha(reporte.fecha_reporte)}</td>
                        <td>{reporte.encargado_nombre || 'N/A'}</td>
                        <td>{getBadgeForEstado(reporte.estado)}</td>
                        <td className="actions-column">
                          <button 
                            className="action-button view"
                            onClick={() => verDetalleReporte(reporte.id, 'predio')}
                            title="Ver detalle"
                          >
                            👁️
                          </button>
                          {reporte.estado === 'pendiente' && (
                            <>
                              <button 
                                className="action-button validate"
                                onClick={() => validarReporte(reporte.id, 'predio')}
                                title="Validar"
                              >
                                ✅
                              </button>
                              <button 
                                className="action-button reject"
                                onClick={() => rechazarReporte(reporte.id, 'predio')}
                                title="Rechazar"
                              >
                                ❌
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No hay reportes disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => cambiarPagina(1)}
                  >
                    «
                  </button>
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => cambiarPagina(currentPage - 1)}
                  >
                    ‹
                  </button>
                  
                  <span className="pagination-text">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => cambiarPagina(currentPage + 1)}
                  >
                    ›
                  </button>
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => cambiarPagina(totalPages)}
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido de Reportes de Postes */}
        {activeSection === 'reportes-postes' && (
          <div className="reportes-container">
            <div className="filtros-container">
              <div className="filtros-grid">
                <div className="filtro-item">
                  <label htmlFor="estado">Estado</label>
                  <select 
                    id="estado" 
                    className="form-control"
                    value={filtros.estado}
                    onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="validado">Validado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>
                <div className="filtro-item">
                  <label htmlFor="fecha_desde">Fecha desde</label>
                  <input
                    type="date"
                    id="fecha_desde"
                    className="form-control"
                    value={filtros.fecha_desde}
                    onChange={(e) => setFiltros({...filtros, fecha_desde: e.target.value})}
                  />
                </div>
                <div className="filtro-item">
                  <label htmlFor="fecha_hasta">Fecha hasta</label>
                  <input
                    type="date"
                    id="fecha_hasta"
                    className="form-control"
                    value={filtros.fecha_hasta}
                    onChange={(e) => setFiltros({...filtros, fecha_hasta: e.target.value})}
                  />
                </div>
                <div className="filtro-item">
                  <label htmlFor="busqueda">Buscar</label>
                  <div className="search-input-container">
                    <input
                      type="text"
                      id="busqueda"
                      className="form-control"
                      placeholder="Código poste..."
                      value={filtros.busqueda}
                      onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                    />
                    <FaSearch className="search-icon" />
                  </div>
                </div>
                <div className="filtro-buttons">
                  <button 
                    className="btn btn-primary" 
                    onClick={aplicarFiltros}
                  >
                    Aplicar Filtros
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={limpiarFiltros}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Código Poste</th>
                    <th>Fecha Reporte</th>
                    <th>Encargado</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  ) : reportesPostes.length > 0 ? (
                    reportesPostes.map((reporte) => (
                      <tr key={reporte.id}>
                        <td>{reporte.id}</td>
                        <td>{reporte.tipo}</td>
                        <td>{reporte.detalle_poste?.codigo || 'Sin código'}</td>
                        <td>{formatearFecha(reporte.fecha_reporte)}</td>
                        <td>{reporte.encargado_nombre || 'N/A'}</td>
                        <td>{getBadgeForEstado(reporte.estado)}</td>
                        <td className="actions-column">
                          <button 
                            className="action-button view"
                            onClick={() => verDetalleReporte(reporte.id, 'poste')}
                            title="Ver detalle"
                          >
                            👁️
                          </button>
                          {reporte.estado === 'pendiente' && (
                            <>
                              <button 
                                className="action-button validate"
                                onClick={() => validarReporte(reporte.id, 'poste')}
                                title="Validar"
                              >
                                ✅
                              </button>
                              <button 
                                className="action-button reject"
                                onClick={() => rechazarReporte(reporte.id, 'poste')}
                                title="Rechazar"
                              >
                                ❌
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No hay reportes disponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => cambiarPagina(1)}
                  >
                    «
                  </button>
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => cambiarPagina(currentPage - 1)}
                  >
                    ‹
                  </button>
                  
                  <span className="pagination-text">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => cambiarPagina(currentPage + 1)}
                  >
                    ›
                  </button>
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => cambiarPagina(totalPages)}
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placeholder para otras secciones */}
        {(activeSection === 'encargados' || activeSection === 'configuracion') && (
          <div className="section-placeholder">
            <h2>Sección: {activeSection}</h2>
            <p>Contenido en desarrollo...</p>
          </div>
        )}
        
        {/* Modal para ver detalle de reporte */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          backdrop="static"
          centered
          className="reporte-detalle-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Detalle de Reporte {detalleReporte?.id}
              <span className="ms-2">
                {detalleReporte && getBadgeForEstado(detalleReporte.estado)}
              </span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : detalleReporte ? (
              <div className="detalle-reporte">
                <Tabs defaultActiveKey="general" id="detalle-reporte-tabs">
                  <Tab eventKey="general" title="Información General">
                    <div className="reporte-info-grid mt-3">
                      <div className="reporte-info-item">
                        <strong>Tipo:</strong> {detalleReporte.tipo}
                      </div>
                      <div className="reporte-info-item">
                        <strong>Estado:</strong> {detalleReporte.estado}
                      </div>
                      <div className="reporte-info-item">
                        <strong>Fecha de Reporte:</strong> {formatearFecha(detalleReporte.fecha_reporte)}
                      </div>
                      <div className="reporte-info-item">
                        <strong>Encargado:</strong> {detalleReporte.encargado_nombre || 'No asignado'}
                      </div>
                      <div className="reporte-info-item">
                        <strong>Sector:</strong> {detalleReporte.sector_nombre || 'N/A'}
                      </div>
                      {detalleReporte.observaciones && (
                        <div className="reporte-info-item observaciones">
                          <strong>Observaciones:</strong> {detalleReporte.observaciones}
                        </div>
                      )}
                      <div className="reporte-info-item">
                        <strong>Coordenadas:</strong> {detalleReporte.latitud}, {detalleReporte.longitud}
                      </div>
                    </div>
                  </Tab>
                  
                  {/* Tab para Detalle del Predio */}
                  {detalleReporte.detalle_predio && detalleReporte.tipo_reporte === 'predio' && (
                    <Tab eventKey="predio" title="Detalle Predio">
                      <div className="reporte-info-grid mt-3">
                        <div className="reporte-info-item">
                          <strong>Código Sector:</strong> {detalleReporte.detalle_predio.codigo_sector || 'N/A'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Código Predio:</strong> {detalleReporte.detalle_predio.codigo_predio || 'N/A'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Vía de Acceso:</strong> {detalleReporte.detalle_predio.via_acceso || 'N/A'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Número Municipal:</strong> {detalleReporte.detalle_predio.numero_municipal || 'N/A'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Homepass:</strong> {detalleReporte.detalle_predio.homepass || '0'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Vivienda:</strong> {detalleReporte.detalle_predio.vivienda ? 'Sí' : 'No'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Comercio:</strong> {detalleReporte.detalle_predio.comercio ? 'Sí' : 'No'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Esquina:</strong> {detalleReporte.detalle_predio.esquina ? 'Sí' : 'No'}
                        </div>
                        {detalleReporte.detalle_predio.actividad && (
                          <div className="reporte-info-item">
                            <strong>Actividad:</strong> {detalleReporte.detalle_predio.actividad}
                          </div>
                        )}
                        {detalleReporte.detalle_predio.nombre_institucion && (
                          <div className="reporte-info-item">
                            <strong>Institución:</strong> {detalleReporte.detalle_predio.nombre_institucion}
                          </div>
                        )}
                      </div>
                    </Tab>
                  )}
                  
                  {/* Tab para Detalle del Poste */}
                  {detalleReporte.detalle_poste && detalleReporte.tipo_reporte === 'poste' && (
                    <Tab eventKey="poste" title="Detalle Poste">
                      <div className="reporte-info-grid mt-3">
                        <div className="reporte-info-item">
                          <strong>Código:</strong> {detalleReporte.detalle_poste.codigo || 'N/A'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Tensión:</strong> {detalleReporte.detalle_poste.tension || 'N/A'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Altura:</strong> {detalleReporte.detalle_poste.altura || 'N/A'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Propietario:</strong> {detalleReporte.detalle_poste.propietario || 'N/A'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Cables Eléctricos:</strong> {detalleReporte.detalle_poste.cables_electricos || '0'}
                        </div>
                        <div className="reporte-info-item">
                          <strong>Cables Telemáticos:</strong> {detalleReporte.detalle_poste.cables_telematicos || '0'}
                        </div>
                      </div>
                    </Tab>
                  )}
                  
                  {/* Tab para Fotos */}
                  {detalleReporte.fotos && detalleReporte.fotos.length > 0 && (
                    <Tab eventKey="fotos" title="Fotos">
                      <div className="fotos-grid mt-3">
                        {detalleReporte.fotos.map((foto) => (
                          <div className="foto-item" key={foto.id}>
                            <img 
                              src={foto.url || foto.imagen} 
                              alt={`Foto ${foto.tipo}`}
                              className="foto-imagen"
                              onClick={() => window.open(foto.url || foto.imagen, '_blank')}
                            />
                            <div className="foto-info">
                              <span className="foto-tipo">{foto.tipo}</span>
                              {foto.latitud && foto.longitud && (
                                <span className="foto-coords">
                                  {foto.latitud}, {foto.longitud}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Tab>
                  )}
                </Tabs>
              </div>
            ) : (
              <p>No se pudo cargar la información del reporte</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
            {detalleReporte && detalleReporte.estado === 'pendiente' && (
              <>
                <Button 
                  variant="success" 
                  onClick={() => {
                    setShowModal(false);
                    validarReporte(detalleReporte.id, detalleReporte.tipo_reporte);
                  }}
                >
                  Validar
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {
                    setShowModal(false);
                    rechazarReporte(detalleReporte.id, detalleReporte.tipo_reporte);
                  }}
                >
                  Rechazar
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SupervisorDashboard;