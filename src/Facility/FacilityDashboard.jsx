import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FacilityDashboard = () => {
  // KPI values (mocked for now, you can replace with real data later)
  const [kpis] = useState({
    facilityStock: 1248,
    pendingReqs: 42,
    dispatched: 310,
  });

  // Top 5 requested items data
  const topRequestedData = {
    labels: ['Paracetamol', 'Gloves', 'Syringes', 'Bandages', 'Ibuprofen'],
    datasets: [
      {
        label: 'Requests',
        data: [120, 95, 80, 75, 60],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top 5 Requested Items',
      },
    },
  };

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Facility Dashboard</h1>
        </Col>
      </Row>

      {/* KPIs */}
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Facility Stock</Card.Title>
              <Card.Text className="display-6">{kpis.facilityStock}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Pending User Reqs</Card.Title>
              <Card.Text className="display-6">{kpis.pendingReqs}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Dispatched from Warehouse</Card.Title>
              <Card.Text className="display-6">{kpis.dispatched}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Graph */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Requests Analytics</Card.Title>
              <div style={{ height: '400px' }}>
                <Bar data={topRequestedData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FacilityDashboard;
