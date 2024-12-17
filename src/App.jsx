import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverProfile from './pages/admin/DriverProfile'; // Import DriverProfile component
import DriverMonthlyReports from './pages/admin/DriverMonthlyReports'; // Import DriverMonthlyReports component
import DriverSalaryReport from './pages/admin/DriverSalaryReport'; // Import DriverSalaryReport component
import Header from './components/Header';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm'; // Import BookingForm component
import CentralDashboard from './pages/taxiCentral/CentralDashboard'; // Import CentralDashboard component
import About from './pages/about/About'; // Import the About component
import Work from './pages/work/Work';

const App = () => {
  // State to track the user's role (ADMIN, USER, or TAXI_CENTRAL)
  const [userRole, setUserRole] = useState(null);

  // Handle user login and set their role
  const handleLogin = (role) => {
    setUserRole(role); // Set user role on login
  };

  // Handle user logout and clear their role
  const handleLogout = () => {
    setUserRole(null); // Clear user role on logout
  };

  // ProtectedRoute component to restrict access based on user role
  const ProtectedRoute = ({ role, children, requiredRole }) => {
    // If the user role does not match the required role, redirect to login page
    if (role !== requiredRole) {
      return <Navigate to="/auth/login" replace />;
    }
    // If the user role matches, render the children (protected route)
    return children;
  };

  return (
    <Router>
      {/* Header component, passes userRole and logout function as props */}
      <Header userRole={userRole} onLogout={handleLogout} />

      <Routes>
        {/* Login Route */}
        <Route path="/auth/login" element={<Login onLogin={handleLogin} />} />

        {/* Admin Routes */}
        {/* Admin Dashboard */}
        <Route
          path="/admin/AdminDashboard"
          element={
            <ProtectedRoute role={userRole} requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Driver Profile (Admin view) */}
        <Route
          path="/admin/DriverProfile"
          element={
            <ProtectedRoute role={userRole} requiredRole="ADMIN">
              <DriverProfile />
            </ProtectedRoute>
          }
        />
        {/* Driver Monthly Reports (Admin view) */}
        <Route
          path="/admin/DriverMonthlyReports"
          element={
            <ProtectedRoute role={userRole} requiredRole="ADMIN">
              <DriverMonthlyReports />
            </ProtectedRoute>
          }
        />
        {/* Driver Salary Report (Admin view) */}
        <Route
          path="/admin/DriverSalaryReport"
          element={
            <ProtectedRoute role={userRole} requiredRole="ADMIN">
              <DriverSalaryReport />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        {/* Driver Dashboard */}
        <Route
          path="/driver/DriverDashboard"
          element={
            <ProtectedRoute role={userRole} requiredRole="USER">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Taxi Central Routes */}
        {/* Taxi Central Dashboard */}
        <Route
          path="/taxiCentral/CentralDashboard"
          element={
            <ProtectedRoute role={userRole} requiredRole="TAXI_CENTRAL">
              <CentralDashboard />
            </ProtectedRoute>
          }
        />

        {/* Homepage Route */}
        <Route path="/" element={<BookingForm />} />

        {/* About Route  */}
        <Route path="/about/About" element={<About />} />

        {/* Work Route  */}
        <Route path="/work/Work" element={<Work />} />
      </Routes>

      {/* Footer component */}
      <Footer />
    </Router>
  );
};

export default App;
