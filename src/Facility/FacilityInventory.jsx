import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';

const FacilityDashboard = () => {
  // Sample inventory data
  const [inventoryData, setInventoryData] = useState([
    { code: 'ITM-001', name: 'Paracetamol', qty: 120, reserved: 15, lastReceipt: '2025-01-10' },
    { code: 'ITM-002', name: 'Gloves', qty: 300, reserved: 50, lastReceipt: '2025-01-05' },
    { code: 'ITM-003', name: 'Syringes', qty: 500, reserved: 100, lastReceipt: '2025-01-12' },
    { code: 'ITM-004', name: 'Bandages', qty: 200, reserved: 20, lastReceipt: '2025-01-03' },
    { code: 'ITM-005', name: 'Ibuprofen', qty: 0, reserved: 0, lastReceipt: '2024-12-28' },
  ]);

  // Modal States
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Handle View
  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  // Handle Edit
  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  // Handle Save (Edit Modal)
  const handleSaveEdit = () => {
    setInventoryData(prev =>
      prev.map(item =>
        item.code === selectedItem.code ? selectedItem : item
      )
    );
    setShowEditModal(false);
  };

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Facility Inventory</h1>
          <p className="text-muted mb-0">
            Monitor and manage your facility’s stock levels in real time.
          </p>
        </Col>
      </Row>

      {/* Inventory Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">Inventory List</Card.Title>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Available Qty</th>
                    <th>Reserved</th>
                    <th>Last Receipt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>{item.reserved}</td>
                      <td>{item.lastReceipt}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => handleView(item)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-success"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
              <p><strong>Item Code:</strong> {selectedItem.code}</p>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Available Qty:</strong> {selectedItem.qty}</p>
              <p><strong>Reserved:</strong> {selectedItem.reserved}</p>
              <p><strong>Last Receipt:</strong> {selectedItem.lastReceipt}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Available Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedItem.qty}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, qty: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Reserved</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedItem.reserved}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, reserved: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FacilityDashboard;