import React, { useState, useEffect } from 'react';
import '../css/Drivers.css';


const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState('');

  useEffect(() => {
    // Fetch drivers from the API
    fetch('http://localhost:8080/drivers')
      .then(response => response.json())
      .then(data => setDrivers(data));
  }, []);

  const handleAddDriver = () => {
    // Add new driver logic (replace with actual post request)
    const newDriverObj = { driverId: drivers.length + 1, name: newDriver };
    setDrivers([...drivers, newDriverObj]);
    setNewDriver('');
  };

  return (
    <div className="drivers-container">
      <h2>Drivers</h2>

      <div className="add-driver-form">
        <label>Driver Name</label>
        <input
          type="text"
          value={newDriver}
          onChange={(e) => setNewDriver(e.target.value)}
          placeholder="Enter driver's name"
        />
        <button onClick={handleAddDriver}>Add Driver</button>
      </div>

      <div className="driver-list">
        <ul>
          {drivers.map((driver, index) => (
            <li key={index}>
              <span>{driver.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DriversPage;