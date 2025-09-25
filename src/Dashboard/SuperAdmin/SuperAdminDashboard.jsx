import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SuperAdminDashboard = () => {
  // === Consistent Color Palette ===
  const COLORS = {
    primary: '#2563eb',    // Blue
    success: '#10b981',    // Green
    warning: '#f59e0b',    // Amber
    danger: '#ef4444',     // Red
    info: '#3b82f6',       // Light blue
    secondary: '#6b7280'   // Gray
  };

  // === KPI VALUES (Replace with real data from API later) ===
  const kpis = [
    { title: 'Total Inventory', value: '12,450', change: '+2.3%', positive: true },
    { title: 'Total Facilities', value: '87', change: '+1', positive: true },
    { title: 'Pending Requisitions', value: '42', change: '+5', positive: false },
    { title: 'Dispatches Today', value: '28', change: '+3', positive: true }
  ];

  // === STOCK MOVEMENT (Line Chart) ===
  const stockMovementData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Stock In',
        data: [300, 420, 380, 500, 620, 700],
        borderColor: COLORS.success,
        backgroundColor: COLORS.success + '20',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      },
      {
        label: 'Stock Out',
        data: [200, 300, 280, 400, 520, 600],
        borderColor: COLORS.danger,
        backgroundColor: COLORS.danger + '20',
        fill: true,
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  const stockMovementOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, padding: 15 }
      },
      title: {
        display: true,
        text: 'Stock Movement (Last 6 Months)',
        font: { size: 15, weight: '600' },
        padding: { top: 0, bottom: 15 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.03)' },
        ticks: { font: { size: 11 } }
      }
    }
  };

  // === REQUESTS vs COMPLETED (Bar Chart) ===
  const requestsVsCompletedData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Requests',
        data: [45, 52, 60, 70, 65, 80],
        backgroundColor: COLORS.warning,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: 'Completed',
        data: [30, 40, 48, 55, 60, 72],
        backgroundColor: COLORS.success,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };

  const requestsVsCompletedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, padding: 15 }
      },
      title: {
        display: true,
        text: 'Requests vs Completed',
        font: { size: 15, weight: '600' },
        padding: { top: 0, bottom: 15 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.03)' },
        ticks: { font: { size: 11 } }
      }
    }
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div className="mb-5">
        <h1 className="fw-bold text-gray-800">Super Admin Dashboard</h1>
        <p className="text-muted">System-wide monitoring overview</p>
      </div>

      {/* KPI CARDS */}
      <div className="row mb-5 g-4">
        {kpis.map((kpi, i) => (
          <div className="col-md-3" key={i}>
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-body p-4">
                <h6 className="text-muted mb-1">{kpi.title}</h6>
                <div className="d-flex align-items-baseline">
                  <h3 className="fw-bold mb-0 me-2">{kpi.value}</h3>
                  <span className={`small ${kpi.positive ? 'text-success' : 'text-danger'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="row g-4">
        {/* Stock Movement */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4" style={{ height: '400px' }}>
              <Line data={stockMovementData} options={stockMovementOptions} />
            </div>
          </div>
        </div>

        {/* Requests vs Completed */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body p-4" style={{ height: '400px' }}>
              <Bar data={requestsVsCompletedData} options={requestsVsCompletedOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;