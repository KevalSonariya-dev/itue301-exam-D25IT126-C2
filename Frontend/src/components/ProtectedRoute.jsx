import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Access Denied</h2>
        <p>You do not have the required permissions ({requiredRole.toUpperCase()}) to view this page.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;