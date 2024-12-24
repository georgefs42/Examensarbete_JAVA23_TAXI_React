import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../../css/taxiCentral/CentralDashboard.css';

const CentralDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text('Taxi Booking List', 20, 20);

    const tableHeaders = [
      'ID', 'Name', 'Mobile', 'Email', 'Pickup Address', 'Dropoff Address',
      'Date', 'Time', 'km', 'Duration(min)', 'Price'
    ];
    const tableRows = bookings.map(booking => [
      booking.id,
      booking.name,
      booking.mobile,
      booking.email,
      booking.pickupAddress,
      booking.dropOffAddress,
      new Date(booking.date).toLocaleDateString(),
      new Date(`1970-01-01T${booking.time}Z`).toLocaleTimeString(),
      booking.distance.toFixed(2),
      booking.duration.toFixed(0),
      booking.price.toFixed(2),
    ]);

    const columnWidths = [6, 25, 18, 40, 40, 40, 20, 15, 15, 18, 15];
    const cellPadding = 3;
    const headerHeight = 10;
    const rowHeight = 10;

    let startY = 30;

    tableHeaders.forEach((header, index) => {
      const xPos = 20 + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0);
      doc.setFillColor(0, 123, 255);
      doc.rect(xPos, startY, columnWidths[index], headerHeight, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.text(header, xPos + cellPadding, startY + 6);
    });

    startY += headerHeight;

    tableRows.forEach((row, rowIndex) => {
      const rowColor = rowIndex % 2 === 0 ? [240, 240, 240] : [255, 255, 255];

      row.forEach((cell, index) => {
        const xPos = 20 + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0);
        doc.setFillColor(...rowColor);
        doc.rect(xPos, startY, columnWidths[index], rowHeight, 'FD');
        doc.setTextColor(0, 0, 0);
        doc.text(cell.toString(), xPos + cellPadding, startY + 6);
      });

      startY += rowHeight;
    });

    doc.save('taxi-booking-list.pdf');
  };

  // Handle Finish button click to navigate to '/'
  const handleFinishClick = () => {
    navigate('/'); // Navigate to the home route
  };

  return (
    <div className="taxi-central-center-container">
      <h2>Taxi Central - Booking List</h2>
      <button onClick={generatePDF} className="download-btn">
        Download PDF
      </button>

      {bookings.length === 0 ? (
        <p>Loading bookings...</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Pickup Address</th>
              <th>Dropoff Address</th>
              <th>Date</th>
              <th>Time</th>
              <th>km</th>
              <th>Duration (min)</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.name}</td>
                <td>{booking.mobile}</td>
                <td>{booking.email}</td>
                <td>{booking.pickupAddress}</td>
                <td>{booking.dropOffAddress}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>{new Date(`1970-01-01T${booking.time}Z`).toLocaleTimeString()}</td>
                <td>{booking.distance.toFixed(2)}</td>
                <td>{booking.duration.toFixed(0)}</td>
                <td>{booking.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Finish Button */}
      <button onClick={handleFinishClick} className="finish-button">
        Finish
      </button>
    </div>
  );
};

export default CentralDashboard;
