import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import '../css/TaxiCentralCenter.css';

const TaxiCentralCenter = () => {
  const [bookings, setBookings] = useState([]);

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
    const doc = new jsPDF();

    // Set font and title for the document
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('Taxi Booking List', 20, 20);

    // Define column headers and table content
    const tableHeaders = ['ID', 'Name', 'Mobile', 'Email', 'Pickup Address', 'Dropoff Address', 'Distance (km)', 'Duration (min)', 'Price (SEK)'];
    const tableRows = bookings.map(booking => [
      booking.id,
      booking.name,
      booking.mobile,
      booking.email,
      booking.pickupAddress,
      booking.dropOffAddress,
      booking.distance.toFixed(2),
      booking.duration.toFixed(0),
      booking.price.toFixed(2),
    ]);

    // Draw table headers
    let startY = 30;
    const columnWidths = [20, 40, 30, 40, 60, 60, 30, 30, 30];
    const cellPadding = 5;
    
    tableHeaders.forEach((header, index) => {
      doc.rect(20 + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0), startY, columnWidths[index], 10);
      doc.text(header, 20 + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0) + cellPadding, startY + 6);
    });

    startY += 10;

    // Draw table rows
    tableRows.forEach(row => {
      row.forEach((cell, index) => {
        doc.rect(20 + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0), startY, columnWidths[index], 10);
        doc.text(cell.toString(), 20 + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0) + cellPadding, startY + 6);
      });
      startY += 10;
    });

    // Save PDF
    doc.save('taxi-booking-list.pdf');
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
              <th>Distance (km)</th>
              <th>Duration (min)</th>
              <th>Price (SEK)</th>
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
                <td>{booking.distance.toFixed(2)}</td>
                <td>{booking.duration.toFixed(0)}</td>
                <td>{booking.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaxiCentralCenter;
