import React, { useState, useEffect } from "react";
import "../css/admin/DriverMonthlyReports.css";

const DriversPage = () => {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');
  const [newReport, setNewReport] = useState({
    driverId: '',
    periodFrom: '',
    periodTo: ''
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchReports();

    // Scroll event to handle scroll-to-top button visibility
    window.onscroll = () => {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
  }, []);

  // Fetch reports from the backend
  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:8080/monthly-rapport');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      setMessage('Error fetching reports');
    }
  };

  // Create a new report
  const handleCreateReport = async () => {
    try {
      const response = await fetch('http://localhost:8080/monthly-rapport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });
      if (response.ok) {
        setMessage('Report created successfully!');
        fetchReports();
      } else {
        setMessage('Error creating report');
      }
    } catch (error) {
      setMessage('Error creating report');
    }
  };

  // Delete a report
  const handleDeleteReport = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:8080/monthly-rapport/${driverId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('Report deleted successfully!');
        fetchReports();
      } else {
        setMessage('Error deleting report');
      }
    } catch (error) {
      setMessage('Error deleting report');
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate back to the previous page
  const handleFinish = () => {
    window.history.back();
  };

  // Function to format numbers as SEK (Swedish Krona)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    }).format(amount);
  };

  return (
    <div className="driver-monthly-report">
      <button className="finish-button" onClick={handleFinish}>Finish</button>
      <h1>Monthly Reports</h1>

      {/* Create new report form */}
      <section>
        <h2>Create New Report</h2>
        
        {/* Driver ID, Period From, and Period To */}
        <div className="form-field">
          <label htmlFor="driverId">Driver ID</label>
          <input
            id="driverId"
            type="text"
            placeholder="Driver ID"
            value={newReport.driverId}
            onChange={(e) => setNewReport({ ...newReport, driverId: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label htmlFor="periodFrom">Period From</label>
          <input
            id="periodFrom"
            type="date"
            value={newReport.periodFrom}
            onChange={(e) => setNewReport({ ...newReport, periodFrom: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label htmlFor="periodTo">Period To</label>
          <input
            id="periodTo"
            type="date"
            value={newReport.periodTo}
            onChange={(e) => setNewReport({ ...newReport, periodTo: e.target.value })}
          />
        </div>

        {/* Create button */}
        <button onClick={handleCreateReport}>Create Report</button>
      </section>

      {/* Show message after each action */}
      {message && <div className="message">{message}</div>}

      {/* Display list of reports */}
      <section>
        <h2>Existing Reports</h2>
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.driverId} className="report">
              <p><strong>Driver ID: {report.driverId}</strong></p>
              <p>Name: {report.name}</p>
              <p>Personal Number: {report.personalNumber}</p>
              {/* Format total profit as SEK */}
              <p>Total Profit: {formatCurrency(report.totalProfit)}</p>
              <p>Period: {report.periodFrom} - {report.periodTo}</p>

              {/* Delete button */}
              <button onClick={() => handleDeleteReport(report.driverId)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No reports available</p>
        )}
      </section>

      {/* Scroll to Top button */}
      <button
        className={`scroll-top ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </div>
  );
};

export default DriversPage;
