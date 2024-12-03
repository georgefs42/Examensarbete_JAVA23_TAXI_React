import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DriversPage from './pages/DriversPage';
import DriverIncomePage from './pages/DriverIncomePage';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './css/main.css'; 
import './css/header.css'; 
import './css/footer.css';


const App = () => {
  const [user, setUser] = useState(null); // Manage logged-in user state

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={<LoginPage setUser={setUser} />}
            />
            <Route
              path="/drivers"
              element={
                user && user.role === 'admin' ? (
                  <DriversPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/driver-income"
              element={
                user ? (
                  <DriverIncomePage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/"
              element={<Navigate to="/login" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;