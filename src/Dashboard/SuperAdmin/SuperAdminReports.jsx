import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  FaDownload, FaChartLine, FaTable, FaSearch, FaBuilding,
  FaFilePdf, FaFileExcel
} from 'react-icons/fa';

const SuperAdminReports = () => {
  // State for form inputs
  const [reportType, setReportType] = useState('Stock Ledger');
  const [facility, setFacility] = useState('All Facilities');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // State for modals
  const [showStockLedgerModal, setShowStockLedgerModal] = useState(false);
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [showFacilityUsageModal, setShowFacilityUsageModal] = useState(false);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  
  // State for generated report data
  const [generatedReport, setGeneratedReport] = useState(null);
  
  // Chart options (shared)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  
  // Mock data for different report types
  const stockLedgerData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Stock Value',
        data: [120, 150, 180, 90, 160, 200],
        backgroundColor: '#4e73df',
        borderRadius: 8,
        barThickness: 30
      }
    ]
  };
  
  const requisitionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Requisition Count',
        data: [42, 38, 55, 32, 48, 60],
        backgroundColor: '#e74a3b',
        borderRadius: 8,
        barThickness: 30
      }
    ]
  };
  
  const facilityUsageData = {
    labels: ['Main Warehouse', 'Kumasi Hospital', 'Accra Hospital', 'Takoradi Clinic', 'Cape Coast Hospital'],
    datasets: [
      {
        label: 'Usage %',
        data: [85, 65, 75, 45, 60],
        backgroundColor: '#1cc88a',
        borderRadius: 8,
        barThickness: 30
      }
    ]
  };
  
  // Mock report data for table views
  const stockLedgerTableData = [
    { id: 'DRG-001', name: 'Paracetamol 500mg', category: 'Pharmaceutical', opening: 100, received: 50, issued: 30, closing: 120, value: 7500 },
    { id: 'DRG-002', name: 'Amoxicillin 250mg', category: 'Pharmaceutical', opening: 80, received: 20, issued: 15, closing: 85, value: 4000 },
    { id: 'SUP-001', name: 'Surgical Gloves', category: 'Medical Supply', opening: 150, received: 100, issued: 50, closing: 200, value: 6000 },
    { id: 'CON-001', name: 'Syringe 5ml', category: 'Consumable', opening: 400, received: 200, issued: 100, closing: 500, value: 2500 }
  ];

  const requisitionTableData = [
    { id: 'REQ-101', facility: 'Kumasi Hospital', items: 12, status: 'Approved', date: '2023-06-15', value: 3200 },
    { id: 'REQ-102', facility: 'Accra Hospital', items: 8, status: 'Pending', date: '2023-06-18', value: 1800 },
    { id: 'REQ-103', facility: 'Takoradi Clinic', items: 15, status: 'Approved', date: '2023-06-20', value: 4500 },
    { id: 'REQ-104', facility: 'Cape Coast Hospital', items: 10, status: 'Rejected', date: '2023-06-22', value: 2200 }
  ];

  const facilityUsageTableData = [
    { facility: 'Main Warehouse', usage: '85%', items: 1250, value: 12500 },
    { facility: 'Kumasi Hospital', usage: '65%', items: 850, value: 8500 },
    { facility: 'Accra Hospital', usage: '75%', items: 950, value: 9500 },
    { facility: 'Takoradi Clinic', usage: '45%', items: 420, value: 4200 },
    { facility: 'Cape Coast Hospital', usage: '60%', items: 680, value: 6800 }
  ];
  
  // Modal handlers
  const openStockLedgerModal = () => setShowStockLedgerModal(true);
  const openRequisitionModal = () => setShowRequisitionModal(true);
  const openFacilityUsageModal = () => setShowFacilityUsageModal(true);
  
  const handleGenerateReport = (e) => {
    e.preventDefault();
    let reportData;
    
    switch(reportType) {
      case 'Stock Ledger':
        reportData = stockLedgerTableData;
        break;
      case 'Requisition Summary':
        reportData = requisitionTableData;
        break;
      case 'Facility-wise Usage':
        reportData = facilityUsageTableData;
        break;
      default:
        reportData = stockLedgerTableData;
    }
    
    setGeneratedReport({
      type: reportType,
      facility: facility,
      dateFrom: dateFrom,
      dateTo: dateTo,
      data: reportData
    });
    setShowGeneratedModal(true);
  };
  
  // Get chart data based on report type
  const getChartData = (type) => {
    switch(type) {
      case 'Stock Ledger': return stockLedgerData;
      case 'Requisition Summary': return requisitionData;
      case 'Facility-wise Usage': return facilityUsageData;
      default: return stockLedgerData;
    }
  };

  // Get chart title based on report type
  const getChartTitle = (type) => {
    switch(type) {
      case 'Stock Ledger': return 'Monthly Stock Value';
      case 'Requisition Summary': return 'Monthly Requisition Count';
      case 'Facility-wise Usage': return 'Facility Usage Percentage';
      default: return 'Report Data';
    }
  };
  
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Reports & Analytics</h2>
        <button className="btn btn-primary d-flex align-items-center">
          <FaDownload className="me-2" /> Export Report
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Generate Custom Report</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleGenerateReport}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Report Type</label>
                  <select 
                    className="form-select" 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>Stock Ledger</option>
                    <option>Requisition Summary</option>
                    <option>Facility-wise Usage</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Date Range</label>
                  <div className="input-group">
                    <input 
                      type="date" 
                      className="form-control" 
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <span className="input-group-text">to</span>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Facility</label>
                  <select 
                    className="form-select"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                  >
                    <option>All Facilities</option>
                    <option>Main Warehouse</option>
                    <option>Kumasi Branch Hospital</option>
                    <option>Accra Central Hospital</option>
                    <option>Takoradi Clinic</option>
                    <option>Cape Coast Hospital</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
                  <FaChartLine className="me-2" /> Generate Report
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Report Preview</h5>
            </div>
            <div className="card-body" style={{ height: '300px' }}>
              <Bar 
                data={getChartData(reportType)} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: getChartTitle(reportType)
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Reports */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Quick Reports</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaTable className="text-primary fa-2x" />
                  </div>
                  <h6 className="fw-bold">Stock Ledger</h6>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={openStockLedgerModal}>Generate</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaSearch className="text-danger fa-2x" />
                  </div>
                  <h6 className="fw-bold">Requisition Summary</h6>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={openRequisitionModal}>Generate</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaBuilding className="text-success fa-2x" />
                  </div>
                  <h6 className="fw-bold">Facility-wise Usage</h6>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={openFacilityUsageModal}>Generate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Ledger Modal */}
      {showStockLedgerModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Stock Ledger Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowStockLedgerModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <Bar 
                    data={stockLedgerData} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          ...chartOptions.plugins.title,
                          text: 'Monthly Stock Value'
                        }
                      }
                    }} 
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Opening Stock</th>
                        <th>Received</th>
                        <th>Issued</th>
                        <th>Closing Stock</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockLedgerTableData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>{item.opening}</td>
                          <td>{item.received}</td>
                          <td>{item.issued}</td>
                          <td>{item.closing}</td>
                          <td>${item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <h6>Summary</h6>
                    <p>Total Items: <span className="fw-bold">{stockLedgerTableData.length}</span></p>
                    <p>Total Stock Value: <span className="fw-bold">${stockLedgerTableData.reduce((sum, item) => sum + item.value, 0)}</span></p>
                  </div>
                  <div className="d-flex align-items-end">
                    <button className="btn btn-primary me-2">
                      <FaFilePdf className="me-2" /> Export PDF
                    </button>
                    <button className="btn btn-success">
                      <FaFileExcel className="me-2" /> Export Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requisition Summary Modal */}
      {showRequisitionModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Requisition Summary Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowRequisitionModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <Bar 
                    data={requisitionData} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          ...chartOptions.plugins.title,
                          text: 'Monthly Requisition Count'
                        }
                      }
                    }} 
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Req ID</th>
                        <th>Facility</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requisitionTableData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.facility}</td>
                          <td>{item.items}</td>
                          <td>
                            <span className={`badge ${
                              item.status === 'Approved' ? 'bg-success' : 
                              item.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td>{item.date}</td>
                          <td>${item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <h6>Summary</h6>
                    <p>Total Requisitions: <span className="fw-bold">{requisitionTableData.length}</span></p>
                    <p>Total Value: <span className="fw-bold">${requisitionTableData.reduce((sum, item) => sum + item.value, 0)}</span></p>
                    <p>Approved: <span className="fw-bold">2</span>, Pending: <span className="fw-bold">1</span>, Rejected: <span className="fw-bold">1</span></p>
                  </div>
                  <div className="d-flex align-items-end">
                    <button className="btn btn-primary me-2">
                      <FaFilePdf className="me-2" /> Export PDF
                    </button>
                    <button className="btn btn-success">
                      <FaFileExcel className="me-2" /> Export Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Facility-wise Usage Modal */}
      {showFacilityUsageModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Facility-wise Usage Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowFacilityUsageModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <Bar 
                    data={facilityUsageData} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          ...chartOptions.plugins.title,
                          text: 'Facility Usage Percentage'
                        }
                      }
                    }} 
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Facility</th>
                        <th>Usage %</th>
                        <th>Items Consumed</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilityUsageTableData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.facility}</td>
                          <td>{item.usage}</td>
                          <td>{item.items}</td>
                          <td>${item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <div>
                    <h6>Summary</h6>
                    <p>Average Usage: <span className="fw-bold">66%</span></p>
                    <p>Total Items Consumed: <span className="fw-bold">{facilityUsageTableData.reduce((sum, item) => sum + item.items, 0)}</span></p>
                    <p>Total Value: <span className="fw-bold">${facilityUsageTableData.reduce((sum, item) => sum + item.value, 0)}</span></p>
                  </div>
                  <div className="d-flex align-items-end">
                    <button className="btn btn-primary me-2">
                      <FaFilePdf className="me-2" /> Export PDF
                    </button>
                    <button className="btn btn-success">
                      <FaFileExcel className="me-2" /> Export Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Report Modal */}
      {showGeneratedModal && generatedReport && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{generatedReport.type} - {generatedReport.facility}</h5>
                <button type="button" className="btn-close" onClick={() => setShowGeneratedModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between mb-4">
                  <div>
                    <p><strong>Date Range:</strong> {generatedReport.dateFrom || 'N/A'} to {generatedReport.dateTo || 'N/A'}</p>
                    <p><strong>Generated On:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button className="btn btn-primary me-2">
                      <FaFilePdf className="me-2" /> Export PDF
                    </button>
                    <button className="btn btn-success">
                      <FaFileExcel className="me-2" /> Export Excel
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Bar 
                    data={getChartData(generatedReport.type)} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        title: {
                          ...chartOptions.plugins.title,
                          text: getChartTitle(generatedReport.type)
                        }
                      }
                    }} 
                  />
                </div>
                
                <div className="table-responsive">
                  {generatedReport.type === 'Stock Ledger' && (
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Item ID</th>
                          <th>Item Name</th>
                          <th>Category</th>
                          <th>Opening Stock</th>
                          <th>Received</th>
                          <th>Issued</th>
                          <th>Closing Stock</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedReport.data.map((item, index) => (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.opening}</td>
                            <td>{item.received}</td>
                            <td>{item.issued}</td>
                            <td>{item.closing}</td>
                            <td>${item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  
                  {generatedReport.type === 'Requisition Summary' && (
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Req ID</th>
                          <th>Facility</th>
                          <th>Items</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedReport.data.map((item, index) => (
                          <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.facility}</td>
                            <td>{item.items}</td>
                            <td>
                              <span className={`badge ${
                                item.status === 'Approved' ? 'bg-success' : 
                                item.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td>{item.date}</td>
                            <td>${item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  
                  {generatedReport.type === 'Facility-wise Usage' && (
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Facility</th>
                          <th>Usage %</th>
                          <th>Items Consumed</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedReport.data.map((item, index) => (
                          <tr key={index}>
                            <td>{item.facility}</td>
                            <td>{item.usage}</td>
                            <td>{item.items}</td>
                            <td>${item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                
                <div className="mt-4 p-3 bg-light rounded">
                  <h6>Report Summary</h6>
                  {generatedReport.type === 'Stock Ledger' && (
                    <>
                      <p>Total Items: <span className="fw-bold">{generatedReport.data.length}</span></p>
                      <p>Total Stock Value: <span className="fw-bold">${generatedReport.data.reduce((sum, item) => sum + item.value, 0)}</span></p>
                    </>
                  )}
                  {generatedReport.type === 'Requisition Summary' && (
                    <>
                      <p>Total Requisitions: <span className="fw-bold">{generatedReport.data.length}</span></p>
                      <p>Total Value: <span className="fw-bold">${generatedReport.data.reduce((sum, item) => sum + item.value, 0)}</span></p>
                    </>
                  )}
                  {generatedReport.type === 'Facility-wise Usage' && (
                    <>
                      <p>Total Facilities: <span className="fw-bold">{generatedReport.data.length}</span></p>
                      <p>Total Items Consumed: <span className="fw-bold">{generatedReport.data.reduce((sum, item) => sum + item.items, 0)}</span></p>
                      <p>Total Value: <span className="fw-bold">${generatedReport.data.reduce((sum, item) => sum + item.value, 0)}</span></p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showStockLedgerModal || showRequisitionModal || showFacilityUsageModal || showGeneratedModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
};

export default SuperAdminReports;