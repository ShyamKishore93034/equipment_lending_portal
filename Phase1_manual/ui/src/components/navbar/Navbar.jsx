import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          Equipment Portal
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Public Links */}
            {user?.role === "student" && (
              <li className="nav-item">
                <Link className="nav-link" to="/equipments">
                  Equipment List
                </Link>
              </li>
            )}
            {(user?.role === "admin" || user?.role === "staff") && (
              <li className="nav-item">
                <Link className="nav-link" to="/requests">
                  Request List
                </Link>
              </li>
            )}

            {/* Admin Only */}
            {user?.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/equipment">
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* Right side: Auth */}
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    {user.name || user.email} ({user.role})
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
