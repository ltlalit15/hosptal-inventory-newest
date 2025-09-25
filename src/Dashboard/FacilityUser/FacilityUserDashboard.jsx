import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaExclamationTriangle, FaClock, FaHourglassHalf, FaShoppingCart, FaFileCsv, FaFilePdf, FaSearch, FaFilter, FaArrowUp, FaChartLine } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacilityUserDashboard = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    outOfStock: 5,
    lowStock: 12,
    nearExpiry: 8,
    pendingApprovals: 3,
    itemsIssuedCount: 42,
    itemsIssuedValue: 2450.75,
    monthlyTrend: '+12%'
  });

  // State for drill-down modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalColumns, setModalColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate fetching dashboard data
  useEffect(() => {
    // In a real app, this would come from an API
    setDashboardData({
      outOfStock: 5,
      lowStock: 12,
      nearExpiry: 8,
      pendingApprovals: 3,
      itemsIssuedCount: 42,
      itemsIssuedValue: 2450.75,
      monthlyTrend: '+12%'
    });
  }, []);

  // Handle widget click
  const handleWidgetClick = (widgetType) => {
    let title = '';
    let columns = [];
    let data = [];

    // Set title, columns and mock data based on widget type
    switch(widgetType) {
      case 'outOfStock':
        title = 'Out of Stock Items';
        columns = ['Item Code', 'Item Name', 'Category', 'Last Stock Date', 'Days Since'];
        data = [
          { id: 1, code: 'MED001', name: 'Paracetamol 500mg', category: 'Medicine', lastStockDate: '2023-10-15', daysSince: 12 },
          { id: 2, code: 'SUP023', name: 'Surgical Gloves', category: 'Supplies', lastStockDate: '2023-10-10', daysSince: 17 },
          { id: 3, code: 'MED045', name: 'Antiseptic Solution', category: 'Medicine', lastStockDate: '2023-10-05', daysSince: 22 },
          { id: 4, code: 'EQ078', name: 'Thermometer Covers', category: 'Equipment', lastStockDate: '2023-10-01', daysSince: 26 },
          { id: 5, code: 'MED102', name: 'Insulin Syringes', category: 'Medicine', lastStockDate: '2023-09-28', daysSince: 29 }
        ];
        break;
      case 'lowStock':
        title = 'Low Stock Items';
        columns = ['Item Code', 'Item Name', 'Current Stock', 'Min Level', 'Reorder Point', 'Status'];
        data = [
          { id: 1, code: 'MED003', name: 'Amoxicillin 500mg', currentStock: 15, minLevel: 30, reorderPoint: 25, status: 'Critical' },
          { id: 2, code: 'SUP015', name: 'Face Masks', currentStock: 40, minLevel: 100, reorderPoint: 80, status: 'Low' },
          { id: 3, code: 'MED027', name: 'Vitamin C Tablets', currentStock: 25, minLevel: 50, reorderPoint: 40, status: 'Low' },
          { id: 4, code: 'EQ056', name: 'Blood Pressure Cuffs', currentStock: 3, minLevel: 10, reorderPoint: 8, status: 'Critical' },
          { id: 5, code: 'SUP089', name: 'Alcohol Swabs', currentStock: 60, minLevel: 200, reorderPoint: 150, status: 'Low' }
        ];
        break;
      case 'nearExpiry':
        title = 'Near Expiry Items';
        columns = ['Item Code', 'Item Name', 'Batch/Lot', 'Expiry Date', 'Days Remaining', 'Quantity'];
        data = [
          { id: 1, code: 'MED007', name: 'Ibuprofen 400mg', batch: 'B789', expiryDate: '2023-12-15', daysRemaining: 30, quantity: 120 },
          { id: 2, code: 'MED019', name: 'Cough Syrup', batch: 'L456', expiryDate: '2023-11-30', daysRemaining: 15, quantity: 45 },
          { id: 3, code: 'SUP034', name: 'Bandages', batch: 'B234', expiryDate: '2024-01-10', daysRemaining: 56, quantity: 200 },
          { id: 4, code: 'MED056', name: 'Antihistamine', batch: 'L789', expiryDate: '2023-12-01', daysRemaining: 16, quantity: 75 },
          { id: 5, code: 'SUP067', name: 'Sterile Gauze', batch: 'B567', expiryDate: '2024-01-20', daysRemaining: 66, quantity: 150 }
        ];
        break;
      case 'pendingApprovals':
        title = 'Pending Approvals';
        columns = ['Requisition ID', 'Date Submitted', 'Items Count', 'Total Value', 'Status', 'Admin Notes'];
        data = [
          { id: 1, reqId: 'REQ-2023-045', date: '2023-10-20', itemsCount: 8, totalValue: 425.50, status: 'Pending', notes: '' },
          { id: 2, reqId: 'REQ-2023-042', date: '2023-10-18', itemsCount: 5, totalValue: 210.75, status: 'Pending', notes: '' },
          { id: 3, reqId: 'REQ-2023-039', date: '2023-10-15', itemsCount: 12, totalValue: 680.25, status: 'Pending', notes: 'Waiting for vendor confirmation' }
        ];
        break;
      case 'itemsIssued':
        title = 'Items Issued This Month';
        columns = ['Issue Date', 'Item Name', 'Quantity', 'Unit Price', 'Total Value', 'Department'];
        data = [
          { id: 1, date: '2023-10-25', name: 'Paracetamol 500mg', quantity: 100, unitPrice: 2.50, totalValue: 250.00, department: 'Pharmacy' },
          { id: 2, date: '2023-10-23', name: 'Surgical Gloves', quantity: 200, unitPrice: 0.75, totalValue: 150.00, department: 'Surgery' },
          { id: 3, date: '2023-10-20', name: 'Antiseptic Solution', quantity: 50, unitPrice: 5.25, totalValue: 262.50, department: 'Emergency' },
          { id: 4, date: '2023-10-18', name: 'Insulin Pens', quantity: 30, unitPrice: 15.00, totalValue: 450.00, department: 'Endocrinology' },
          { id: 5, date: '2023-10-15', name: 'Blood Test Kits', quantity: 25, unitPrice: 12.50, totalValue: 312.50, department: 'Lab' }
        ];
        break;
      default:
        return;
    }

    setModalTitle(title);
    setModalColumns(columns);
    setModalData(data);
    setShowModal(true);
  };

  // Handle CSV export
  const handleExportCSV = () => {
    alert(`Exporting ${modalTitle} data to CSV`);
    // In a real app, this would generate and download a CSV file
  };

  // Handle PDF export
  const handleExportPDF = () => {
    alert(`Exporting ${modalTitle} data to PDF`);
    // In a real app, this would generate and download a PDF file
  };

  // Filter data based on search term
  const filteredData = modalData.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'critical': return 'bg-danger';
      case 'low': return 'bg-warning';
      case 'pending': return 'bg-secondary';
      default: return 'bg-info';
    }
  };

  // Get icon color based on widget type
  const getIconColor = (widgetType) => {
    switch(widgetType) {
      case 'outOfStock': return 'text-danger';
      case 'lowStock': return 'text-warning';
      case 'nearExpiry': return 'text-info';
      case 'pendingApprovals': return 'text-secondary';
      case 'itemsIssued': return 'text-success';
      default: return 'text-primary';
    }
  };

  // Get card background color based on widget type
  const getCardBgColor = (widgetType) => {
    switch(widgetType) {
      case 'outOfStock': return '#ffebee'; // Very light red
      case 'lowStock': return '#fff8e1'; // Very light yellow
      case 'nearExpiry': return '#e1f5fe'; // Very light blue
      case 'pendingApprovals': return '#f5f5f5'; // Very light gray
      case 'itemsIssued': return '#e8f5e9'; // Very light green
      default: return '#ffffff';
    }
  };

  // Get stat card background color based on index
  const getStatCardBgColor = (index) => {
    const colors = [
      '#e8f5e9', // Very light green - Inventory Accuracy
      '#e1f5fe', // Very light blue - Requisitions This Month
      '#fff8e1', // Very light yellow - Fulfillment Rate
      '#ffebee'  // Very light red - Days Lead Time
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Facility User Dashboard</h2>
          <p className="text-muted mb-0">Pharmacy Department | Dr. Sharma</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <div className="text-muted small">Last Updated</div>
            <div>Today, 10:30 AM</div>
          </div>
          <div className="bg-light rounded-circle p-2">
            <FaChartLine size={24} className="text-primary" />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Out of Stock Widget */}
        <div className="col-md-6 col-lg-4">
          <div 
            className="card widget-card h-100 shadow-sm border-0" 
            style={{ backgroundColor: getCardBgColor('outOfStock') }}
            onClick={() => handleWidgetClick('outOfStock')}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title">Out of Stock</h5>
                  <p className="text-muted small mb-0">Items completely out of stock</p>
                </div>
                <div className={`widget-icon ${getIconColor('outOfStock')}`}>
                  <FaBoxOpen size={24} />
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0 me-3">{dashboardData.outOfStock}</h2>
                <div>
                  <div className="text-danger small fw-bold">Requires immediate attention</div>
                </div>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Click to view details</span>
                <span className="text-danger small fw-bold">Critical</span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Widget */}
        <div className="col-md-6 col-lg-4">
          <div 
            className="card widget-card h-100 shadow-sm border-0" 
            style={{ backgroundColor: getCardBgColor('lowStock') }}
            onClick={() => handleWidgetClick('lowStock')}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title">Low Stock</h5>
                  <p className="text-muted small mb-0">Items below minimum level</p>
                </div>
                <div className={`widget-icon ${getIconColor('lowStock')}`}>
                  <FaExclamationTriangle size={24} />
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0 me-3">{dashboardData.lowStock}</h2>
                <div>
                  <div className="text-warning small fw-bold">Action required soon</div>
                </div>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Click to view details</span>
                <span className="text-warning small fw-bold">Warning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Near Expiry Widget */}
        <div className="col-md-6 col-lg-4">
          <div 
            className="card widget-card h-100 shadow-sm border-0" 
            style={{ backgroundColor: getCardBgColor('nearExpiry') }}
            onClick={() => handleWidgetClick('nearExpiry')}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title">Near Expiry</h5>
                  <p className="text-muted small mb-0">Items expiring soon</p>
                </div>
                <div className={`widget-icon ${getIconColor('nearExpiry')}`}>
                  <FaClock size={24} />
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0 me-3">{dashboardData.nearExpiry}</h2>
                <div>
                  <div className="text-info small fw-bold">Plan usage or return</div>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="small">30 days: 3</span>
                <span className="small">60 days: 3</span>
                <span className="small">90 days: 2</span>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-info" role="progressbar" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Click to view details</span>
                <span className="text-info small fw-bold">Monitor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Widget */}
        <div className="col-md-6 col-lg-4">
          <div 
            className="card widget-card h-100 shadow-sm border-0" 
            style={{ backgroundColor: getCardBgColor('pendingApprovals') }}
            onClick={() => handleWidgetClick('pendingApprovals')}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title">Pending Approvals</h5>
                  <p className="text-muted small mb-0">Requisitions awaiting approval</p>
                </div>
                <div className={`widget-icon ${getIconColor('pendingApprovals')}`}>
                  <FaHourglassHalf size={24} />
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0 me-3">{dashboardData.pendingApprovals}</h2>
                <div>
                  <div className="text-secondary small fw-bold">Avg. wait: 2.5 days</div>
                </div>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Click to view details</span>
                <span className="text-secondary small fw-bold">Waiting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Issued This Month Widget */}
        <div className="col-md-6 col-lg-4">
          <div 
            className="card widget-card h-100 shadow-sm border-0" 
            style={{ backgroundColor: getCardBgColor('itemsIssued') }}
            onClick={() => handleWidgetClick('itemsIssued')}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title">Items Issued This Month</h5>
                  <p className="text-muted small mb-0">Total items issued</p>
                </div>
                <div className={`widget-icon ${getIconColor('itemsIssued')}`}>
                  <FaShoppingCart size={24} />
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <h2 className="mb-0 me-3">{dashboardData.itemsIssuedCount}</h2>
                <div>
                  <div className="text-success small fw-bold d-flex align-items-center">
                    <FaArrowUp className="me-1" /> {dashboardData.monthlyTrend} from last month
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="small">Value: ${dashboardData.itemsIssuedValue.toFixed(2)}</span>
                <span className="small">Avg: ${(dashboardData.itemsIssuedValue / dashboardData.itemsIssuedCount).toFixed(2)}/item</span>
              </div>
              <div className="progress" style={{ height: '5px' }}>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="card-footer bg-transparent border-0 py-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Click to view details</span>
                <span className="text-success small fw-bold">On Track</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-4">Quick Stats</h5>
              <div className="row text-center">
                <div className="col-md-3 mb-3 mb-md-0">
                  <div className="p-3 rounded" style={{ backgroundColor: getStatCardBgColor(0) }}>
                    <h3 className="mb-1">87%</h3>
                    <p className="text-muted mb-0">Inventory Accuracy</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <div className="p-3 rounded" style={{ backgroundColor: getStatCardBgColor(1) }}>
                    <h3 className="mb-1">24</h3>
                    <p className="text-muted mb-0">Requisitions This Month</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <div className="p-3 rounded" style={{ backgroundColor: getStatCardBgColor(2) }}>
                    <h3 className="mb-1">96%</h3>
                    <p className="text-muted mb-0">Fulfillment Rate</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 rounded" style={{ backgroundColor: getStatCardBgColor(3) }}>
                    <h3 className="mb-1">1.8</h3>
                    <p className="text-muted mb-0">Days Lead Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drill-down Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between mb-3">
                  <div className="d-flex">
                    <div className="input-group me-2" style={{ width: '300px' }}>
                      <span className="input-group-text"><FaSearch /></span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button className="btn btn-outline-secondary">
                      <FaFilter /> Filter
                    </button>
                  </div>
                  <div>
                    <button className="btn btn-outline-success me-2" onClick={handleExportCSV}>
                      <FaFileCsv /> CSV
                    </button>
                    <button className="btn btn-outline-danger" onClick={handleExportPDF}>
                      <FaFilePdf /> PDF
                    </button>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-light">
                      <tr>
                        {modalColumns.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((row) => (
                          <tr key={row.id}>
                            {Object.values(row).slice(1).map((value, idx) => (
                              <td key={idx}>
                                {typeof value === 'string' && (value.toLowerCase() === 'critical' || value.toLowerCase() === 'low' || value.toLowerCase() === 'pending') ? (
                                  <span className={`badge ${getStatusBadgeClass(value)}`}>{value}</span>
                                ) : (
                                  value
                                )}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={modalColumns.length} className="text-center py-3">
                            No matching records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop for modal */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityUserDashboard;