import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../css/DriverIncome.css'


const DriverIncome = () => {
  const [newIncome, setNewIncome] = useState({
    date: "",
    dailyIncome: 0.0,
    driverId: 1,  // Default driver ID
  });
  const [calculatedIncome, setCalculatedIncome] = useState(null);
  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncome({ ...newIncome, [name]: value });
  };

  // Calculate income after VAT and profit
  const calculateIncome = () => {
    const { dailyIncome } = newIncome;
    if (dailyIncome > 0) {
      const dailyIncomeAfterVAT = dailyIncome * 0.94; // 6% VAT deduction
      const driverDailyProfit = dailyIncomeAfterVAT * 0.45; // 45% of daily income after VAT
      setCalculatedIncome({ dailyIncomeAfterVAT, driverDailyProfit });
    } else {
      alert("Please enter a valid daily income.");
    }
  };

  // Send the POST request to the backend
  const handleSubmit = () => {
    // Show message indicating the request is being sent
    setMessage("Sending income data to the API...");

    // Prepare the data for the API request
    const incomeData = {
      date: newIncome.date,
      dailyIncome: newIncome.dailyIncome,
      driver: {
        driverId: newIncome.driverId,  // Pass the driver ID
      },
    };

    // Send the request to the backend
    axios
      .post("http://localhost:8080/driver-income", incomeData)
      .then((response) => {
        console.log("Income added:", response.data);
        setMessage("Income data successfully sent to the API!");
        // Reset form and state after success
        setNewIncome({ date: "", dailyIncome: 0.0, driverId: 1 });
        setCalculatedIncome(null);
      })
      .catch((error) => {
        console.error("Error adding income:", error);
        setMessage("Error occurred while sending the income data.");
      });
  };

  return (
    <div>
      <h2>Driver Income Management</h2>
      
      {/* Form Section */}
      <div>
        <h3>Insert Income Details</h3>
        <div>
          <label>Driver ID:</label>
          <input
            type="number"
            name="driverId"
            value={newIncome.driverId}
            onChange={handleInputChange}
            placeholder="Enter Driver ID"
          />
        </div>

        <div>
          <label>Income Date:</label>
          <input
            type="date"
            name="date"
            value={newIncome.date}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Daily Income (before VAT):</label>
          <input
            type="number"
            name="dailyIncome"
            value={newIncome.dailyIncome}
            onChange={handleInputChange}
            placeholder="Enter Daily Income"
          />
        </div>

        <button onClick={calculateIncome}>Calculate Income</button>
      </div>

      {/* Calculated Details */}
      {calculatedIncome && (
        <div>
          <h3>Calculated Income Details:</h3>
          <p><strong>Daily Income After VAT:</strong> {calculatedIncome.dailyIncomeAfterVAT.toFixed(2)}</p>
          <p><strong>Driver's Daily Profit:</strong> {calculatedIncome.driverDailyProfit.toFixed(2)}</p>
        </div>
      )}

      {/* Confirmation and Submit */}
      <button onClick={handleSubmit}>Confirm and Send to API</button>

      {/* API Request Status Message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DriverIncome;
