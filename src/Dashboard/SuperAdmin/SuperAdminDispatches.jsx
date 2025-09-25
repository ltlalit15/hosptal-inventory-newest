import React, { useState } from 'react';
import {
  FaPlus, FaSearch, FaEye, FaCheck, FaTruckLoading, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUser
} from 'react-icons/fa';

const SuperAdminDispatches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentDispatch, setCurrentDispatch] = useState(null);

  const [newDispatch, setNewDispatch] = useState({
    facility: '',
    items: '',
    dispatchedBy: '',
    estimatedDelivery: '',
    notes: ''
  });

  // Mock data — now includes items as array for accurate display
  const [dispatches, setDispatches] = useState([
    {
      id: '#DSP-0102',
      facility: 'Kumasi Branch Hospital',
      items: [
        { name: 'Paracetamol 500mg', quantity: 100, unit: 'Tablets' },
        { name: 'Surgical Gloves', quantity: 50, unit: 'Pairs' },
        { name: 'Syringe 5ml', quantity: 200, unit: 'Pieces' }
      ],
      dispatchedBy: 'Warehouse Admin',
      date: '23 Oct 2023',
      status: 'Delivered',
      estimatedDelivery: '24 Oct 2023',
      deliveryAddress: '123 Hospital Road, Kumasi',
      trackingNumber: 'TRK-2023-0015',
      notes: 'Urgent delivery for emergency ward'
    },
    {
      id: '#DSP-0101',
      facility: 'Accra Central Hospital',
      items: [
        { name: 'Amoxicillin 250mg', quantity: 50, unit: 'Capsules' },
        { name: 'Bandages', quantity: 30, unit: 'Pieces' }
      ],
      dispatchedBy: 'Warehouse Admin',
      date: '22 Oct 2023',
      status: 'In Transit',
      estimatedDelivery: '23 Oct 2023',
      deliveryAddress: '456 Main Street, Accra',
      trackingNumber: 'TRK-2023-0014',
      notes: 'Routine supply for pharmacy department'
    },
  ]);

  const StatusBadge = ({ status }) => {
    const map = {
      Delivered: 'bg-success',
      'In Transit': 'bg-warning text-dark',
      Processing: 'bg-info text-dark',
      Cancelled: 'bg-danger'
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  const openCreateModal = () => {
    setNewDispatch({ facility: '', items: '', dispatchedBy: '', estimatedDelivery: '', notes: '' });
    setShowCreateModal(true);
  };

  const openViewModal = (d) => {
    setCurrentDispatch(d);
    setShowViewModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDispatch(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateDispatch = () => {
    const newItem = {
      id: `#DSP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      facility: newDispatch.facility,
      items: [], // In real app, you'd parse this properly
      dispatchedBy: newDispatch.dispatchedBy,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Processing',
      estimatedDelivery: newDispatch.estimatedDelivery,
      deliveryAddress: '',
      trackingNumber: `TRK-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      notes: newDispatch.notes
    };
    setDispatches([newItem, ...dispatches]);
    setShowCreateModal(false);
  };

  const filtered = dispatches.filter(d => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      d.id.toLowerCase().includes(q) ||
      d.facility.toLowerCase().includes(q) ||
      d.dispatchedBy.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q) ||
      d.items.some(item => item.name.toLowerCase().includes(q))
    );
  });

  // Helper to get total quantity
  const getTotalQty = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Helper to get first few item names (for table display)
  const getItemsPreview = (items) => {
    if (items.length === 0) return '—';
    const names = items.map(i => i.name);
    return names.length > 2 ? `${names[0]}, ${names[1]} +${names.length - 2}` : names.join(', ');
  };

  return (
    <div className="container-fluid py-3">
{/* Toolbar */}
<div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
  <h2 className="fw-bold mb-0">Dispatches</h2>

  {/* Search + Button Group */}

    {/* Compact Search */}
    <div className="input-group" style={{ maxWidth: '300px' }}>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Search dispatches..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search dispatches"
      />
      <button className="btn btn-outline-secondary btn-sm" type="button" aria-label="Search">
        <FaSearch />
      </button>
    </div>


</div>

      {/* Stats Cards */}
      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaCheck className="text-success fs-3" />
              </div>
              <div className="fw-bold text-success fs-4">24</div>
              <div className="text-muted small">Total Dispatches</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTruckLoading className="text-warning fs-3" />
              </div>
              <div className="fw-bold text-warning fs-4">5</div>
              <div className="text-muted small">In Transit</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaCheck className="text-info fs-3" />
              </div>
              <div className="fw-bold text-info fs-4">19</div>
              <div className="text-muted small">Delivered</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaPlus className="text-primary fs-3" />
              </div>
              <div className="fw-bold text-primary fs-4">3</div>
              <div className="text-muted small">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Dispatches */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Recent Dispatches</h5>
        </div>

        {/* TABLE (md and up) */}
        <div className="card-body p-0 d-none d-md-block">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Dispatch ID</th>
                  <th>Facility</th>
                  <th>Items</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((dispatch, index) => (
                  <tr key={dispatch.id || index}>
                    <td className="fw-bold">{dispatch.id}</td>
                    <td>{dispatch.facility}</td>
                    <td>{getItemsPreview(dispatch.items)}</td>
                    <td>{getTotalQty(dispatch.items)}</td>
                    <td><StatusBadge status={dispatch.status} /></td>
                    <td>{dispatch.date}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openViewModal(dispatch)}
                      >
                        <FaEye className="me-1" /> View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD LIST (xs) */}
        <div className="card-body d-block d-md-none">
          <div className="row g-2">
            {filtered.map((d, i) => (
              <div className="col-12" key={d.id || i}>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold">{d.id}</span>
                      <StatusBadge status={d.status} />
                    </div>

                    <div className="row g-2 small">
                      <div className="col-12">
                        <div className="text-muted">Facility</div>
                        <div>{d.facility}</div>
                      </div>
                      <div className="col-12">
                        <div className="text-muted">Items</div>
                        <div>{getItemsPreview(d.items)}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Qty</div>
                        <div>{getTotalQty(d.items)}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Date</div>
                        <div>{d.date}</div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-outline-primary w-100 btn-sm"
                        onClick={() => openViewModal(d)}
                      >
                        <FaEye className="me-1" /> View Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light border text-center mb-0">No dispatches found.</div>
              </div>
            )}
          </div>
        </div>
      </div>

  

      {/* View Detail Modal */}
      {showViewModal && currentDispatch && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Dispatch Details: {currentDispatch.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-2">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="text-primary me-2" />
                      <p className="mb-0"><strong>To Facility:</strong> {currentDispatch.facility}</p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaUser className="text-primary me-2" />
                      <p className="mb-0"><strong>Dispatched By:</strong> {currentDispatch.dispatchedBy}</p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaCalendarAlt className="text-primary me-2" />
                      <p className="mb-0"><strong>Dispatch Date:</strong> {currentDispatch.date}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="mb-1"><strong>Tracking Number:</strong> {currentDispatch.trackingNumber}</p>
                    <p className="mb-1"><strong>Estimated Delivery:</strong> {currentDispatch.estimatedDelivery}</p>
                    <p className="mb-1"><strong>Status:</strong> <StatusBadge status={currentDispatch.status} /></p>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="mb-2">Delivery Address:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentDispatch.deliveryAddress || '—'}
                    </div>
                  </div>
                </div>

                <h6 className="mt-4 mb-2">Items Dispatched:</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDispatch.items.length > 0 ? (
                        currentDispatch.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="3" className="text-center">No items listed</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <h6 className="mb-2">Notes:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentDispatch.notes || '—'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showCreateModal || showViewModal) && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default SuperAdminDispatches;