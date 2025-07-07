// pages/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import { 
  FaBuilding, FaUsers, FaClipboardList, FaCog, FaChartBar, 
  FaMapMarkerAlt, FaDownload, FaEye, FaEdit, FaTrash, FaBars,
  FaUserPlus, FaSignOutAlt, FaFileAlt
} from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';
import axios from 'axios';
import api from '../utils/api'; // Add this line
import './Dashboardsuperadmin.css';

const SuperAdminDashboard = () => {
  // Estados principales
  const [activeSection, setActiveSection] = useState('dashboard');
  const [openMenus, setOpenMenus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados para datos
  const [statistics, setStatistics] = useState({
    totalCompanies: 0,
    activeUsers: 0,
    totalReports: 0,
    observedReports: 0,
    resolvedReports: 0
  });
  const [companies, setCompanies] = useState([
    {
      id: 0,
      name: '',
      status: 'inactive',
      reportsCount: 0
    }
  ]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Estados para filtros
  const [filters, setFilters] = useState({
    district: '',
    zone: '',
    sector: '',
    startDate: '',
    endDate: '',
    searchId: ''
  });

  // Efectos para cargar datos
  useEffect(() => {
    loadStatistics();
    loadCompanies();
    loadUsers();
    loadReports();
    loadDistricts();
  }, []);

  // Funciones de carga de datos
  const loadStatistics = async () => {
    try {
      // Aquí irá la llamada a la API cuando esté lista
      setStatistics({
        totalCompanies: 25,
        activeUsers: 150,
        totalReports: 1200,
        observedReports: 45,
        resolvedReports: 980
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las estadísticas'
      });
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await api.getCompanies();
      setCompanies(response.data || []); // Use empty array if no data
    } catch (error) {
      console.error('Error loading companies:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las empresas'
      });
      setCompanies([]); // Set empty array on error
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios'
      });
    }
  };

  const loadReports = async () => {
    try {
      const response = await api.getReports(filters);
      setReports(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los reportes'
      });
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await api.getDistricts();
      setDistricts(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los distritos'
      });
    }
  };

  // Función para manejar submenús
  const toggleSubmenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Función para manejar modales
  const handleShowModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Renderizado de diferentes secciones
  const renderDashboard = () => {
    return (
      <>
        <h2>Panel de Control</h2>
        <Row className="mt-4">
          {/* Cards de estadísticas */}
          <Col md={4} lg={2}>
            <Card className="dashboard-stat-card">
              <Card.Body>
                <h3>{statistics.totalCompanies}</h3>
                <p>Empresas</p>
              </Card.Body>
            </Card>
          </Col>
          {/* ... más cards ... */}
        </Row>
        <Row className="mt-4">
          {/* Gráficos */}
          <Col md={6}>
            <Card>
              <Card.Body>
                <h4>Reportes Mensuales</h4>
                <ResponsiveContainer width="100%" height={300}>
                  {/* Gráfico de barras */}
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <h4>Distribución de Reportes</h4>
                <ResponsiveContainer width="100%" height={300}>
                  {/* Gráfico circular */}
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  // Renderizado de la sección de empresas
  const renderCompanies = () => {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestión de Empresas</h2>
          <Button variant="primary" onClick={() => handleShowModal('nueva-empresa')}>
            <FaBuilding /> Crear Empresa
          </Button>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Reportes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {companies && companies.length > 0 ? (
              companies.map(company => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  <td>
                    <Badge bg={company.status === 'active' ? 'success' : 'danger'}>
                      {company.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>{company.reportsCount || 0}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2">
                      <FaEye /> Ver
                    </Button>
                    <Button variant="warning" size="sm" className="me-2">
                      <FaEdit /> Editar
                    </Button>
                    <Button variant="danger" size="sm">
                      <FaTrash /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay empresas registradas</td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    );
  };

  // ... más funciones de renderizado para otras secciones ...

  // Renderizado principal basado en la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'empresas':
        return renderCompanies();
      // ... más casos ...
      default:
        return <h2>Seleccione una sección</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h4>SuperAdmin Dashboard</h4>
          <Button 
            variant="link" 
            className="d-md-none toggle-sidebar"
            onClick={() => setSidebarActive(!sidebarActive)}
          >
            <FaBars />
          </Button>
        </div>
        
        <Nav className="flex-column">
          {/* Menú completo aquí */}
        </Nav>
      </div>

      <div className="content">
        <Container fluid>
          {renderContent()}
        </Container>
      </div>

      {/* Modales */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        {/* ... contenido del modal ... */}
      </Modal>
    </div>
  );
};

export default SuperAdminDashboard;
