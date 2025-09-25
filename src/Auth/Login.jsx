import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Warehouse Admin");
  const [isLoading, setIsLoading] = useState(false); // Optional: for future loading state

  // Define default credentials for each role
  const roleCredentials = {
    "Super Admin": {
      username: "superadmin",
      password: "super123",
      redirect: "/superadmin/dashboard",
    },
    "Warehouse Admin": {
      username: "warehouse",
      password: "warehouse123",
      redirect: "/warehouse/dashboard",
    },
    "Facility Admin": {
      username: "facility",
      password: "facility123",
      redirect: "/facility/dashboard",
    },
    "Facility User": {
      username: "user",
      password: "user123",
      redirect: "/user/dashboard",
    },
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    setUsername(roleCredentials[role].username);
    setPassword(roleCredentials[role].password);
    setShowPassword(true); // ✅ autofill hone ke baad password visible ho jaye
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate small delay for UX
    setTimeout(() => {
      const matchedRole = Object.values(roleCredentials).find(
        (role) => role.username === username && role.password === password
      );

      if (matchedRole) {
        localStorage.setItem(
          "userRole",
          Object.keys(roleCredentials).find(
            (key) => roleCredentials[key].username === username
          )
        );
        localStorage.setItem("username", username);
        navigate(matchedRole.redirect);
      } else {
        alert("Invalid username or password. Please try again.");
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div
        className="card shadow-lg overflow-hidden"
        style={{
          maxWidth: "900px",
          width: "100%",
          borderRadius: "16px",
          border: "none",
          boxShadow: "0 10px 30px rgba(0, 86, 179, 0.15)",
        }}
      >
        <div className="row g-0">
          {/* Image Column - Hidden on Mobile */}
          <div className="col-md-6 d-none d-md-block">
            <img
              src="https://www.shutterstock.com/image-illustration/online-consultation-doctor-on-smartphone-600nw-2150820867.jpg"
              alt="Hospital Warehouse"
              className="img-fluid h-100"
              style={{
                objectFit: "cover",
                borderTopLeftRadius: "16px",
                borderBottomLeftRadius: "16px",
              }}
            />
          </div>

          {/* Form Column */}
          <div className="col-md-6 d-flex flex-column p-5 bg-white">
            <div className="text-center mb-5">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <h2
                  className="fw-bold ms-3 mb-0"
                  style={{ color: "#0056b3", fontSize: "1.8rem" }}
                >
                  FRANCIS FOSU GROUP
                </h2>
              </div>
              <h3
                className="fw-bold mb-2"
                style={{ color: "#0056b3", fontSize: "1.4rem" }}
              >
                Hospital Warehouse Management
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Role Selector */}
              <div className="mb-4 rounded">
                <label
                  className="form-label fw-semibold d-block"
                  style={{ color: "#0056b3", fontSize: "1.05rem" }}
                >
                  Select Your Role
                </label>
                <select
                  className="form-select form-select-lg py-3 px-3 border-0 border-bottom"
                  value={selectedRole}
                  onChange={handleRoleChange}
                  style={{
                    borderBottom: "2px solid #0056b3",
                    backgroundColor: "#f8fbff",
                    fontSize: "1rem",
                    borderRadius: "0",
                    transition: "background-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.target.style.backgroundColor = "#eef5ff")
                  }
                  onBlur={(e) =>
                    (e.target.style.backgroundColor = "#f8fbff")
                  }
                >
                  {Object.keys(roleCredentials).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Username Field */}
              <div className="mb-4">
                <label
                  className="form-label fw-semibold"
                  style={{ color: "#0056b3", fontSize: "1.05rem" }}
                >
                  Username
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-light border-0 border-bottom"
                    style={{
                      borderBottom: "2px solid #0056b3",
                      backgroundColor: "#f8fbff",
                    }}
                  >
                    <i
                      className="bi bi-person-fill"
                      style={{ color: "#0056b3", fontSize: "1.2rem" }}
                    ></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg py-3 border-0 border-bottom"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      borderBottom: "2px solid #0056b3",
                      backgroundColor: "#f8fbff",
                      fontSize: "1rem",
                      paddingLeft: "12px",
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label
                  className="form-label fw-semibold"
                  style={{ color: "#0056b3", fontSize: "1.05rem" }}
                >
                  Password
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text bg-light border-0 border-bottom"
                    style={{
                      borderBottom: "2px solid #0056b3",
                      backgroundColor: "#f8fbff",
                    }}
                  >
                    <i
                      className="bi bi-lock-fill"
                      style={{ color: "#0056b3", fontSize: "1.2rem" }}
                    ></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg py-3 border-0 border-bottom"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      borderBottom: "2px solid #0056b3",
                      backgroundColor: "#f8fbff",
                      fontSize: "1rem",
                      paddingLeft: "12px",
                    }}
                  />
                  <button
                    className="btn btn-light border-0 border-bottom d-flex align-items-center"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      borderBottom: "2px solid #0056b3",
                      backgroundColor: "#f8fbff",
                      width: "50px",
                    }}
                  >
                    {showPassword ? (
                      <i
                        className="bi bi-eye-slash"
                        style={{ color: "#0056b3", fontSize: "1.2rem" }}
                      ></i>
                    ) : (
                      <i
                        className="bi bi-eye"
                        style={{ color: "#0056b3", fontSize: "1.2rem" }}
                      ></i>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                    style={{ borderColor: "#0056b3", accentColor: "#0056b3" }}
                  />
                  <label
                    className="form-check-label ms-2"
                    htmlFor="remember"
                    style={{ color: "#0056b3", fontSize: "0.95rem" }}
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-decoration-none"
                  style={{
                    color: "#0056b3",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn w-100 py-3 fw-bold text-white position-relative overflow-hidden"
                style={{
                  backgroundColor: "#0056b3",
                  border: "none",
                  fontSize: "1.1rem",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0, 86, 179, 0.3)",
                }}
                disabled={isLoading}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#004494";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(0, 86, 179, 0.4)";
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = "#0056b3";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(0, 86, 179, 0.3)";
                  }
                }}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i> Login to
                    System
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
