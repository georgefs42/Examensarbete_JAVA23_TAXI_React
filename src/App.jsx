import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverProfile from './pages/admin/DriverProfile'; // Import DriverProfile
import DriverMonthlyReports from './pages/admin/DriverMonthlyReports'; // Import DriverMonthlyReports
import DriverSalaryReport from './pages/admin/DriverSalaryReport'; // Import DriverSalaryReport
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  const [userRole, setUserRole] = useState(null); // State to track user role ('ADMIN' or 'USER')

  const handleLogin = (role) => {
    setUserRole(role); // Set user role on login
  };

  const handleLogout = () => {
    setUserRole(null); // Clear user role on logout
  };

  // Function to protect routes based on user role
  const ProtectedRoute = ({ role, children, requiredRole }) => {
    if (role !== requiredRole) {
      return <Navigate to="/auth/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Header userRole={userRole} onLogout={handleLogout} />
      <Routes>
        {/* Login Route */}
        <Route path="/auth/login" element={<Login onLogin={handleLogin} />} />

        {/* Admin Routes */}
        <Route
          path="/admin/AdminDashboard"
          element={
            <ProtectedRoute role={userRole} requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/DriverProfile"
          element={
            <ProtectedRoute role={userRole} requiredRole="ADMIN">
              <DriverProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/DriverMonthlyReports"
          element={
            <ProtectedRoute role={userRole} requiredRole="ADMIN">
              <DriverMonthlyReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/DriverSalaryReport"
          element={
            <ProtectedRoute role={userRole} requiredRole="ADMIN">
              <DriverSalaryReport />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="/driver/DriverDashboard"
          element={
            <ProtectedRoute role={userRole} requiredRole="USER">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<h1>Welcome to the Taxi App</h1>} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
