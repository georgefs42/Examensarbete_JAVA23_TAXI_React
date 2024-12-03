import React from 'react';
import { Link } from 'react-router-dom';
import '../css/header.css';


const Header = ({ setUser }) => {
  const handleLogout = () => {
    setUser(null); // Clear the user state on logout
    // Optionally, redirect the user to the login page after logging out
    window.location.href = '/login'; // Force a redirect to the login page
  };

  return (
    <header className="header">
      <div className="container">
        <h1>Taxi Management</h1>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/drivers" className="nav-link">Drivers</Link>
          <Link to="/driver-income" className="nav-link">Driver Income</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;