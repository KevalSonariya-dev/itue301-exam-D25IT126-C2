import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LeaveRequestCard from "../components/LeaveRequestCard";

function MyLeavesPage() {
  const { employee, token } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:5000/api/v1/leaves/my", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to load your leave history");
        }

        const result = await response.json();
        setLeaves(result.data || []);
      } catch (err) {
        setError("Failed to load your leave history");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLeaves();
    } else {
      setLoading(false);
      setError("Failed to load your leave history");
    }
  }, [token]);

  // Client-side filtering: All | Pending | Approved | Rejected (no extra API request)
  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "All") return true;
    return leave.status?.toLowerCase() === filter.toLowerCase();
  });

  const filterOptions = ["All", "Pending", "Approved", "Rejected"];

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", padding: "1.5rem", textAlign: "left" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
        <h1 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>
          Welcome, {employee?.name || "Employee"}
        </h1>
        <div style={{ display: "flex", gap: "1.5rem", color: "#475569", fontSize: "0.95rem" }}>
          <span><strong>Department:</strong> {employee?.department || "General"}</span>
          <span><strong>Designation:</strong> {employee?.designation || "Staff"}</span>
          <span><strong>Leave Balance:</strong> {employee?.leaveBalance ?? 20} days</span>
        </div>
      </header>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "10px" }}>
          <h2 style={{ fontSize: "1.25rem", color: "#334155", margin: 0 }}>
            My Leave Applications
          </h2>

          {/* Client-side filter buttons: All | Pending | Approved | Rejected */}
          <div style={{ display: "flex", gap: "8px" }}>
            {filterOptions.map((opt) => {
              const isActive = filter === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: isActive ? "1px solid #2563eb" : "1px solid #cbd5e1",
                    backgroundColor: isActive ? "#2563eb" : "#f8fafc",
                    color: isActive ? "#ffffff" : "#475569",
                    fontWeight: isActive ? "600" : "500",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
            <p>Loading your leave history...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: "6px",
              color: "#b91c1c",
              marginBottom: "1rem"
            }}
          >
            <p style={{ margin: 0, fontWeight: "500" }}>{error}</p>
          </div>
        )}

        {/* Content list */}
        {!loading && !error && (
          filteredLeaves.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              {filter === "All" ? "No leave requests found." : `No ${filter.toLowerCase()} leave requests found.`}
            </p>
          ) : (
            filteredLeaves.map((request) => {
              const leaveTypeName =
                typeof request.leaveTypeId === "object" && request.leaveTypeId !== null
                  ? request.leaveTypeId.name
                  : (request.leaveType || request.leaveTypeId || "General");

              return (
                <LeaveRequestCard
                  key={request._id || request.id}
                  fromDate={request.fromDate}
                  toDate={request.toDate}
                  days={request.days}
                  leaveType={leaveTypeName}
                  reason={request.reason}
                  status={request.status}
                />
              );
            })
          )
        )}
      </section>
    </div>
  );
}

export default MyLeavesPage;