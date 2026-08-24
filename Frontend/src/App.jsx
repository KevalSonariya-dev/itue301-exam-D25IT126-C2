import React, { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import MyLeavesPage from "./pages/MyLeavesPage";

// Lazy-loaded HRPanel using React.lazy
const HRPanel = lazy(() => import("./pages/HRPanel"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: "0 1rem" }}>
        <Suspense
          fallback={
            <div style={{ textAlign: "center", padding: "3rem", fontSize: "1.2rem", color: "#64748b" }}>
              Loading HR Panel...
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={<LoginPage />}
            />

            <Route
              path="/apply"
              element={
                <ProtectedRoute>
                  <ApplyLeavePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-leaves"
              element={
                <ProtectedRoute>
                  <MyLeavesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hr"
              element={
                <ProtectedRoute requiredRole="hr">
                  <HRPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;