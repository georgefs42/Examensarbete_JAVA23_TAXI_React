import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "../css/admin/salaryReport.css";

const API_URL = 'http://localhost:8080/salary-report';

const DriversPage = () => {
  const [salaryReports, setSalaryReports] = useState([]);
  const [newSalaryReport, setNewSalaryReport] = useState({
    driverId: '',
    month: '',
    year: '',
    tax: '',
  });

  const [editSalaryReport, setEditSalaryReport] = useState(null);

  useEffect(() => {
    fetchSalaryReports();
  }, []);

  const fetchSalaryReports = async () => {
    try {
      const response = await axios.get(API_URL);
      setSalaryReports(response.data);
    } catch (error) {
      console.error('Error fetching salary reports:', error.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newSalaryReport.driverId || !newSalaryReport.month || !newSalaryReport.year || !newSalaryReport.tax) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await axios.post(API_URL, newSalaryReport);
      setSalaryReports((prev) => [...prev, response.data]);
      fetchSalaryReports();  // Optionally, refetch the reports after creation
      resetForm();
    } catch (error) {
      console.error('Error creating salary report:', error.message);
      alert('Error creating salary report. Please try again.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Ensure there is an editSalaryReport to update
    if (!editSalaryReport) return;

    // Validate required fields
    if (!newSalaryReport.driverId || !newSalaryReport.month || !newSalaryReport.year || !newSalaryReport.tax) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${editSalaryReport.id}`, newSalaryReport);
      setSalaryReports((prev) =>
        prev.map((report) =>
          report.id === response.data.id ? response.data : report
        )
      );
      fetchSalaryReports();  // Optionally, refetch the reports after update
      resetForm();
      setEditSalaryReport(null);  // Exit edit mode
    } catch (error) {
      console.error('Error updating salary report:', error.message);
      alert('Error updating salary report. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSalaryReports((prev) => prev.filter((report) => report.id !== id));
    } catch (error) {
      console.error('Error deleting salary report:', error.message);
      alert('Error deleting salary report. Please try again.');
    }
  };

  const handleDownloadPdf = (report) => {
    const doc = new jsPDF();

    // Add company details at the top of the PDF
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text("Stockholm Taxi och Åkeri", 20, 20);
    doc.text("Org.Nummer: 790804-1515", 20, 30);
    doc.text("Drottning Kristinas väg 115, 761 42 Norrtälje", 20, 40);
    doc.text("Mobil: 070 -290 33 83", 20, 50);
    doc.text("------------------------------------------------------------", 20, 60); // Separator line

    // Add report details: Name, Personal Number, Month, Year
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Salary Report for: ${report.name || 'N/A'}`, 20, 70); // Driver Name (or N/A if not available)
    doc.text(`Personal Number: ${report.personalNumber || 'N/A'}`, 20, 80); // Personal Number (or N/A if not available)
    doc.text(`Month: ${report.month}`, 20, 90); // Month
    doc.text(`Year: ${report.year}`, 20, 100); // Year
    doc.text("------------------------------------------------------------", 20, 110); // Separator line

    // Add the salary details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tax: ${formatCurrency(report.tax)}`, 20, 120);
    doc.text(`Total Profit: ${formatCurrency(report.totalProfit)}`, 20, 130);
    doc.text(`Salary After Tax: ${formatCurrency(report.salaryAfterTax)}`, 20, 140);

    // Save the PDF with a dynamic filename
    doc.save(`Salary_Report_${report.driverId}_${report.month}_${report.year}.pdf`);
  };

  const resetForm = () => {
    setNewSalaryReport({
      driverId: '',
      month: '',
      year: '',
      tax: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSalaryReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (report) => {
    setEditSalaryReport(report);
    setNewSalaryReport({
      driverId: report.driverId,
      month: report.month,
      year: report.year,
      tax: report.tax,
    });
  };

  // Helper function to format numbers as SEK
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="drivers-page">
      <h1>Salary Reports</h1>

      <form
        className="salary-form"
        onSubmit={editSalaryReport ? handleUpdate : handleCreate}
      >
        <h2>{editSalaryReport ? 'Edit' : 'Create'} Salary Report</h2>
        <div className="form-group">
          <label htmlFor="driverId">Driver ID:</label>
          <input
            type="number"
            id="driverId"
            name="driverId"
            value={newSalaryReport.driverId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="month">Month:</label>
          <input
            type="number"
            id="month"
            name="month"
            value={newSalaryReport.month}
            onChange={handleChange}
            required
            min="1"
            max="12"
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={newSalaryReport.year}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tax">Tax:</label>
          <input
            type="number"
            id="tax"
            name="tax"
            value={newSalaryReport.tax}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <button type="submit" className="btn-submit">
          {editSalaryReport ? 'Update' : 'Create'} Salary Report
        </button>
      </form>

      <h2>Salary Reports List</h2>
      <table className="salary-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Driver ID</th>
            <th>Name</th>
            <th>Month</th>
            <th>Year</th>
            <th>Total Profit</th>
            <th>Salary After Tax</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salaryReports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.driverId}</td>
              <td>{report.name || 'N/A'}</td>
              <td>{report.month}</td>
              <td>{report.year}</td>
              <td>{formatCurrency(report.totalProfit)}</td>
              <td>{formatCurrency(report.salaryAfterTax)}</td>
              <td>
                <button
                  className="btn-edit"
                  aria-label="Edit Salary Report"
                  onClick={() => handleEdit(report)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  aria-label="Delete Salary Report"
                  onClick={() => handleDelete(report.id)}
                >
                  Delete
                </button>
                <button
                  className="btn-download-pdf"
                  aria-label="Download Salary Report as PDF"
                  onClick={() => handleDownloadPdf(report)}
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriversPage;
