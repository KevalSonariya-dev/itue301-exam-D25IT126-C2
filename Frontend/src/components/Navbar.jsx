import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { employee, token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#00bcd4" : "#ffffff",
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: "4px",
    fontWeight: isActive ? "bold" : "normal",
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
    transition: "background-color 0.2s"
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#1e293b",
        color: "#ffffff",
        marginBottom: "2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        Leave Management Portal
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <NavLink to="/" style={navLinkStyle}>
          Login
        </NavLink>
        <NavLink to="/apply" style={navLinkStyle}>
          Apply Leave
        </NavLink>
        <NavLink to="/my-leaves" style={navLinkStyle}>
          My Leaves
        </NavLink>
        <NavLink to="/hr" style={navLinkStyle}>
          HR Panel
        </NavLink>

        {token && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "1rem" }}>
            <span style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
              {employee?.name} ({role})
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
