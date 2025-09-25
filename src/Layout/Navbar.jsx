import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaSearch, FaUserCircle, FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar navbar-expand px-3 py-2 d-flex justify-content-between align-items-center fixed-top"
      style={{
        backgroundColor: "#032d45", // 白色背景，更加专业
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // 柔和阴影
        borderBottom: "2px solid #0056b3", // 底部蓝色边框，呼应医院标志
      }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* Toggle Button - 修改了悬停效果，不再变红色 */}
        <button
          className="btn p-2"
          style={{
            backgroundColor: '', // 蓝色背景，呼应医院标志
            borderColor: '#0056b3',
            color: '#fff',
            borderRadius: '6px',
            border: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            // 悬停时变为更深的蓝色，而不是红色
            e.target.style.backgroundColor = '#004085'; // 更深的蓝色
            e.target.style.borderColor = '#004085';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.borderColor = '#0056b3';
          }}
          onClick={toggleSidebar}
        >
          <FaBars color="currentColor" />
        </button>
        
        {/* Hospital Logo and Name */}
        <div className="d-flex align-items-center">
          <img 
            src="https://z-cdn-media.chatglm.cn/files/66bb3f36-e65b-4442-aab0-6a826ab53306_F.%20Alpha%20and%20Omega%20Specialist%20Hospital%20-%20Logo.png?auth_key=1789021581-8f548ad4307144188343158c7bd08cd9-0-ea0930821c8278841ee2851f0bb4fe81"
            alt="F. Alpha and Omega Specialist Hospital"
            style={{ height: '40px', marginRight: '10px' }}
          />
          <div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#fff', // 蓝色，呼应医院标志
              letterSpacing: '-0.5px',
              fontFamily: "'Poppins', sans-serif",
              lineHeight: '1.2'
            }}>
              F. ALPHA AND OMEGA
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '800',
              color: '#e63946', // 红色，呼应医院标志
              fontFamily: "'Poppins', sans-serif",
            }}>
              SPECIALIST HOSPITAL
            </div>
          </div>
        </div>
      </div>
      

      
      {/* Notification and User */}
      <div className="d-flex align-items-center gap-3 position-relative">
        {/* Notification */}
        {/* <div className="position-relative">
          <FaBell size={18} style={{ color: '#fff' }} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
        </div> */}
        
        {/* User Profile */}
        <div className="dropdown" ref={dropdownRef}>
          <div
            className="d-flex align-items-center gap-2 cursor-pointer"
            role="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle size={24} style={{ color: '#fff' }} />
            <div className="d-none d-sm-block">
              <small className="mb-0" style={{ color: '#fff' }}>Welcome</small>
              <div className="fw-bold" style={{ color: '#fff' }}>Admin</div>
            </div>
          </div>
          {dropdownOpen && (
            <ul
              className="dropdown-menu show mt-2 shadow-sm"
              style={{
                position: 'absolute',
                right: 0,
                minWidth: '180px',
                maxWidth: 'calc(100vw - 30px)',
                zIndex: 1000,
                borderRadius: '8px',
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <li><a className="dropdown-item" href="#" style={{ color: '#0056b3' }}>Profile</a></li>
              <li><a className="dropdown-item" href="#" style={{ color: '#0056b3' }}>Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item text-danger" href="/">Logout</a></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;