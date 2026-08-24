import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LeaveRequestCard from "../components/LeaveRequestCard";

function MyLeavesPage() {
  const { employee } = useAuth();

  // Sample leave request records
  const [leaveRequests] = useState([
    {
      id: "1",
      leaveType: "Sick",
      fromDate: "2026-08-10",
      toDate: "2026-08-12",
      days: 3,
      reason: "Viral fever and doctor-advised rest",
      status: "approved"
    },
    {
      id: "2",
      leaveType: "Casual",
      fromDate: "2026-08-28",
      toDate: "2026-08-29",
      days: 2,
      reason: "Family function in hometown",
      status: "pending"
    },
    {
      id: "3",
      leaveType: "Earned",
      fromDate: "2026-07-01",
      toDate: "2026-07-05",
      days: 5,
      reason: "Annual vacation trip",
      status: "rejected"
    }
  ]);

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
        <h2 style={{ fontSize: "1.25rem", color: "#334155", marginBottom: "1rem" }}>
          My Leave Applications
        </h2>

        {leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          leaveRequests.map((request) => (
            <LeaveRequestCard
              key={request.id}
              fromDate={request.fromDate}
              toDate={request.toDate}
              days={request.days}
              leaveType={request.leaveType}
              reason={request.reason}
              status={request.status}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default MyLeavesPage;