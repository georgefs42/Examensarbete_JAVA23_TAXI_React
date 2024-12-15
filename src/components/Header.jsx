import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Header.css'; // Ensure you have a CSS file for styling

const Header = () => {
  const navigate = useNavigate(); // For navigation
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if token exists

  const handleAuthTextClick = () => {
    if (isAuthenticated) {
      // Logout logic
      localStorage.removeItem('authToken');
      navigate('/'); // Redirect to homepage after logout
    } else {
      // Navigate to login page
      navigate('/auth/login');
    }
  };

  return (
    <header className="header">
      <div className="logo">
        Stockholm <span className="highlight">TAXI</span> och Åkeri
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
              <li><Link to="/driver/dashboard">Driver Dashboard</Link></li>
            </>
          )}
          {/* Login/Out text */}
          <li>
            <span onClick={handleAuthTextClick} className="auth-text">
              Login/Out
            </span>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
