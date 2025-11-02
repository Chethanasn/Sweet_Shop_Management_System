// frontend/src/App.tsx
import React, { ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPasswordPage from "./pages/ResetPasswordPage"; // ✅ Added
import sweetLogo from "./assets/sweet-logo.png";

// ✅ Helper functions
const isAuthed = (): boolean => !!localStorage.getItem("token");
const role = (): string | null => localStorage.getItem("role");

// ✅ Protected route wrapper
const Protected = ({
  children,
  need,
}: {
  children: ReactNode;
  need?: "admin" | "user";
}) => {
  if (!isAuthed()) return <Navigate to="/" replace />;

  const userRole = role();

  // Redirect to the appropriate dashboard if role doesn’t match
  if (need && userRole !== need) {
    return (
      <Navigate
        to={userRole === "admin" ? "/admin" : "/user"}
        replace
      />
    );
  }

  return <>{children}</>;
};

// ✅ Main App component
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B2F2F] via-[#2E1A12] to-[#C77D24] text-white">
      {/* Header */}
      <header className="flex items-center justify-center py-6 shadow-md bg-[#2E1A12]/80">
        <img
          src={sweetLogo}
          alt="Sweet Shop Logo"
          className="w-16 h-16 mr-3 rounded-full border border-[#C77D24]/40"
        />
        <h1 className="text-3xl font-extrabold tracking-wide">
          Sweet Shop Management
        </h1>
      </header>

      {/* Router Setup */}
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> {/* ✅ New route */}

          {/* Protected dashboards */}
          <Route
            path="/user"
            element={
              <Protected need="user">
                <UserDashboard />
              </Protected>
            }
          />
          <Route
            path="/admin"
            element={
              <Protected need="admin">
                <AdminDashboard />
              </Protected>
            }
          />

          {/* Redirect /sweets to correct dashboard */}
          <Route
            path="/sweets"
            element={
              isAuthed() ? (
                <Navigate
                  to={role() === "admin" ? "/admin" : "/user"}
                  replace
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
