import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsAnalytics = () => {
  const [reportType, setReportType] = useState("User Requests vs Delivered");
  const [facility, setFacility] = useState("All Facilities");

  // Sample Data for Reports
  const reportData = {
    "User Requests vs Delivered": [
      { label: "Q1", requests: 120, delivered: 100 },
      { label: "Q2", requests: 90, delivered: 80 },
      { label: "Q3", requests: 140, delivered: 130 },
      { label: "Q4", requests: 100, delivered: 95 },
    ],
    "Facility Stock Ledger": [
      { label: "Warehouse A", stock: 75 },
      { label: "Warehouse B", stock: 60 },
      { label: "Distribution Center", stock: 85 },
      { label: "Warehouse C", stock: 50 },
    ],
  };

  const chartData =
    reportType === "User Requests vs Delivered"
      ? {
          labels: reportData[reportType].map((item) => item.label),
          datasets: [
            {
              label: "Requests",
              data: reportData[reportType].map((item) => item.requests),
              backgroundColor: "#0d6efd",
              borderRadius: 4,
              borderSkipped: false,
            },
            {
              label: "Delivered",
              data: reportData[reportType].map((item) => item.delivered),
              backgroundColor: "#6c757d",
              borderRadius: 4,
              borderSkipped: false,
            },
          ],
        }
      : {
          labels: reportData[reportType].map((item) => item.label),
          datasets: [
            {
              label: "Stock Value",
              data: reportData[reportType].map((item) => item.stock),
              backgroundColor: "#0d6efd",
              borderRadius: 4,
              borderSkipped: false,
            },
          ],
        };

  return (
    <div
      className="container-fluid p-4"
      style={{ backgroundColor: "#ffff", minHeight: "100vh" }}
    >
      {/* Page Header - Matches Requisitions Style */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="mb-0">Reports</h1>
          <p className="text-muted mb-0">View analytics and insights</p>
        </div>
      </div>

      <div className="row">
        {/* Left Column - Report Filters */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Generate Report</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="reportType" className="form-label">
                    Report Type
                  </label>
                  <select
                    className="form-select"
                    id="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>User Requests vs Delivered</option>
                    <option>Facility Stock Ledger</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="facility" className="form-label">
                    Facility
                  </label>
                  <select
                    className="form-select"
                    id="facility"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                  >
                    <option>All Facilities</option>
                    <option>Warehouse A</option>
                    <option>Warehouse B</option>
                    <option>Distribution Center</option>
                    <option>Warehouse C</option>
                  </select>
                </div>

                <button type="button" className="btn btn-primary w-100">
                  Generate Report
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Report Preview */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Report Preview</h5>
              <button className="btn btn-light btn-sm">Export</button>
            </div>
            <div className="card-body">
              <h6 className="mb-4">{reportType}</h6>

              {/* Chart.js Bar Chart */}
              <div style={{ height: "300px", position: "relative" }}>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `Value: ${context.parsed.y}`;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: "rgba(0, 0, 0, 0.05)",
                        },
                        ticks: {
                          stepSize: 20,
                          font: { size: 12 },
                        },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { font: { size: 12, weight: "500" } },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;

