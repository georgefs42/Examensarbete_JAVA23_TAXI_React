import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DriversPage from './pages/DriversPage';
import DriverIncomePage from './pages/DriverIncomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DriversPage />} />
        <Route path="/driver-income" element={<DriverIncomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
