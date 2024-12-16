import React, { useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";

const ReportPage = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [driversReport, setDriversReport] = useState([]);

  const handleGenerateReport = () => {
    // Fetch the driver report from the backend
    axios
      .get("http://localhost:8080/reports/driver-report", {
        params: {
          month: month,
          year: year,
        },
      })
      .then((response) => {
        setDriversReport(response.data);
        generatePDF(response.data); // Generate the PDF after receiving the report
      })
      .catch((error) => {
        console.error("Error fetching driver report:", error);
      });
  };

  const generatePDF = (reportData) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Driver Report", 105, 20, { align: "center" });

    doc.setFontSize(12);
    let y = 40;

    // Table Headers
    doc.text("Driver ID", 10, y);
    doc.text("Name", 40, y);
    doc.text("Password", 100, y);
    doc.text("Total Driver Profit (SEK)", 150, y);
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
    doc.save("driver_report.pdf");
  };

  return (
    <div>
      <h2>Generate Driver Report</h2>
      <div>
        <label>Month:</label>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          placeholder="Enter month (e.g., 12)"
        />
      </div>
      <div>
        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter year (e.g., 2024)"
        />
      </div>
      <button onClick={handleGenerateReport}>Generate Report</button>

      <div>
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
    </div>
  );
};

export default ReportPage;
