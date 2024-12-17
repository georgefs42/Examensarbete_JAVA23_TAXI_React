import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import '../../css/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const welcomeText = 'Welcome Admin !';
  const questionText = "What do you want to do?";
  const options = [
    'Add Driver',
    "Get Driver's Monthly Report",
    "Create Driver's Salary Report",
    'Calculate Tax' // New option
  ];

  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  // Animate Welcome Admin text
  useEffect(() => {
    if (currentIndex < welcomeText.length) {
      const timer = setTimeout(() => {
        setText((prev) => prev + welcomeText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 150);
      return () => clearTimeout(timer); // Cleanup timer on each render
    }
  }, [currentIndex]);

  // Handle the navigation based on the option clicked
  const handleNavigation = (option) => {
    switch (option) {
      case 'Add Driver':
        navigate('/admin/DriverProfile');
        break;
      case "Get Driver's Monthly Report":
        navigate('/admin/DriverMonthlyReports');
        break;
      case "Create Driver's Salary Report":
        navigate('/admin/DriverSalaryReport');
        break;
      case 'Calculate Tax':
        window.open('https://www7.skatteverket.se/portal/inkomst-efter-skatt-se-tabell?pk_vid=e15bfca2df83e8141734294052c71015', '_blank'); // Open in new tab
        break;
      default:
        break;
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="animated-text">{text}</h1>
      {currentIndex === welcomeText.length && (
        <div className="question-section">
          <h2>{questionText}</h2>
          <ul className="options-list">
            {options.map((option, index) => (
              <li key={index} className="option" onClick={() => handleNavigation(option)}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
