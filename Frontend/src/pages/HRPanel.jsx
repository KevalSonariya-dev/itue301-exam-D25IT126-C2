import { useAuth } from "../context/AuthContext";

function HRPanel() {
  const { employee } = useAuth();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1.5rem", textAlign: "left" }}>
      <h2>HR Management Panel</h2>
      <p style={{ color: "#4b5563" }}>
        Welcome to the HR Panel, <strong>{employee?.name || "HR Admin"}</strong>. This panel is restricted to users with the HR role.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem"
        }}
      >
        <div style={{ padding: "1.5rem", backgroundColor: "#f0f9ff", borderRadius: "8px", border: "1px solid #bae6fd" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>Total Employees</h4>
          <p style={{ fontSize: "1.8rem", margin: 0, fontWeight: "bold", color: "#0c4a6e" }}>24</p>
        </div>

        <div style={{ padding: "1.5rem", backgroundColor: "#fefce8", borderRadius: "8px", border: "1px solid #fef08a" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#854d0e" }}>Pending Leaves</h4>
          <p style={{ fontSize: "1.8rem", margin: 0, fontWeight: "bold", color: "#713f12" }}>5</p>
        </div>

        <div style={{ padding: "1.5rem", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#166534" }}>Approved This Month</h4>
          <p style={{ fontSize: "1.8rem", margin: 0, fontWeight: "bold", color: "#14532d" }}>18</p>
        </div>
      </div>
    </div>
  );
}

export default HRPanel;
