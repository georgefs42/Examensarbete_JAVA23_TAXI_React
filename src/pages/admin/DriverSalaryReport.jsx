import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import '../../css/admin/salaryReport.css';

const DriverSalaryReport = () => {
  const [salaryReports, setSalaryReports] = useState([]);
  const [formData, setFormData] = useState({
    driverId: "",
    month: "",
    year: "",
    tax: "",
  });
  const [editingReport, setEditingReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalaryReports();
  }, []);

  const fetchSalaryReports = async () => {
    try {
      const response = await axios.get("http://localhost:8080/salary-report");
      setSalaryReports(response.data);
    } catch (error) {
      setErrorMessage("Error fetching salary reports.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { driverId, month, year, tax } = formData;

    if (!driverId || !month || !year || !tax) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const periodFrom = new Date(year, month - 1, 1);
    const periodTo = new Date(year, month, 0);

    const payload = {
      driverId,
      month,
      year,
      tax: parseFloat(tax),
      periodFrom: periodFrom.toISOString().split('T')[0],
      periodTo: periodTo.toISOString().split('T')[0],
    };

    try {
      if (editingReport) {
        await axios.put(
          `http://localhost:8080/salary-report/${editingReport.id}`,
          payload
        );
        setEditingReport(null);
      } else {
        await axios.post("http://localhost:8080/salary-report", payload);
      }
      setErrorMessage("");
      fetchSalaryReports();
      setFormData({ driverId: "", month: "", year: "", tax: "" });
    } catch (error) {
      setErrorMessage("Error submitting the form.");
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      driverId: report.driverId,
      month: report.periodFrom.month,
      year: report.periodFrom.year,
      tax: report.tax,
    });

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/salary-report/${id}`);
      fetchSalaryReports();
    } catch (error) {
      setErrorMessage("Error deleting the salary report.");
    }
  };

  const downloadPDF = (report) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Title - centered
    doc.setFontSize(20);
    doc.text('Monthly Salary Report', 105, 20, null, null, 'center');

    // Company info on the top left
    doc.setFontSize(12);
    doc.text('Stockholm Taxi och Åkeri', 20, 40);
    doc.text('Org.Number: 790804-0000', 20, 50);
    doc.text('Address: Drottning Kristinas väg 115, 761 42 Norrtälje', 20, 60);
    doc.text('Mobil: 070 - 290 33 83', 20, 70);

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);

    // Date - right-aligned
    doc.text(`Date: ${date}`, 180, 80, null, null, 'right');

    // Driver info
    doc.setFontSize(14);
    doc.text(`Driver Name: ${report.name}`, 20, 90);
    doc.text(`Driver ID: ${report.driverId}`, 20, 100);
    doc.text(`Driver Personal Number: ${report.personalNumber}`, 20, 110);

    // Correctly extracting month and year
    const periodFrom = new Date(report.periodFrom);  // Assuming periodFrom is a date string
    const month = periodFrom.toLocaleString('default', { month: 'long' });  // Get full month name
    const year = periodFrom.getFullYear();  // Get the full year

    doc.text(`Month and Year: ${month} ${year}`, 20, 120);

    // Salary details
    doc.setFontSize(12);
    doc.text(`Salary Before Tax: ${report.totalProfit} SEK`, 20, 130);
    doc.text(`Tax: ${report.tax} SEK`, 20, 140);

    // Netto Salary - bold
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Netto Salary: ${report.salaryAfterTax} SEK`, 20, 150);

    // Save the PDF
    doc.save(`Salary_Report_${report.driverId}_${month}_${year}.pdf`);
  };

  const handleFinish = () => {
    navigate('/admin/adminDashboard');
  };

  return (
    <div>
      <h1>Driver Salary Reports</h1>

      <div ref={formRef}>
        <form onSubmit={handleSubmit}>
          <h2>{editingReport ? "Edit" : "Create"} Salary Report</h2>
          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

          <label>Driver ID:</label>
          <input
            type="number"
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
          />
          <br />

          <label>Month (1-12):</label>
          <input
            type="number"
            name="month"
            min="1"
            max="12"
            value={formData.month}
            onChange={handleChange}
          />
          <br />

          <label>Year:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
          <br />

          <label>Tax:</label>
          <input
            type="number"
            name="tax"
            value={formData.tax}
            onChange={handleChange}
          />
          <br />

          <button type="submit">{editingReport ? "Update" : "Create"}</button>
        </form>
      </div>

      <button onClick={handleFinish} className="finish-button">
        Finish
      </button>

      <h2>Salary Reports</h2>
      <table>
        <thead>
          <tr>
            <th>Driver Name</th>
            <th>Driver ID</th>
            <th>Period</th>
            <th>Total Profit</th>
            <th>Tax</th>
            <th>Salary After Tax</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salaryReports.map((report) => (
            <tr key={report.id}>
              <td>{report.name}</td>
              <td>{report.driverId}</td>
              <td>{`${new Date(report.periodFrom).getMonth() + 1}/${new Date(report.periodFrom).getFullYear()} - ${new Date(report.periodTo).getMonth() + 1}/${new Date(report.periodTo).getFullYear()}`}</td>
              <td>{report.totalProfit}</td>
              <td>{report.tax}</td>
              <td>{report.salaryAfterTax}</td>
              <td>
                <button onClick={() => handleEdit(report)}>Edit</button>
                <button onClick={() => handleDelete(report.id)}>Delete</button>
                <button onClick={() => downloadPDF(report)}>Download PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverSalaryReport;
