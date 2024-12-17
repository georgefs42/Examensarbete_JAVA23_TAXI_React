import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import '../../css/driver/driverDashboard.css';

const DriverDashboard = () => {
  const [driverId, setDriverId] = useState('');
  const [dailyIncome, setDailyIncome] = useState('');
  const [date, setDate] = useState('');
  const [incomeDetails, setIncomeDetails] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [driversReport, setDriversReport] = useState([]);
  const [text, setText] = useState(''); // Animated text state
  const [currentIndex, setCurrentIndex] = useState(0); // Index to keep track of animation progress
  const [showContent, setShowContent] = useState(false); // Control page content visibility

  const navigate = useNavigate();  // Hook to handle navigation

  const welcomeText =
    "Welcome, Driver!\nYou're important to us.\nDrive safely and take care on the road!";

  // Function to format numbers to SEK currency format
  const formatToSEK = (amount) => {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(amount);
  };

  // Handle calculate income
  const handleCalculateIncome = () => {
    const vat = (dailyIncome * 0.06).toFixed(2);
    const remainingIncome = dailyIncome - vat;
    const profit = (remainingIncome * 0.45).toFixed(2);

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
        driver: { driverId },
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setStatusMessage('Income submitted successfully!');
        navigate('/driver/driverDashboard');
      })
      .catch(() => setStatusMessage('Error submitting income.'));
  };

  // Fetch driver report and generate PDF
  const handleGenerateReport = () => {
    axios
      .get('http://localhost:8080/reports/driver-report', {
        params: { month: month, year: year },
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
    doc.text('Driver ID', 10, y);
    doc.text('Name', 40, y);
    doc.text('Password', 100, y);
    doc.text('Total Driver Profit (SEK)', 150, y);
    y += 10;

    reportData.forEach((driver) => {
      doc.text(driver.driverId.toString(), 10, y);
      doc.text(driver.name, 40, y);
      doc.text(driver.password, 100, y);
      doc.text(driver.totalDriverProfit.toFixed(2), 150, y);
      y += 10;
    });

    doc.save('driver_report.pdf');
  };

  // Animate the welcome text (letter by letter)
  useEffect(() => {
    if (currentIndex < welcomeText.length) {
      const timer = setTimeout(() => {
        setText((prev) => prev + welcomeText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100); // Speed up by reducing the delay to 100ms per character
      return () => clearTimeout(timer); // Cleanup timer on each render
    } else {
      // After the animation finishes, load the page content
      setShowContent(true);
    }
  }, [currentIndex]);

  return (
    <div className="driver-income-container">
      {/* Fixed "Finish" button */}
      <button
        className="btn-finish"
        onClick={() => navigate('/')} // Navigate to the previous page
      >
        Finish
      </button>

      {/* Animated Welcome Message */}
      <div className="welcome-message">
        <h2>
          {text.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </h2>
      </div>

      {/* Load the rest of the page content after the welcome message */}
      {showContent && (
        <>
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
              <p>Daily Income: {formatToSEK(incomeDetails.dailyIncome)}</p>
              <p>VAT 6%: {formatToSEK(incomeDetails.vat)}</p>
              <p>
                <strong>Your Profit 45%: {formatToSEK(incomeDetails.profit)}</strong>
              </p>
            </div>
          )}

          {incomeDetails && (
            <div className="submit-button-container">
              <button onClick={handleSubmitIncome}>Submit Income</button>
            </div>
          )}

          {statusMessage && (
            <div
              className={`status-message ${
                statusMessage.includes('Error') ? 'error' : 'success'
              }`}
            >
              {statusMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DriverDashboard;
