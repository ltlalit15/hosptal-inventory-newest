
// src/components/FacilityDashboard.jsx
import React, { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { 
  FaClipboardList, 
  FaExclamationTriangle, 
  FaBoxOpen, 
  FaPlus, 
  FaSearch,
  FaBell,
  FaUser,
  FaQuestionCircle,
  FaCheck,
  FaTimes,
  FaEye,
  FaEdit
} from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const UserDashboard = () => {
  // State for active menu
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // State for quick requisition form
  const [quickRequisition, setQuickRequisition] = useState({
    itemName: '',
    quantity: '',
    estimatedDuration: '',
    notes: ''
  });

  // Mock data for dashboard widgets
  const dashboardData = {
    pendingApprovals: 8,
    rejectedWithNotes: 3,
    itemsIssuedThisMonth: 142
  };

  // Mock data for pending approvals
  const pendingApprovals = [
    { id: 'REQ-001', item: 'Surgical Masks', quantity: 200, requestedBy: 'Dr. Smith', date: '2023-05-15' },
    { id: 'REQ-002', item: 'Gloves', quantity: 500, requestedBy: 'Nurse Johnson', date: '2023-05-14' },
    { id: 'REQ-003', item: 'Syringes', quantity: 300, requestedBy: 'Dr. Williams', date: '2023-05-13' },
    { id: 'REQ-004', item: 'Alcohol Swabs', quantity: 1000, requestedBy: 'Nurse Davis', date: '2023-05-12' },
    { id: 'REQ-005', item: 'Bandages', quantity: 150, requestedBy: 'Dr. Brown', date: '2023-05-11' },
  ];

  // Mock data for last 5 requests
  const lastRequests = [
    { id: 'REQ-010', item: 'Face Shields', quantity: 50, status: 'Approved', date: '2023-05-10' },
    { id: 'REQ-009', item: 'Sanitizers', quantity: 100, status: 'Rejected', date: '2023-05-09', notes: 'Budget exceeded' },
    { id: 'REQ-008', item: 'Thermometers', quantity: 20, status: 'Partially Approved', date: '2023-05-08', notes: 'Approved 15 only' },
    { id: 'REQ-007', item: 'Gowns', quantity: 80, status: 'Approved', date: '2023-05-07' },
    { id: 'REQ-006', item: 'Masks', quantity: 500, status: 'Approved', date: '2023-05-06' },
  ];

  // Data for charts
  const itemsIssuedData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Items Issued',
        data: [35, 42, 28, 37],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const requestStatusData = {
    labels: ['Approved', 'Rejected', 'Pending', 'Partially Approved'],
    datasets: [
      {
        label: 'Request Status',
        data: [24, 8, 12, 6],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 205, 86)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Items Requested',
        data: [120, 135, 110, 145, 142],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Items Approved',
        data: [100, 115, 95, 125, 120],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuickRequisition({
      ...quickRequisition,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the data to the backend
    alert(`Quick requisition submitted for ${quickRequisition.itemName}`);
    setQuickRequisition({
      itemName: '',
      quantity: '',
      estimatedDuration: '',
      notes: ''
    });
  };

  // Render the active content based on menu selection
  const renderContent = () => {
    switch(activeMenu) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">Facility User Dashboard</h2>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm d-flex align-items-center">
                  <i className="bi bi-download me-1"></i> Export
                </button>
              
              </div>
            </div>

            {/* Dashboard Widgets */}
            <div className="row mb-4">
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="text-muted mb-2">Pending Approvals</h6>
                        <h3 className="text-primary mb-2">{dashboardData.pendingApprovals}</h3>
                        <span className="badge bg-warning rounded-pill">Action Required</span>
                      </div>
                      <div className="p-3 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
                        <FaClipboardList className="text-primary fs-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="text-muted mb-2">Rejected with Notes</h6>
                        <h3 className="text-danger mb-2">{dashboardData.rejectedWithNotes}</h3>
                        <span className="badge bg-danger rounded-pill">Review Needed</span>
                      </div>
                      <div className="p-3 rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center">
                        <FaExclamationTriangle className="text-danger fs-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-6 mb-3">
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="text-muted mb-2">Items Issued This Month</h6>
                        <h3 className="text-success mb-2">{dashboardData.itemsIssuedThisMonth}</h3>
                        <span className="badge bg-success rounded-pill">+12% from last month</span>
                      </div>
                      <div className="p-3 rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center">
                        <FaBoxOpen className="text-success fs-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="row mb-4">
              <div className="col-lg-6 mb-4">
                <div className="card h-100 border-0 shadow-sm chart-card">
                  <div className="card-header bg-white border-0 pt-4 pb-2">
                    <h5 className="mb-0 fw-semibold">Items Issued (Weekly)</h5>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ height: '250px' }}>
                      <Bar data={itemsIssuedData} options={barChartOptions} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 mb-4">
                <div className="card h-100 border-0 shadow-sm chart-card">
                  <div className="card-header bg-white border-0 pt-4 pb-2">
                    <h5 className="mb-0 fw-semibold">Request Status Distribution</h5>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ height: '250px' }}>
                      <Pie data={requestStatusData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12">
                <div className="card h-100 border-0 shadow-sm chart-card">
                  <div className="card-header bg-white border-0 pt-4 pb-2">
                    <h5 className="mb-0 fw-semibold">Monthly Request Trends</h5>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ height: '250px' }}>
                      <Line data={monthlyTrendData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Pending Approvals */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">My Pending Approvals</h5>
                <button className="btn btn-sm btn-outline-primary">View All</button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Requested By</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApprovals.map((approval) => (
                        <tr key={approval.id}>
                          <td className="fw-medium">{approval.id}</td>
                          <td>{approval.item}</td>
                          <td>{approval.quantity}</td>
                          <td>{approval.requestedBy}</td>
                          <td>{approval.date}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-success">
                                <FaCheck />
                              </button>
                              <button className="btn btn-sm btn-danger">
                                <FaTimes />
                              </button>
                              <button className="btn btn-sm btn-outline-primary">
                                <FaEye />
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

            {/* Last 5 Requests */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 pt-4 pb-2 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Last 5 Requests</h5>
                <button className="btn btn-sm btn-outline-primary">View All</button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="fw-medium">{request.id}</td>
                          <td>{request.item}</td>
                          <td>{request.quantity}</td>
                          <td>
                            <span className={`badge rounded-pill ${
                              request.status === 'Approved' ? 'bg-success' : 
                              request.status === 'Rejected' ? 'bg-danger' : 
                              request.status === 'Partially Approved' ? 'bg-warning' : 'bg-info'
                            }`}>
                              {request.status}
                            </span>
                            {request.notes && (
                              <small className="text-muted d-block">{request.notes}</small>
                            )}
                          </td>
                          <td>{request.date}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

       
           
          </div>
        );
      
      case 'makeRequisition':
        return (
          <div className="requisition-content p-4">
            <h2 className="mb-4">Make Requisition</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Requester Name</label>
                      <input type="text" className="form-control" defaultValue="Dr. John Smith" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Department</label>
                      <select className="form-select">
                        <option>Emergency</option>
                        <option>Cardiology</option>
                        <option>Pediatrics</option>
                        <option>Pharmacy</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Items</label>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Urgency</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input type="text" className="form-control" placeholder="Item name" />
                            </td>
                            <td>
                              <input type="number" className="form-control" placeholder="Qty" />
                            </td>
                            <td>
                              <select className="form-select">
                                <option>Pieces</option>
                                <option>Boxes</option>
                                <option>Packs</option>
                              </select>
                            </td>
                            <td>
                              <select className="form-select">
                                <option>Normal</option>
                                <option>Urgent</option>
                                <option>Critical</option>
                              </select>
                            </td>
                            <td>
                              <button type="button" className="btn btn-sm btn-danger">
                                <FaTimes />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-primary mt-2">
                      <FaPlus className="me-1" /> Add Item
                    </button>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Estimated Duration</label>
                      <input type="text" className="form-control" placeholder="e.g., 1 week" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date/Time</label>
                      <input type="datetime-local" className="form-control" />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Additional Notes</label>
                    <textarea className="form-control" rows="3"></textarea>
                  </div>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary">Save as Draft</button>
                    <button type="submit" className="btn btn-primary">Submit Requisition</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      
      case 'myRequests':
        return (
          <div className="requests-content p-4">
            <h2 className="mb-4">My Requests</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Status</th>
                        <th>Timeline</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="fw-medium">{request.id}</td>
                          <td>{request.date}</td>
                          <td>{request.item}</td>
                          <td>
                            <span className={`badge rounded-pill ${
                              request.status === 'Approved' ? 'bg-success' : 
                              request.status === 'Rejected' ? 'bg-danger' : 
                              request.status === 'Partially Approved' ? 'bg-warning' : 'bg-info'
                            }`}>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '5px' }}>
                                <div 
                                  className={`progress-bar ${
                                    request.status === 'Approved' ? 'bg-success' : 
                                    request.status === 'Rejected' ? 'bg-danger' : 
                                    request.status === 'Partially Approved' ? 'bg-warning' : 'bg-info'
                                  }`} 
                                  role="progressbar" 
                                  style={{ width: 
                                    request.status === 'Approved' ? '100%' : 
                                    request.status === 'Rejected' ? '100%' : 
                                    request.status === 'Partially Approved' ? '75%' : '50%'
                                  }}
                                ></div>
                              </div>
                              <small>
                                {request.status === 'Approved' ? 'Completed' : 
                                 request.status === 'Rejected' ? 'Rejected' : 
                                 request.status === 'Partially Approved' ? 'In Progress' : 'Pending'}
                              </small>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'facilityInventory':
        return (
          <div className="inventory-content p-4">
            <h2 className="mb-4">Facility Inventory</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text"><FaSearch /></span>
                      <input type="text" className="form-control" placeholder="Search inventory..." />
                    </div>
                  </div>
                  <div className="col-md-6 text-end">
                    <button className="btn btn-outline-secondary btn-sm">
                      <i className="bi bi-filter me-1"></i> Filter
                    </button>
                    <button className="btn btn-outline-secondary btn-sm ms-2">
                      <i className="bi bi-download me-1"></i> Export
                    </button>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Available Stock</th>
                        <th>Unit</th>
                        <th>Last Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ITM-001</td>
                        <td>Surgical Masks</td>
                        <td>PPE</td>
                        <td>1200</td>
                        <td>Pieces</td>
                        <td>2023-05-15</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>ITM-002</td>
                        <td>Gloves</td>
                        <td>PPE</td>
                        <td>850</td>
                        <td>Pairs</td>
                        <td>2023-05-14</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>ITM-003</td>
                        <td>Syringes</td>
                        <td>Medical Supplies</td>
                        <td>420</td>
                        <td>Pieces</td>
                        <td>2023-05-13</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>ITM-004</td>
                        <td>Alcohol Swabs</td>
                        <td>Medical Supplies</td>
                        <td>2100</td>
                        <td>Pieces</td>
                        <td>2023-05-12</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>ITM-005</td>
                        <td>Bandages</td>
                        <td>Medical Supplies</td>
                        <td>350</td>
                        <td>Pieces</td>
                        <td>2023-05-11</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" tabIndex="-1">Previous</a>
                    </li>
                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                      <a className="page-link" href="#">Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="notifications-content p-4">
            <h2 className="mb-4">Notifications</h2>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="list-group">
                  <div className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">Requisition Approved</h5>
                      <small className="text-muted">2 hours ago</small>
                    </div>
                    <p className="mb-1">Your requisition REQ-010 for Face Shields has been approved.</p>
                    <small>View details</small>
                  </div>
                  
                  <div className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">Partial Approval</h5>
                      <small className="text-muted">Yesterday</small>
                    </div>
                    <p className="mb-1">Your requisition REQ-008 for Thermometers has been partially approved. Note: Only 15 items approved due to budget constraints.</p>
                    <small>View details</small>
                  </div>
                  
                  <div className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">Pick-up Information</h5>
                      <small className="text-muted">2 days ago</small>
                    </div>
                    <p className="mb-1">Your approved items are ready for pick-up at the central warehouse. Please bring your ID.</p>
                    <small>View details</small>
                  </div>
                  
                  <div className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">Requisition Rejected</h5>
                      <small className="text-muted">3 days ago</small>
                    </div>
                    <p className="mb-1">Your requisition REQ-009 for Sanitizers has been rejected. Note: Budget exceeded for this quarter.</p>
                    <small>View details</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profileHelp':
        return (
          <div className="profile-help-content p-4">
            <div className="row">
              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">My Profile</h5>
                  </div>
                  <div className="card-body">
                    <div className="text-center mb-3">
                      <div className="avatar-placeholder mx-auto mb-3">
                        <FaUser className="fs-1" />
                      </div>
                      <h5>Dr. John Smith</h5>
                      <p className="text-muted">Emergency Department</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" defaultValue="john.smith@hospital.com" />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input type="tel" className="form-control" defaultValue="+1 (555) 123-4567" />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Department</label>
                      <input type="text" className="form-control" defaultValue="Emergency" />
                    </div>
                    
                    <button className="btn btn-primary w-100">Update Profile</button>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Training Guides</h5>
                  </div>
                  <div className="card-body">
                    <div className="list-group">
                      <div className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">How to Make a Requisition</h5>
                          <small className="text-muted">PDF</small>
                        </div>
                        <p className="mb-1">Step-by-step guide on creating and submitting requisitions.</p>
                      </div>
                      
                      <div className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">Inventory Management</h5>
                          <small className="text-muted">Video</small>
                        </div>
                        <p className="mb-1">Learn how to check facility inventory and stock levels.</p>
                      </div>
                      
                      <div className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">Understanding Approval Process</h5>
                          <small className="text-muted">PDF</small>
                        </div>
                        <p className="mb-1">Overview of the requisition approval workflow.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Frequently Asked Questions</h5>
                  </div>
                  <div className="card-body">
                    <div className="accordion" id="faqAccordion">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                            How long does it take for a requisition to be approved?
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            Standard requisitions are typically approved within 24-48 hours. Urgent requisitions may be approved within 4-6 hours.
                          </div>
                        </div>
                      </div>
                      
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                            What should I do if my requisition is rejected?
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            If your requisition is rejected, you will receive a notification with the reason. You can modify and resubmit the requisition or contact the warehouse manager for clarification.
                          </div>
                        </div>
                      </div>
                      
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                            How do I check the status of my requisition?
                          </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            You can check the status of your requisitions in the "My Requests" section of the dashboard. The status will be updated in real-time as it progresses through the approval process.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="facility-dashboard">
      {/* Top Navigation */}
      

      {/* Main Content */}
      <div className="main-content">
        {renderContent()}
      </div>

      <style jsx>{`
        .facility-dashboard {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .main-content {
          flex: 1;
          background-color: #f8f9fa;
        }
        
        .hover-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .chart-card {
          transition: all 0.3s ease;
        }
        
        .chart-card:hover {
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .chart-container {
          position: relative;
          height: 100%;
        }
        
        .avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }
        
        .navbar .nav-link {
          color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 4px;
          margin: 0 2px;
        }
        
        .navbar .nav-link:hover {
          color: white !important;
        }
        
        .navbar .nav-link.active {
          background-color: rgba(255, 255, 255, 0.2);
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;