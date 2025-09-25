import React, { useState, useEffect } from 'react';
import { FaSearch, FaFileCsv, FaFilePdf, FaFilter, FaBox, FaBarcode, FaHourglassHalf, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacilityUserInventory = () => {
  // State for inventory data
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would come from an API
    const mockData = [
      {
        id: 1,
        itemName: 'Paracetamol 500mg',
        batch: 'B789',
        lot: 'L456',
        expiryDate: '2024-06-15',
        balance: 85,
      },
      {
        id: 2,
        itemName: 'Amoxicillin 500mg',
        batch: 'B234',
        lot: 'L789',
        expiryDate: '2024-05-20',
        balance: 120,
      },
      {
        id: 3,
        itemName: 'Surgical Gloves',
        batch: 'B567',
        lot: 'L123',
        expiryDate: '2025-01-10',
        balance: 0,
      },
      {
        id: 4,
        itemName: 'Insulin Pens',
        batch: 'B901',
        lot: 'L345',
        expiryDate: '2024-03-05',
        balance: 15,
      },
      {
        id: 5,
        itemName: 'Antiseptic Solution',
        batch: 'B678',
        lot: 'L567',
        expiryDate: '2024-12-01',
        balance: 0,
      },
      {
        id: 6,
        itemName: 'Vitamin C Tablets',
        batch: 'B345',
        lot: 'L890',
        expiryDate: '2024-09-15',
        balance: 60,
      },
      {
        id: 7,
        itemName: 'Blood Pressure Cuffs',
        batch: 'B012',
        lot: 'L234',
        expiryDate: '2025-06-30',
        balance: 3,
      },
      {
        id: 8,
        itemName: 'Alcohol Swabs',
        batch: 'B456',
        lot: 'L678',
        expiryDate: '2024-11-20',
        balance: 0,
      }
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setInventoryData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredData(inventoryData);
    } else {
      const filtered = inventoryData.filter(item => 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lot.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, inventoryData]);

  // Handle CSV export
  const handleExportCSV = () => {
    alert('Exporting data to CSV');
  };

  // Handle PDF export
  const handleExportPDF = () => {
    alert('Exporting data to PDF');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get expiry status
  const getExpiryStatus = (days) => {
    if (days < 0) return { text: 'Expired', class: 'text-danger' };
    if (days <= 30) return { text: 'Expiring Soon', class: 'text-warning' };
    if (days <= 90) return { text: 'Near Expiry', class: 'text-info' };
    return { text: 'Good', class: 'text-success' };
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header Section - Responsive */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1">Personal Inventory View</h2>
          <p className="text-muted mb-0">Items requested/received in the last 90 days</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <div className="text-muted small">Department: Pharmacy</div>
            <div>User: Dr. Sharma</div>
          </div>
          <div className="bg-light rounded-circle p-2 flex-shrink-0">
            <FaBox size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Summary Cards - Responsive */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#e8f5e9' }}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center justify-content-center">
                <div className="me-3">
                  <div className="bg-white bg-opacity-50 p-2 rounded-circle">
                    <FaBox size={20} className="text-primary" />
                  </div>
                </div>
                <div>
                  <h6 className="card-subtitle text-muted">Total Items</h6>
                  <h5 className="mb-0">{inventoryData.length}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#ffebee' }}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center justify-content-center">
                <div className="me-3">
                  <div className="bg-white bg-opacity-50 p-2 rounded-circle">
                    <FaHourglassHalf size={20} className="text-danger" />
                  </div>
                </div>
                <div>
                  <h6 className="card-subtitle text-muted">Expiring Soon</h6>
                  <h5 className="mb-0">
                    {inventoryData.filter(item => getDaysUntilExpiry(item.expiryDate) <= 30).length}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#e1f5fe' }}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center justify-content-center">
                <div className="me-3">
                  <div className="bg-white bg-opacity-50 p-2 rounded-circle">
                    <FaBox size={20} className="text-success" />
                  </div>
                </div>
                <div>
                  <h6 className="card-subtitle text-muted">Available Items</h6>
                  <h5 className="mb-0">{inventoryData.filter(item => item.balance > 0).length}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#fff8e1' }}>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="d-flex align-items-center justify-content-center">
                <div className="me-3">
                  <div className="bg-white bg-opacity-50 p-2 rounded-circle">
                    <FaBox size={20} className="text-warning" />
                  </div>
                </div>
                <div>
                  <h6 className="card-subtitle text-muted">Out of Stock</h6>
                  <h5 className="mb-0">{inventoryData.filter(item => item.balance === 0).length}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar - Responsive */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="flex-column flex-md-row d-flex justify-content-between align-items-md-center gap-3">
            <div className="d-flex flex-column flex-md-row gap-2 w-100">
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text"><FaSearch /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search by item name, batch, or lot..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-outline-secondary flex-shrink-0">
                <FaFilter /> Filter
              </button>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              <button className="btn btn-outline-success" onClick={handleExportCSV}>
                <FaFileCsv /> CSV
              </button>
              <button className="btn btn-outline-danger" onClick={handleExportPDF}>
                <FaFilePdf /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table - Responsive */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading inventory data...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Available Qty</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
                      const expiryStatus = getExpiryStatus(daysUntilExpiry);
                      const isOutOfStock = item.balance === 0;
                      
                      return (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                <FaBox className="text-muted" />
                              </div>
                              <div>
                                <div>{item.itemName}</div>
                                <small className="text-muted">
                                  Batch: {item.batch} | Lot: {item.lot}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaBarcode className="text-muted me-2" />
                              {item.balance} units
                            </div>
                          </td>
                          <td>
                            <div>
                              {isOutOfStock ? (
                                <span className="badge bg-danger">Out of Stock</span>
                              ) : (
                                <span className="badge bg-success">In Stock</span>
                              )}
                              <div className={`mt-2 ${expiryStatus.class}`}>
                                <FaExclamationTriangle className="me-1" />
                                {expiryStatus.text} ({daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : `${Math.abs(daysUntilExpiry)} days ago`})
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        <div className="text-muted">
                          <FaBox size={24} className="mb-2" />
                          <p>No inventory items found matching your search criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* About Personal Inventory View Section - Responsive */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header text-black">
          <h5 className="mb-0 d-flex align-items-center">
            <FaInfoCircle className="me-2" /> About Personal Inventory View
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            {/* Item Details Section */}
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <FaBox size={24} className="text-primary" />
                    </div>
                    <h5 className="card-title mb-0">Item Details</h5>
                  </div>
                  <p className="card-text">
                    This view shows all items you have requested or received in the last 90 days. 
                    Each item displays batch and lot numbers for traceability.
                  </p>
                  
                  <div className="mt-4">
                    <h6 className="text-muted">Key Features:</h6>
                    <ul className="list-unstyled">
                      <li className="d-flex align-items-center mb-2">
                        <FaSearch className="text-primary me-2 flex-shrink-0" />
                        <span>Search by item name, batch, or lot</span>
                      </li>
                      <li className="d-flex align-items-center mb-2">
                        <FaBox className="text-primary me-2 flex-shrink-0" />
                        <span>Current available quantity tracking</span>
                      </li>
                      <li className="d-flex align-items-center">
                        <FaExclamationTriangle className="text-primary me-2 flex-shrink-0" />
                        <span>Expiry alerts with color-coded status</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expiry Tracking Section */}
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                      <FaHourglassHalf size={24} className="text-warning" />
                    </div>
                    <h5 className="card-title mb-0">Expiry Tracking</h5>
                  </div>
                  <p className="card-text">
                    Expiry dates are monitored with color-coded alerts. Items expiring within 30 days are highlighted for immediate attention, 
                    while those within 90 days show as near expiry.
                  </p>
                  
                  <div className="mt-4">
                    <h6 className="text-muted">Alert Levels:</h6>
                    <div className="d-flex align-items-center mb-3 p-2 bg-white rounded">
                      <div className="bg-danger bg-opacity-10 p-2 rounded me-3">
                        <FaExclamationTriangle className="text-danger" />
                      </div>
                      <div>
                        <strong className="text-danger">Expired</strong>
                        <p className="mb-0 small text-muted">Items that have already passed their expiry date</p>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center mb-3 p-2 bg-white rounded">
                      <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                        <FaExclamationTriangle className="text-warning" />
                      </div>
                      <div>
                        <strong className="text-warning">Expiring Soon (≤ 30 days)</strong>
                        <p className="mb-0 small text-muted">Requires immediate attention and action</p>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center p-2 bg-white rounded">
                      <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                        <FaExclamationTriangle className="text-info" />
                      </div>
                      <div>
                        <strong className="text-info">Near Expiry (≤ 90 days)</strong>
                        <p className="mb-0 small text-muted">Plan usage or return to avoid wastage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button className="btn btn-primary">
              <FaInfoCircle className="me-2" /> Learn More About Inventory Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityUserInventory;