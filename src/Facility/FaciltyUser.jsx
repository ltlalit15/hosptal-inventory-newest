import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';

const FacilityUser = () => {
  const [users, setUsers] = useState([
    {
      id: 'USR-001',
      name: 'John Mensah',
      department: 'Administration',
      role: 'Super Admin',
      email: 'john.mensah@facility.com'
    },
    {
      id: 'USR-002',
      name: 'Alice Ofori',
      department: 'Logistics',
      role: 'Warehouse Admin',
      email: 'alice.ofori@facility.com'
    },
    {
      id: 'USR-003',
      name: 'Dr. Kwame Asare',
      department: 'Medical',
      role: 'Facility Admin',
      email: 'kwame.asare@facility.com'
    },
    {
      id: 'USR-004',
      name: 'Nurse Ama Serwaa',
      department: 'Nursing',
      role: 'Facility User',
      email: 'ama.serwaa@facility.com'
    }
  ]);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-danger';
      case 'Warehouse Admin':
        return 'bg-primary';
      case 'Facility Admin':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Form state
  const [newUser, setNewUser] = useState({
    name: '',
    department: '',
    role: 'Facility User',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.department || !newUser.email) {
      alert('Please fill all required fields');
      return;
    }

    const newUserEntry = {
      ...newUser,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`
    };

    setUsers([...users, newUserEntry]);
    setNewUser({
      name: '',
      department: '',
      role: 'Facility User',
      email: ''
    });
    handleCloseModal();
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#ffff', minHeight: '100vh' }}>
      {/* Header with H1 and Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="mb-2">Users</h1>
          <p className="text-muted mb-3">
            Manage all facility users, assign roles, and keep track of user accounts easily.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleShowModal}>
          <i className="bi bi-plus me-1"></i> Add New User
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-header fs-3 text-dark ">
          <h5 className="mb-0">Users (List)</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Department</th>
                  <th scope="col">Role</th>
                  <th scope="col">Email</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.department}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => alert(`Edit user: ${user.name}`)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                              setUsers(users.filter(u => u.id !== user.id));
                            }
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., John Mensah"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Administration"
                    name="department"
                    value={newUser.department}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role *</Form.Label>
                  <Form.Select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Warehouse Admin">Warehouse Admin</option>
                    <option value="Facility Admin">Facility Admin</option>
                    <option value="Facility User">Facility User</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="e.g., john@example.com"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                  />
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
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacilityUser;