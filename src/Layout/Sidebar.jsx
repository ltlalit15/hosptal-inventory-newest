import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faFileAlt,
  faGear,
  faChevronDown,
  faBoxes,
  faTruck,
  faChartLine,
  faArchive,
  faBuilding,
  faUserGear,
  faClipboardList,
  faWarehouse,
  faUserShield,
  faListAlt,
  faBell,
  faFileInvoice,
  faRotateLeft,     
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [userRole, setUserRole] = useState("Super Admin");
  
  // Load user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("userRole") || "Super Admin";
    setUserRole(role);
  }, []);
  
  const toggleMenu = (menuKey) => {
    setActiveMenu(activeMenu === menuKey ? null : menuKey);
  };
  
  const isActive = (path) => location.pathname === path;
  
  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) setCollapsed(true);
  };
  
  // Define menus for each role based on the provided images
  const allMenus = {
    "Super Admin": [
      {
        name: "Dashboard",
        icon: faChartBar,
        path: "/superadmin/dashboard",
      },
      {
        name: "Inventory",
        icon: faBoxes,
        path: "/superadmin/inventory",
      },
      {
        name: "Requisitions",
        icon: faClipboardList,
        path: "/superadmin/requisitions",
      },
      {
        name: "Dispatches",
        icon: faTruck,
        path: "/superadmin/dispatches",
      },
      {
        name: "Reports",
        icon: faChartLine,
        path: "/superadmin/reports",
      },
      {
        name: "Assets",
        icon: faArchive,
        path: "/superadmin/assets",
      },
      {
        name: "Facilities",
        icon: faBuilding,
        path: "/superadmin/facilities",
      },
      {
        name: "Users",
        icon: faUsers,
        path: "/superadmin/users",
      },
      {
        name: "Settings",
        icon: faGear,
        path: "/superadmin/settings",
      },
      {
        name: "Roles & Permissions",
        icon: faUserShield,
        path: "/superadmin/role"
      }
    ],

    "Warehouse Admin": [
      {
        name: "Dashboard",
        icon: faChartBar,
        path: "/warehouse/dashboard",
      },
      {
        name: "Inventory",
        icon: faWarehouse,
        path: "/warehouse/inventory",
      },
      {
        name: "Requisitions",
        icon: faClipboardList,
        path: "/warehouse/requisitions",
      },
      {
        name: "Dispatches",
        icon: faTruck,
        path: "/warehouse/dispatches",
      },
      {
        name: "Reports & Analytics",
        icon: faChartLine,
        path: "/warehouse/reports",
      },
      {
        name: " Returns & Recalls",
        icon: faRotateLeft,
        path: "/warehouse/returnsRecalls",
      },
      {
        name: "Assets",
        icon: faArchive,
        path: "/warehouse/assets",
      },
      {
        name: "Settings",
        icon: faGear,
        path: "/warehouse/settings",
      },
    ],

    "Facility Admin": [
      {
        name: "Dashboard",
        icon: faChartBar,
        path: "/facility/dashboard",
      },
      {
        name: "Facility Inventory",
        icon: faWarehouse,
        path: "/facility/facilityinventory"
      },
      {
        name: "Requisitions",
        icon: faClipboardList,
        path: "/facility/requisitions",
      },
       {
        name: "Assets",
        icon: faArchive,
        path: "/facility/assets",
      },

       {
        name: "Good Receipt",
        icon: faArchive,
        path: "/facility/goodreceipt",
      },

       {
        name: "Reports",
        icon: faChartLine,
        path: "/facility/reports",
      },
      {
        name: "Departments & Categories",
        icon: faBuilding,
        path: "/facility/departmentsCategories"
      },
      {
         name: "Users & Roles",
         icon: faUserShield,
         path: "/facility/usersRoles"
      },
     
     
      {
        name: "Users",
        icon: faUsers,
        path: "/facility/users",
      },
      {
        name: "Settings",
        icon: faGear,
        path: "/facility/settings",
      },
    ],

    "Facility User": [
      {
        name: "Dashboard",
        icon: faChartBar,
        path: "/user/dashboard",
      },
      {
        name: "Facility Inventory",
        icon:  faWarehouse,
        path: "/user/facilityInventory"
      },
      {
        name: "Requisitions",
        icon: faClipboardList,
        path: "/user/requisitions",
      },
      {
        name: "My Requests",
        icon: faListAlt,
        path: "/user/myRequests",
      },
      {
        name: "Receipts",
        icon: faFileInvoice,
        path: "/user/receipts",
      },
      {
        name: "Notification",
        icon: faBell,
        path: "/user/notification",
      },
    ],
  };

  const userMenus = allMenus[userRole] || allMenus["Super Admin"];
  
  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar">
       
        
        <ul className="menu">
          {userMenus.map((menu, index) => {
            // If no subItems → direct link
            if (!menu.subItems) {
              return (
                <li key={index} className="menu-item">
                  <div
                    className={`menu-link ${isActive(menu.path) ? "active" : ""}`}
                    onClick={() => handleNavigate(menu.path)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={menu.icon} className="menu-icon" />
                    {!collapsed && <span className="menu-text">{menu.name}</span>}
                  </div>
                </li>
              );
            }
            // If has subItems → show dropdown
            return (
              <li key={index} className="menu-item">
                <div
                  className="menu-link mb-2"
                  onClick={() => toggleMenu(menu.key)}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={menu.icon} className="menu-icon" />
                  {!collapsed && <span className="menu-text">{menu.name}</span>}
                  {!collapsed && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`arrow-icon ${activeMenu === menu.key ? "rotate" : ""}`}
                    />
                  )}
                </div>
                {/* Show submenu only if menu is active and not collapsed */}
                {!collapsed && activeMenu === menu.key && (
                  <ul className="submenu">
                    {menu.subItems.map((sub, subIndex) => (
                      <li
                        key={subIndex}
                        className={`submenu-item mb-2 ${isActive(sub.path) ? "active-sub" : ""}`}
                        onClick={() => handleNavigate(sub.path)}
                        style={{ cursor: "pointer" }}
                      >
                        {sub.label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;