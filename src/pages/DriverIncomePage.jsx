import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import '../css/driverIncome.css';

const DriverIncomePage = () => {
  const [driverId, setDriverId] = useState('');
  const [dailyIncome, setDailyIncome] = useState('');
  const [date, setDate] = useState('');
  const [incomeDetails, setIncomeDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [driversReport, setDriversReport] = useState([]);

  // Function to format numbers to SEK currency format
  const formatToSEK = (amount) => {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(amount);
  };

  // Handle calculate income
  const handleCalculateIncome = () => {
    const vat = (dailyIncome * 0.25).toFixed(2);
    const profit = (dailyIncome * 0.7).toFixed(2);

    const calculatedIncome = {
      dailyIncome,
      vat,
      profit,
    };

    setIncomeDetails(calculatedIncome);
  };

  // Handle submit income
  const handleSubmitIncome = () => {
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

  // Fetch driver report and generate PDF
  const handleGenerateReport = () => {
    axios
      .get('http://localhost:8080/reports/driver-report', {
        params: {
          month: month,
          year: year,
        },
      })
      .then((response) => {
        setDriversReport(response.data);
        generatePDF(response.data);
      })
      .catch((error) => {
        console.error('Error fetching driver report:', error);
      });
  };

  // Generate PDF for the report
  const generatePDF = (reportData) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Driver Report', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    let y = 40;

    // Table Headers
    doc.text('Driver ID', 10, y);
    doc.text('Name', 40, y);
    doc.text('Password', 100, y);
    doc.text('Total Driver Profit (SEK)', 150, y);
    y += 10;

    // Add driver data to the table
    reportData.forEach((driver) => {
      doc.text(driver.driverId.toString(), 10, y);
      doc.text(driver.name, 40, y);
      doc.text(driver.password, 100, y);
      doc.text(driver.totalDriverProfit.toFixed(2), 150, y);
      y += 10;
    });

    // Save the PDF
    doc.save('driver_report.pdf');
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

      {/* Report Section */}
      <div className="report-section">
        <h3>Generate Driver Report</h3>
        <label>Month:</label>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="Enter month (e.g., 12)"
        />
        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter year (e.g., 2024)"
        />
        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>

      {driversReport.length > 0 && (
        <div>
          <h3>Driver Report</h3>
          <ul>
            {driversReport.map((driver) => (
              <li key={driver.driverId}>
                {driver.name} - {driver.totalDriverProfit.toFixed(2)} SEK
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DriverIncomePage;
