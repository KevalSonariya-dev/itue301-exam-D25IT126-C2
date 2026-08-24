import { useState, useEffect } from "react";
import LeaveRequestCard from "../components/LeaveRequestCard";

function ApplyLeavePage() {
  const [leaveType, setLeaveType] = useState("Casual");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [computedDays, setComputedDays] = useState(0);
  const [submittedData, setSubmittedData] = useState(null);

  // Meaningful state usage: Compute number of days whenever fromDate or toDate changes
  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = end.getTime() - start.getTime();
      if (diffTime >= 0) {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setComputedDays(diffDays);
      } else {
        setComputedDays(0);
      }
    } else if (fromDate || toDate) {
      setComputedDays(1);
    } else {
      setComputedDays(0);
    }
  }, [fromDate, toDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      alert("To Date cannot be before From Date.");
      return;
    }

    const newRequest = {
      leaveType,
      fromDate,
      toDate,
      days: computedDays,
      reason,
      status: "pending"
    };

    setSubmittedData(newRequest);
    alert(`Leave application submitted successfully for ${computedDays} day(s)!`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1.5rem", textAlign: "left" }}>
      <h2>Apply for Leave</h2>
      <p style={{ color: "#64748b" }}>Fill out the details below to request a leave of absence.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          backgroundColor: "#ffffff",
          padding: "1.5rem",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
          >
            <option value="Casual">Casual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Earned">Earned Leave</option>
            <option value="CompOff">CompOff</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
              style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Dynamic info box showing meaningful state */}
        <div style={{ padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
          <p style={{ margin: "0 0 4px 0", fontSize: "0.95rem" }}>
            <strong>Selected Type:</strong> {leaveType}
          </p>
          <p style={{ margin: 0, fontSize: "0.95rem", color: computedDays > 0 ? "#0284c7" : "#64748b" }}>
            <strong>Calculated Duration:</strong> {computedDays} day(s)
          </p>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows={3}
            placeholder="Please enter the reason for leave..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Submit Leave Application
        </button>
      </form>

      {submittedData && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Recently Submitted Leave Application</h3>
          <LeaveRequestCard
            leaveType={submittedData.leaveType}
            fromDate={submittedData.fromDate}
            toDate={submittedData.toDate}
            days={submittedData.days}
            reason={submittedData.reason}
            status={submittedData.status}
          />
        </div>
      )}
    </div>
  );
}

export default ApplyLeavePage;