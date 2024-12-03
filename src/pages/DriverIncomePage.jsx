import React, { useState } from 'react';
import '../css/driverIncome.css';

const DriverIncomePage = () => {
  const [driverId, setDriverId] = useState('');
  const [dailyIncome, setDailyIncome] = useState('');
  const [date, setDate] = useState('');
  const [incomeDetails, setIncomeDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Function to format numbers to SEK currency format
  const formatToSEK = (amount) => {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(amount);
  };

  const handleCalculateIncome = () => {
    // Calculate and display income (replace with actual calculation logic)
    const vat = (dailyIncome * 0.25).toFixed(2);
    const profit = (dailyIncome * 0.7).toFixed(2);
    
    const calculatedIncome = {
      dailyIncome,
      vat,
      profit,
    };
    
    setIncomeDetails(calculatedIncome);
  };

  const handleSubmitIncome = () => {
    // Send to API (replace with actual post request)
    fetch('http://localhost:8080/driver-income', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        dailyIncome,
        driver: { driverId }
      })
    })
    .then(response => response.json())
    .then(() => setStatusMessage('Income submitted successfully!'))
    .catch(() => setStatusMessage('Error submitting income.'));
  };

  return (
    <div className="driver-income-container">
      <h2>Driver Income</h2>

      <div className="income-form">
        <label>Driver ID</label>
        <input
          type="number"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          placeholder="Enter driver ID"
        />
        <label>Daily Income</label>
        <input
          type="number"
          value={dailyIncome}
          onChange={(e) => setDailyIncome(e.target.value)}
          placeholder="Enter daily income"
        />
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleCalculateIncome}>Calculate</button>
      </div>

      {incomeDetails && (
        <div className="calculated-income">
          <p>VAT: {formatToSEK(incomeDetails.vat)}</p>
          <p>Profit: {formatToSEK(incomeDetails.profit)}</p>
          <p>Daily Income: {formatToSEK(incomeDetails.dailyIncome)}</p>
        </div>
      )}

      {incomeDetails && (
        <div className="submit-button-container">
          <button onClick={handleSubmitIncome}>Submit Income</button>
        </div>
      )}

      {statusMessage && (
        <div className={`status-message ${statusMessage.includes('Error') ? 'error' : 'success'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default DriverIncomePage;
