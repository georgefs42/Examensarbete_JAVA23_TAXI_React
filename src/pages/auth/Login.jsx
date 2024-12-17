import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/auth/login.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const credentials = {
    admin: { username: 'admin', password: '123456', role: 'ADMIN' },
    users: [
      { username: 'driver1', password: '123456', role: 'USER' },
      { username: 'driver2', password: '123456', role: 'USER' },
      { username: 'driver3', password: '123456', role: 'USER' },
    ],
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Admin login
    if (
      username === credentials.admin.username &&
      password === credentials.admin.password
    ) {
      onLogin('ADMIN');
      navigate('/admin/AdminDashboard');
      return;
    }

    // Driver login
    const user = credentials.users.find(
      (user) => user.username === username && user.password === password
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
