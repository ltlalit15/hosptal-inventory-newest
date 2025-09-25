import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaPills,
  FaExclamationTriangle,
  FaFileImport,
} from "react-icons/fa";

// Mock KPI Values
const kpiData = {
  totalStock: "1,248",
  lowStock: "23",
  pendingReqs: "42",
};

// Mock Monthly Dispatch Data
const dispatchData = [
  { month: "Jan", dispatched: 120 },
  { month: "Feb", dispatched: 95 },
  { month: "Mar", dispatched: 140 },
  { month: "Apr", dispatched: 180 },
  { month: "May", dispatched: 160 },
  { month: "Jun", dispatched: 200 },
  { month: "Jul", dispatched: 175 },
  { month: "Aug", dispatched: 190 },
  { month: "Sep", dispatched: 210 },
  { month: "Oct", dispatched: 230 },
];

const WarehouseDashboard = () => {
  return (
    <div className="container-fluid py-4" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-primary">Warehouse Dashboard</h2>
        <p className="text-muted">
          Real-time overview of stock and monthly dispatches
        </p>
      </div>

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        {[
          {
            icon: <FaPills className="text-primary" size={18} />,
            label: "Total Stock",
            value: kpiData.totalStock,
            bg: "primary",
            color: "text-primary",
          },
          {
            icon: (
              <FaExclamationTriangle className="text-warning" size={18} />
            ),
            label: "Low Stock Alerts",
            value: kpiData.lowStock,
            bg: "warning",
            color: "text-warning",
          },
          {
            icon: <FaFileImport className="text-secondary" size={18} />,
            label: "Pending Facility Reqs",
            value: kpiData.pendingReqs,
            bg: "secondary",
            color: "text-secondary",
          },
        ].map((item, idx) => (
          <div className="col-12 col-md-4" key={idx}>
            <div
              className="card border-0 shadow-sm text-center bg-light"
              style={{
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 10px rgba(0,0,0,0.05)";
              }}
            >
              {/* Icon Section */}
              <div
                className={`bg-${item.bg} bg-opacity-10 p-3 d-flex justify-content-center align-items-center`}
                style={{
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  height: "60px",
                }}
              >
                <div
                  className={`d-flex align-items-center justify-content-center rounded-circle ${item.color}`}
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: `var(--bs-${item.bg}-rgb)`,
                    opacity: 0.9,
                  }}
                >
                  {item.icon}
                </div>
              </div>

              {/* Value & Label */}
              <div className="p-4">
                <h4 className={`fw-bold ${item.color} mb-1`}>{item.value}</h4>
                <small className="text-muted">{item.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Dispatch Chart */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-3">
          <h5 className="mb-0 fw-bold">Items Dispatched Monthly</h5>
        </div>
        <div className="card-body" style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dispatchData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="dispatched"
                stroke="#3498db"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
