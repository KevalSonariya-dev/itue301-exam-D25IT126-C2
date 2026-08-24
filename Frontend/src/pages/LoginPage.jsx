import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("alex@techsolutions.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Alex Johnson");
  const [role, setRole] = useState("employee");
  const [department, setDepartment] = useState("Engineering");

  const { login, token, employee, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const employeeData = {
      name,
      email,
      department,
      designation: role === "hr" ? "HR Manager" : "Software Engineer",
      leaveBalance: 20
    };
    const mockToken = "jwt_token_" + Date.now();
    login(employeeData, mockToken, role);

    if (role === "hr") {
      navigate("/hr");
    } else {
      navigate("/my-leaves");
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "2rem auto", padding: "2rem", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", backgroundColor: "#ffffff" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Employee Leave Management</h1>
      <h2 style={{ fontSize: "1.2rem", color: "#4b5563", marginBottom: "1.5rem" }}>Login</h2>

      {token ? (
        <div style={{ padding: "1rem", backgroundColor: "#ecfdf5", borderRadius: "6px", border: "1px solid #a7f3d0", marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 8px 0", color: "#065f46" }}>
            Currently logged in as <strong>{employee?.name}</strong> ({employee?.department}) - Role: <strong>{role}</strong>
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate(role === "hr" ? "/hr" : "/my-leaves")}
              style={{ padding: "6px 12px", backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={logout}
              style={{ padding: "6px 12px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          >
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "0.5rem",
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;