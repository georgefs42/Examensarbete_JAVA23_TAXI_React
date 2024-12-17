import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/auth/login.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Taxi Central login using environment variables
    if (
      username === import.meta.env.VITE_TAXI_CENTRAL_USERNAME &&
      password === import.meta.env.VITE_TAXI_CENTRAL_PASSWORD
    ) {
      onLogin('TAXI_CENTRAL');
      navigate('/taxiCentral/CentralDashboard');
      return;
    }

    // Admin login using environment variables
    if (
      username === import.meta.env.VITE_ADMIN_USERNAME &&
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      onLogin('ADMIN');
      navigate('/admin/AdminDashboard');
      return;
    }

    // Driver login using environment variables
    const drivers = [
      { username: import.meta.env.VITE_DRIVER1_USERNAME, password: import.meta.env.VITE_DRIVER1_PASSWORD },
      { username: import.meta.env.VITE_DRIVER2_USERNAME, password: import.meta.env.VITE_DRIVER2_PASSWORD },
      { username: import.meta.env.VITE_DRIVER3_USERNAME, password: import.meta.env.VITE_DRIVER3_PASSWORD },
    ];

    const user = drivers.find(
      (driver) => driver.username === username && driver.password === password
    );

    if (user) {
      onLogin('USER');
      navigate('/driver/DriverDashboard');
      return;
    }

    // Invalid credentials
    setErrorMessage('Invalid username or password');
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
