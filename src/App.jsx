import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import * as echarts from "echarts";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // optional, for full Bootstrap features



import Navbar from "./Layout/Navbar";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import Sidebar from "./Layout/Sidebar";
import Profile from "./Profile/Profile"
import SuperAdminDashboard from "./Dashboard/SuperAdmin/SuperAdminDashboard";
// import InventoryManagement from "./Dashboard/SuperAdmin/InventoryManagement"
import SuperAdminAssets from "./Dashboard/SuperAdmin/SuperAdminAssets"
import SuperAdminUsers from "./Dashboard/SuperAdmin/SuperAdminUsers"
import SuperAdminSettings from "./Dashboard/SuperAdmin/SuperAdminSettings"
import SuperAdminRequisitions from "./Dashboard/SuperAdmin/SuperAdminRequisitions"
import SuperAdminReports from "./Dashboard/SuperAdmin/SuperAdminReports"
import SuperAdminFacilities from "./Dashboard/SuperAdmin/SuperAdminFacilities"
import SuperAdminDispatches from "./Dashboard/SuperAdmin/SuperAdminDispatches"
import SuperAdminInventory from "./Dashboard/SuperAdmin/SuperAdminInventory";
import WarehouseDashbaord from "./Dashboard/Warehouse/WarehouseDashbaord";
import AdminInventory from "./Dashboard/Warehouse/WarehouseInventory";
import WarehouseInventory from "./Dashboard/Warehouse/WarehouseInventory";
import WareHouseAssets from "./Dashboard/Warehouse/WareHouseAssets";
import WarehouseReports from "./Dashboard/Warehouse/WarehouseReports";
import WarehouseDispatches from "./Dashboard/Warehouse/WarehouseDispatches";
import WarehouseSettings from "./Dashboard/Warehouse/WarehouseSettings";
import WarehouseRequisitions from "./Dashboard/Warehouse/WarehouseRequisitions";
import SuperAdminRoles from "./Dashboard/SuperAdmin/SuperAdminRoles"


import UserDashboard from "./User/UserDashboard";
import UserRequisitions from "./User/UserRequisitions";
import FacilityDashboard from "./Facility/FacilityDashboard";
import FacilityRequisitions from "./Facility/FacilityRequisitions";
import FacilityReports from "./Facility/FacilityReports";
import GoodReceipt from "./Facility/GoodReceipt";
import FacilityAssets from "./Facility/FacilityAssets";
import FacilityUser from "./Facility/FaciltyUser";
import FacilitySettings from "./Facility/FacilitySettings";
import FacilityInventory from "./Facility/FacilityInventory";
import FacilityDepartmentsCategories from "./Facility/FacilityDepartmentsCategories";
import FacilityUsersRoles from "./Facility/FacilityUsersRoles";
import FacilityUserMyRequests from "./Dashboard/FacilityUser/FacilityUserMyRequests";
import FacilityUserNotifications from "./Dashboard/FacilityUser/FacilityUserNotifications";
import FacilityUserInventory from "./Dashboard/FacilityUser/FacilityUserInventory";
import FacilityUserRequisition from "./Dashboard/FacilityUser/FacilityUserRequisition"
import FacilityUserDashboard from "./Dashboard/FacilityUser/FacilityUserDashboard"
import AcknowledgementOfReceipts from "./Dashboard/FacilityUser/AcknowledgementOfReceipts"
import ReturnsRecalls from "./Dashboard/WareHouse/ReturnsRecalls"


function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => window.innerWidth <= 768;
    if (checkIfMobile()) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const location = useLocation();

  const hideLayout =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {hideLayout ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      ) : (
        <>
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="main-content">
            <Sidebar
              collapsed={isSidebarCollapsed}
              setCollapsed={setIsSidebarCollapsed}
            />
            <div
              className={`right-side-content ${
                isSidebarCollapsed ? "collapsed" : ""
              }`}
            >
              
              <Routes>

                 <Route path="/facility-admin/dashboard" element= {<FacilityDashboard/>}/>'
                <Route path="/facility/dashboard" element= {<FacilityDashboard/>}/>'
                <Route path="/facility/requisitions" element={<FacilityRequisitions/>}/>'
                <Route path="/facility/reports" element={<FacilityReports/>}/>'
                <Route path="/facility/assets" element={<FacilityAssets/>}/>'
                <Route path="/Facility/users" element={<FacilityUser/>}/>'
                <Route path="/facility/settings" element={<FacilitySettings />}/>'
                <Route path="/facility/facilityinventory" element={<FacilityInventory/>}/>'
                <Route path="/facility/departmentsCategories" element={<FacilityDepartmentsCategories/>}/>'
                <Route path="/facility/usersRoles" element={<FacilityUsersRoles/>}/>'
                  <Route path="/facility/goodreceipt" element={<GoodReceipt/>}/>'

              <Route path="/profile" element={<Profile/>}/>

              {/* SuperAdmin */}
              <Route path="/superadmin/dashboard"element={<SuperAdminDashboard/>}/>
              <Route path="/superadmin/inventory"element={<SuperAdminInventory/>}/>
               <Route path="/superadmin/dispatches"element={<SuperAdminDispatches/>}/>
               <Route path="/superadmin/facilities"element={<SuperAdminFacilities/>}/>
               <Route path="/superadmin/reports"element={<SuperAdminReports/>}/>
                <Route path="/superadmin/requisitions"element={<SuperAdminRequisitions/>}/>
                 <Route path="/superadmin/settings"element={<SuperAdminSettings/>}/>
                  <Route path="/superadmin/users"element={<SuperAdminUsers/>}/>
                   <Route path="/superadmin/assets"element={<SuperAdminAssets/>}/>
                   <Route path="/superadmin/role"element={<SuperAdminRoles/>}/>
                
                  <Route path="/user/dashboard" element={<FacilityUserDashboard/>}/>'
              <Route path="/user/requisitions" element={<FacilityUserRequisition/>}/>'
                  <Route path="/user/facilityInventory"element={<FacilityUserInventory/>}/>
                  <Route path="/user/myRequests"element={<FacilityUserMyRequests/>}/>
                  <Route path="/user/notification"element={<FacilityUserNotifications/>}/>
                  <Route path="/user/receipts"element={<AcknowledgementOfReceipts/>}/>

                   <Route path="/warehouse/dashboard"element={<WarehouseDashbaord/>}/>
                 <Route path="/warehouse/inventory"element={<WarehouseInventory/>}/>
                 <Route path="/warehouse/assets"element={<WareHouseAssets/>}/>
                < Route path="/warehouse/reports"element={<WarehouseReports/>}/>
               < Route path="/warehouse/dispatches"element={<WarehouseDispatches/>}/>   
    <Route path="/warehouse/settings"element={<WarehouseSettings/>}/>   
        <Route path="/warehouse/requisitions"element={<WarehouseRequisitions/>}/> 
         <Route path="/warehouse/returnsRecalls"element={<ReturnsRecalls/>}/>     
              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
