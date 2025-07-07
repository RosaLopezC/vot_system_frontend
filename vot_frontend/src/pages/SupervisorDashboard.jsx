import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaFileAlt, FaMapMarkerAlt, FaDownload, FaEye, FaFilter } from 'react-icons/fa';
import './Dashboardsupervisor.css';

const SupervisorDashboard = () => {
  // Estados existentes
  const [activeTab, setActiveTab] = useState('reportes');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [district, setDistrict] = useState('');
  const [zone, setZone] = useState('');
  const [sector, setSector] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Nuevos estados
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    reportes: false,
    reportesV2: false
  });

  const toggleSubmenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Simulación de datos (reemplazar con llamada a API real)
  useEffect(() => {
    const fetchedReports = [
      {
        id: 1,
        type: 'Poste',
        code: 'P001',
        district: 'Distrito 1',
        zone: 'Zona A',
        sector: 'Sector 1',
        manager: 'Juan Pérez',
        date: '2025-05-01',
        status: 'Registrado',
        coordinates: '-12.0464,-77.0428',
        observations: 'Poste en buen estado',
        images: ['imagen1.jpg', 'imagen2.jpg']
      },
      // ... más reportes
    ];
    setReports(fetchedReports);
    setFilteredReports(fetchedReports);
  }, []);

  // Manejo de modal
  const handleShowModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  // Función mejorada de filtrado
  const handleFilterChange = () => {
    const filtered = reports.filter((report) => {
      const matchDistrict = district ? report.district.toLowerCase().includes(district.toLowerCase()) : true;
      const matchZone = zone ? report.zone.toLowerCase().includes(zone.toLowerCase()) : true;
      const matchSector = sector ? report.sector.toLowerCase().includes(sector.toLowerCase()) : true;
      const matchStartDate = startDate ? new Date(report.date) >= new Date(startDate) : true;
      const matchEndDate = endDate ? new Date(report.date) <= new Date(endDate) : true;

      return matchDistrict && matchZone && matchSector && matchStartDate && matchEndDate;
    });
    setFilteredReports(filtered);
  };

  // Renderizado del contenido principal
  const renderContent = () => {
    return (
      <div className="table-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>{activeTab === 'reportes' ? 'Reportes' : activeTab === 'reportesV2' ? 'Reportes V2' : 'Distritos'}</h3>
          <div className="export-buttons">
            <Button variant="success" className="me-2">
              <FaDownload /> Exportar XLSX
            </Button>
            <Button variant="info">
              <FaDownload /> Exportar CSV
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Código</th>
                <th>Distrito</th>
                <th>Zona</th>
                <th>Sector</th>
                <th>Encargado</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.type}</td>
                  <td>{report.code}</td>
                  <td>{report.district}</td>
                  <td>{report.zone}</td>
                  <td>{report.sector}</td>
                  <td>{report.manager}</td>
                  <td>{report.date}</td>
                  <td>
                    <span className={`badge bg-${report.status === 'Registrado' ? 'success' : 'warning'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <Button variant="info" size="sm" onClick={() => handleShowModal(report)} className="me-2">
                      <FaEye /> Ver
                    </Button>
                    <Button variant="success" size="sm">
                      <FaDownload /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h4>Dashboard Supervisor</h4>
        </div>
        <ul className="nav flex-column">
          {/* Menú Reportes */}
          <li className="nav-item">
            <Link
              className={`nav-link ${activeTab.startsWith('reportes') ? 'active' : ''}`}
              to="#"
              onClick={() => toggleSubmenu('reportes')}
            >
              <span><FaFileAlt /> Reportes</span>
              <span className={`menu-arrow ${openMenus.reportes ? 'open' : ''}`}>▶</span>
            </Link>
            <ul className={`submenu ${openMenus.reportes ? 'open' : ''}`}>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportes-todos')}>
                  Todos
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportes-postes')}>
                  Postes
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportes-predios')}>
                  Predios
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportes-postes-xls')}>
                  Postes XLS
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportes-predios-xls')}>
                  Predios XLS
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportes-observados')}>
                  Observados
                </Link>
              </li>
            </ul>
          </li>

          {/* Menú Reportes V2 */}
          <li className="nav-item">
            <Link
              className={`nav-link ${activeTab.startsWith('reportesV2') ? 'active' : ''}`}
              to="#"
              onClick={() => toggleSubmenu('reportesV2')}
            >
              <span><FaFileAlt /> Reportes V2</span>
              <span className={`menu-arrow ${openMenus.reportesV2 ? 'open' : ''}`}>▶</span>
            </Link>
            <ul className={`submenu ${openMenus.reportesV2 ? 'open' : ''}`}>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportesV2-todos')}>
                  Todos
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportesV2-postes')}>
                  Postes
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportesV2-predios')}>
                  Predios
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportesV2-postes-xls')}>
                  Postes XLS
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportesV2-predios-xls')}>
                  Predios XLS
                </Link>
              </li>
              <li>
                <Link className="nav-link" to="#" onClick={() => setActiveTab('reportesV2-observados')}>
                  Observados
                </Link>
              </li>
            </ul>
          </li>

          {/* Menú Distritos */}
          <li className="nav-item">
            <Link
              className={`nav-link ${activeTab === 'distritos' ? 'active' : ''}`}
              to="#"
              onClick={() => setActiveTab('distritos')}
            >
              <FaMapMarkerAlt /> Distritos
            </Link>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="content">
        <div className="dashboard-header">
          <h2>Bienvenido, Supervisor</h2>
          <p>Aquí podrás gestionar los reportes y validar la información.</p>
        </div>

        {/* Filtros */}
        <div className="filters-card">
          <h4><FaFilter /> Filtros de Reportes</h4>
          <Form>
            <Row className="g-3">
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por distrito"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por zona"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Col>
            </Row>
            <Button
              variant="primary"
              className="mt-3"
              onClick={handleFilterChange}
            >
              Aplicar Filtros
            </Button>
          </Form>
        </div>

        {/* Contenido principal */}
        {renderContent()}

        {/* Modal de detalles */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" className="report-modal">
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Reporte</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <>
                <Row>
                  <Col md={6}>
                    <p><strong>ID:</strong> {selectedReport.id}</p>
                    <p><strong>Tipo:</strong> {selectedReport.type}</p>
                    <p><strong>Código:</strong> {selectedReport.code}</p>
                    <p><strong>Distrito:</strong> {selectedReport.district}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Zona:</strong> {selectedReport.zone}</p>
                    <p><strong>Sector:</strong> {selectedReport.sector}</p>
                    <p><strong>Encargado:</strong> {selectedReport.manager}</p>
                    <p><strong>Estado:</strong> {selectedReport.status}</p>
                  </Col>
                </Row>
                <hr />
                <h5>Observaciones</h5>
                <p>{selectedReport.observations}</p>
                <hr />
                <h5>Coordenadas</h5>
                <p>{selectedReport.coordinates}</p>
                <hr />
                <h5>Imágenes</h5>
                <div className="report-images">
                  {selectedReport.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      className="report-image"
                    />
                  ))}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handleCloseModal}>
              Descargar PDF
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SupervisorDashboard;