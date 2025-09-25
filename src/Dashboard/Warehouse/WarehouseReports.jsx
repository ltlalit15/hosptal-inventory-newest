import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { 
  FaDownload, FaChartLine, FaWarehouse, FaExchangeAlt, FaBuilding, FaFilePdf, FaFileExcel, FaEye, FaTimes
} from 'react-icons/fa';

const WarehouseReports = () => {
  // State
  const [facility, setFacility] = useState('All Facilities');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showFacilityDemandModal, setShowFacilityDemandModal] = useState(false);
  const [showItemMovementModal, setShowItemMovementModal] = useState(false);
  const [timeRange, setTimeRange] = useState('monthly');
  
  // Facility Demand Chart Data
  const facilityDemandData = {
    labels: ['Main Warehouse', 'North Branch', 'South Branch', 'East Branch', 'West Branch'],
    datasets: [
      {
        label: 'Demand',
        data: [120, 90, 150, 100, 130],
        backgroundColor: '#3498db',
        borderRadius: 6,
        barThickness: 40
      }
    ]
  };
  
  const facilityDemandOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Facility Demand Chart',
        font: { size: 16, weight: 'bold' },
        padding: { top: 10, bottom: 20 }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0,0,0,0.05)' },
        title: {
          display: true,
          text: 'Demand (Units)'
        }
      },
      x: { 
        grid: { display: false },
        title: {
          display: true,
          text: 'Facilities'
        }
      }
    }
  };

  // Item Movement Chart Data
  const itemMovementData = {
    labels: timeRange === 'monthly' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Stock In',
        data: timeRange === 'monthly' 
          ? [120, 90, 150, 100, 130, 110, 140, 95, 125, 115, 135, 105]
          : [45, 52, 38, 47],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Stock Out',
        data: timeRange === 'monthly' 
          ? [80, 70, 100, 90, 110, 85, 120, 75, 95, 105, 115, 90]
          : [32, 28, 41, 35],
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };
  
  const itemMovementOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Item Movement Chart',
        font: { size: 16, weight: 'bold' },
        padding: { top: 10, bottom: 20 }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0,0,0,0.05)' },
        title: {
          display: true,
          text: 'Quantity'
        }
      },
      x: { 
        grid: { display: false },
        title: {
          display: true,
          text: timeRange === 'monthly' ? 'Months' : 'Weeks'
        }
      }
    }
  };

  // Mock data for facility demand details
  const facilityDemandDetails = [
    { id: 1, facility: 'Main Warehouse', demand: 120, topItems: 'Paracetamol, Gloves, Masks', percentage: 22 },
    { id: 2, facility: 'North Branch', demand: 90, topItems: 'Ibuprofen, Bandages', percentage: 16 },
    { id: 3, facility: 'South Branch', demand: 150, topItems: 'Syringes, Antiseptic', percentage: 27 },
    { id: 4, facility: 'East Branch', demand: 100, topItems: 'Thermometers, Gauze', percentage: 18 },
    { id: 5, facility: 'West Branch', demand: 130, topItems: 'Vitamins, Creams', percentage: 17 }
  ];

  // Mock data for item movement details
  const itemMovementDetails = timeRange === 'monthly' 
    ? [
        { id: 1, period: 'Jan', stockIn: 120, stockOut: 80, netMovement: 40 },
        { id: 2, period: 'Feb', stockIn: 90, stockOut: 70, netMovement: 20 },
        { id: 3, period: 'Mar', stockIn: 150, stockOut: 100, netMovement: 50 },
        { id: 4, period: 'Apr', stockIn: 100, stockOut: 90, netMovement: 10 },
        { id: 5, period: 'May', stockIn: 130, stockOut: 110, netMovement: 20 },
        { id: 6, period: 'Jun', stockIn: 110, stockOut: 85, netMovement: 25 },
        { id: 7, period: 'Jul', stockIn: 140, stockOut: 120, netMovement: 20 },
        { id: 8, period: 'Aug', stockIn: 95, stockOut: 75, netMovement: 20 },
        { id: 9, period: 'Sep', stockIn: 125, stockOut: 95, netMovement: 30 },
        { id: 10, period: 'Oct', stockIn: 115, stockOut: 105, netMovement: 10 },
        { id: 11, period: 'Nov', stockIn: 135, stockOut: 115, netMovement: 20 },
        { id: 12, period: 'Dec', stockIn: 105, stockOut: 90, netMovement: 15 }
      ]
    : [
        { id: 1, period: 'Week 1', stockIn: 45, stockOut: 32, netMovement: 13 },
        { id: 2, period: 'Week 2', stockIn: 52, stockOut: 28, netMovement: 24 },
        { id: 3, period: 'Week 3', stockIn: 38, stockOut: 41, netMovement: -3 },
        { id: 4, period: 'Week 4', stockIn: 47, stockOut: 35, netMovement: 12 }
      ];

  // Handle export
  const handleExport = (format, chartType) => {
    setExportFormat(format);
    alert(`Exporting ${chartType} as ${format.toUpperCase()} with filters: 
           Facility: ${facility}, 
           Date Range: ${dateFrom} to ${dateTo}`);
  };

  // Open chart modal
  const openChartModal = (chartType) => {
    if (chartType === 'facilityDemand') {
      setShowFacilityDemandModal(true);
    } else if (chartType === 'itemMovement') {
      setShowItemMovementModal(true);
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="fw-bold mb-2">Reports & Analytics</h2>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: '300px' }}>
            <input
              type="date"
              className="form-control"
              placeholder="From"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <span className="input-group-text">to</span>
            <input
              type="date"
              className="form-control"
              placeholder="To"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
              <FaDownload className="me-2" /> Export
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#" onClick={() => handleExport('pdf', 'All Charts')}><FaFilePdf className="me-2" /> PDF</a></li>
              <li><a className="dropdown-item" href="#" onClick={() => handleExport('excel', 'All Charts')}><FaFileExcel className="me-2" /> Excel</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Facility</label>
              <select 
                className="form-select"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
              >
                <option>All Facilities</option>
                <option>Main Warehouse</option>
                <option>North Branch</option>
                <option>South Branch</option>
                <option>East Branch</option>
                <option>West Branch</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Time Range</label>
              <select 
                className="form-select"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <button className="btn btn-primary w-100">Apply Filters</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="row">
        {/* Facility Demand Chart */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Facility Demand Chart</h5>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openChartModal('facilityDemand')}
                  title="View Details"
                >
                  <FaEye className="me-1" /> View
                </button>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <FaDownload className="me-1" /> Export
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#" onClick={() => handleExport('pdf', 'Facility Demand')}><FaFilePdf className="me-2" /> PDF</a></li>
                    <li><a className="dropdown-item" href="#" onClick={() => handleExport('excel', 'Facility Demand')}><FaFileExcel className="me-2" /> Excel</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body" style={{ height: '320px' }}>
              <Bar data={facilityDemandData} options={facilityDemandOptions} />
            </div>
          </div>
        </div>
        
        {/* Item Movement Chart */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Item Movement Chart</h5>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openChartModal('itemMovement')}
                  title="View Details"
                >
                  <FaEye className="me-1" /> View
                </button>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <FaDownload className="me-1" /> Export
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#" onClick={() => handleExport('pdf', 'Item Movement')}><FaFilePdf className="me-2" /> PDF</a></li>
                    <li><a className="dropdown-item" href="#" onClick={() => handleExport('excel', 'Item Movement')}><FaFileExcel className="me-2" /> Excel</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body" style={{ height: '320px' }}>
              <Line data={itemMovementData} options={itemMovementOptions} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Facility Demand Modal */}
      {showFacilityDemandModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowFacilityDemandModal(false);
        }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Facility Demand Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowFacilityDemandModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>Facility:</strong> {facility}</p>
                    <p><strong>Date Range:</strong> {dateFrom || 'Not specified'} to {dateTo || 'Not specified'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Total Facilities:</strong> {facilityDemandDetails.length}</p>
                    <p><strong>Total Demand:</strong> {facilityDemandDetails.reduce((sum, item) => sum + item.demand, 0)} units</p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body" style={{ height: '300px' }}>
                        <Bar data={facilityDemandData} options={facilityDemandOptions} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Facility</th>
                            <th>Demand</th>
                            <th>Top Items</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {facilityDemandDetails.map((item) => (
                            <tr key={item.id}>
                              <td>{item.facility}</td>
                              <td>{item.demand}</td>
                              <td>{item.topItems}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span className="me-2">{item.percentage}%</span>
                                  <div className="progress flex-grow-1" style={{ height: '10px' }}>
                                    <div 
                                      className="progress-bar bg-primary" 
                                      role="progressbar" 
                                      style={{ width: `${item.percentage}%` }}
                                      aria-valuenow={item.percentage} 
                                      aria-valuemin="0" 
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowFacilityDemandModal(false)}>
                  <FaTimes className="me-2" /> Close
                </button>
                <button type="button" className="btn btn-primary px-4" onClick={() => handleExport('pdf', 'Facility Demand')}>
                  <FaFilePdf className="me-2" /> Export PDF
                </button>
                <button type="button" className="btn btn-success px-4" onClick={() => handleExport('excel', 'Facility Demand')}>
                  <FaFileExcel className="me-2" /> Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Item Movement Modal */}
      {showItemMovementModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowItemMovementModal(false);
        }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Item Movement Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowItemMovementModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>Facility:</strong> {facility}</p>
                    <p><strong>Date Range:</strong> {dateFrom || 'Not specified'} to {dateTo || 'Not specified'}</p>
                    <p><strong>Time Range:</strong> {timeRange === 'monthly' ? 'Monthly' : 'Weekly'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Total Stock In:</strong> {itemMovementDetails.reduce((sum, item) => sum + item.stockIn, 0)} units</p>
                    <p><strong>Total Stock Out:</strong> {itemMovementDetails.reduce((sum, item) => sum + item.stockOut, 0)} units</p>
                    <p><strong>Net Movement:</strong> {itemMovementDetails.reduce((sum, item) => sum + item.netMovement, 0)} units</p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body" style={{ height: '300px' }}>
                        <Line data={itemMovementData} options={itemMovementOptions} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Period</th>
                            <th>Stock In</th>
                            <th>Stock Out</th>
                            <th>Net Movement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemMovementDetails.map((item) => (
                            <tr key={item.id}>
                              <td>{item.period}</td>
                              <td><span className="text-success">{item.stockIn}</span></td>
                              <td><span className="text-danger">{item.stockOut}</span></td>
                              <td className={item.netMovement >= 0 ? 'text-success' : 'text-danger'}>
                                {item.netMovement >= 0 ? '+' : ''}{item.netMovement}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowItemMovementModal(false)}>
                  <FaTimes className="me-2" /> Close
                </button>
                <button type="button" className="btn btn-primary px-4" onClick={() => handleExport('pdf', 'Item Movement')}>
                  <FaFilePdf className="me-2" /> Export PDF
                </button>
                <button type="button" className="btn btn-success px-4" onClick={() => handleExport('excel', 'Item Movement')}>
                  <FaFileExcel className="me-2" /> Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {(showFacilityDemandModal || showItemMovementModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default WarehouseReports;