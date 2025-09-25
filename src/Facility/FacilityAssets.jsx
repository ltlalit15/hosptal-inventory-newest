import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Row, Col, Button, Alert } from 'react-bootstrap';

const FacilityAssets = () => {
  // Simplified assets data matching requirements
  const [assets, setAssets] = useState([
    {
      id: 'AST-1001',
      name: 'Ventilator',
      assignedTo: 'Dr. Agyemang',
      status: 'Active'
    },
    {
      id: 'AST-1002',
      name: 'Ultrasound Machine',
      assignedTo: 'Radiology Dept',
      status: 'In Use'
    },
    {
      id: 'AST-1003',
      name: 'Patient Monitor',
      assignedTo: 'Emergency Room',
      status: 'Needs Repair'
    },
    {
      id: 'AST-1004',
      name: 'X-Ray Machine',
      assignedTo: 'Unassigned',
      status: 'Available'
    }
  ]);

  // State for Add Asset modal
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({
    id: '',
    name: '',
    assignedTo: '',
    status: 'Available'
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };

  // Submit new asset
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.assignedTo) {
      alert('Please fill in required fields');
      return;
    }
    // Generate new asset ID if not provided
    const assetId = newAsset.id || `AST-${Math.floor(1000 + Math.random() * 9000)}`;
    // Create new asset object
    const assetToAdd = {
      ...newAsset,
      id: assetId
    };
    // Add to assets list
    setAssets([...assets, assetToAdd]);
    // Reset form
    setNewAsset({
      id: '',
      name: '',
      assignedTo: '',
      status: 'Available'
    });
    setShowModal(false);
  };

  // Open add asset modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Close add asset modal
  const handleCloseModal = () => {
    setShowModal(false);
    setNewAsset({
      id: '',
      name: '',
      assignedTo: '',
      status: 'Available'
    });
  };

  // Open view asset modal
  const handleViewAsset = (asset) => {
    setSelectedAsset(asset);
    setShowViewModal(true);
  };

  // Close view asset modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedAsset(null);
  };

  // Get status class for badge
  const getStatusClass = (status) => {
    switch(status) {
      case 'Active':
      case 'In Use':
        return 'bg-success';
      case 'Available':
        return 'bg-info';
      case 'Needs Repair':
        return 'bg-warning';
      case 'Decommissioned':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#ffff', minHeight: '100vh' }}>
      {/* Header with H1 and Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="mb-0">Assets</h1>
          <p className="text-muted mb-0">Manage facility assets</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center" onClick={handleShowModal}>
          <i className="bi bi-plus me-1"></i> Add New Asset
        </button>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Asset ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Assigned To</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="fw-medium">{asset.id}</td>
                    <td>{asset.name}</td>
                    <td>{asset.assignedTo}</td>
                    <td>
                      <span className={`badge ${getStatusClass(asset.status)} text-white`}>
                        {asset.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                        title="View Details"
                        onClick={() => handleViewAsset(asset)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Asset Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add New Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Asset ID <span className="text-muted">(Optional)</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., AST-1005"
                    name="id"
                    value={newAsset.id}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Defibrillator"
                    name="name"
                    value={newAsset.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Assigned To <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., ICU, Dr. Mensah"
                    name="assignedTo"
                    value={newAsset.assignedTo}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={newAsset.status}
                    onChange={handleInputChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Active">Active</option>
                    <option value="In Use">In Use</option>
                    <option value="Needs Repair">Needs Repair</option>
                    <option value="Decommissioned">Decommissioned</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Asset
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Asset Details Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Asset Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAsset && (
            <div className="row">
              <div className="col-12 mb-3">
                <strong>Asset ID:</strong> <span className="text-muted">{selectedAsset.id}</span>
              </div>
              <div className="col-12 mb-3">
                <strong>Name:</strong> <span className="text-muted">{selectedAsset.name}</span>
              </div>
              <div className="col-12 mb-3">
                <strong>Assigned To:</strong> <span className="text-muted">{selectedAsset.assignedTo}</span>
              </div>
              <div className="col-12 mb-3">
                <strong>Status:</strong> 
                <span className={`badge ${getStatusClass(selectedAsset.status)} text-white ms-2`}>
                  {selectedAsset.status}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacilityAssets;