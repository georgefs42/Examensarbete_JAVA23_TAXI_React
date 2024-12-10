import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/admin/driversProfile.css";

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({
    name: "",
    personalNumber: "",
    address: "",
    mobile: "",
    email: "",
    photoUrl: "",
  });
  const [editDriver, setEditDriver] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const navigate = useNavigate(); // Initialize navigate hook

  // Ref for the edit section to scroll into view
  const editSectionRef = React.createRef();

  // Fetch all drivers
  useEffect(() => {
    axios
      .get("http://localhost:8080/drivers")
      .then((response) => setDrivers(response.data))
      .catch((error) => console.error("There was an error fetching the drivers!", error));
  }, []);

  // Handle change for input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver({ ...newDriver, [name]: value });
  };

  // Add new driver
  const handleAddDriver = () => {
    axios
      .post("http://localhost:8080/drivers", newDriver)
      .then((response) => {
        setDrivers([...drivers, response.data]);
        setNewDriver({
          name: "",
          personalNumber: "",
          address: "",
          mobile: "",
          email: "",
          photoUrl: "",
        });
        setSuccessMessage("Driver added successfully!"); // Show success message
        setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
      })
      .catch((error) => console.error("There was an error adding the driver!", error));
  };

  // Edit driver
  const handleUpdateDriver = () => {
    axios
      .put(`http://localhost:8080/drivers/${editDriver.driverId}`, editDriver)
      .then((response) => {
        const updatedDrivers = drivers.map((driver) =>
          driver.driverId === editDriver.driverId ? response.data : driver
        );
        setDrivers(updatedDrivers);
        setEditDriver(null);
        setSuccessMessage("Driver updated successfully!"); // Show success message
        setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
      })
      .catch((error) => console.error("There was an error updating the driver!", error));
  };

  // Delete driver
  const handleDeleteDriver = (id) => {
    axios
      .delete(`http://localhost:8080/drivers/${id}`)
      .then(() => {
        setDrivers(drivers.filter((driver) => driver.driverId !== id));
      })
      .catch((error) => console.error("There was an error deleting the driver!", error));
  };

  // Scroll to edit section when Edit button is clicked
  const handleEditClick = (driver) => {
    setEditDriver(driver);
    // Scroll to the edit section
    editSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Confirm delete action
  const handleConfirmation = (type, id) => {
    setActionType(type);
    setSelectedDriverId(id);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (actionType === "delete") {
      handleDeleteDriver(selectedDriverId);
    }
    setShowConfirmation(false);
  };

  // Scroll to the top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to go back to the previous page
  const handleFinish = () => {
    navigate(-1); // This takes the user back to the previous page
  };

  return (
    <div className="drivers-page">
      <h2>Drivers contact information</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Button to go to top */}
      <button onClick={scrollToTop} className="scroll-to-top-btn">
        ↑ Go to Top
      </button>

      {/* Add Driver Form */}
      <div className="add-driver-section">
        <h3>Add New Driver</h3>
        <form className="driver-form">
          <input
            type="text"
            name="name"
            value={newDriver.name}
            onChange={handleInputChange}
            placeholder="George Youssef"
          />
          <input
            type="text"
            name="personalNumber"
            value={newDriver.personalNumber}
            onChange={handleInputChange}
            placeholder="YYYYMMDD-1234"
          />
          <input
            type="text"
            name="address"
            value={newDriver.address}
            onChange={handleInputChange}
            placeholder="Svalvägen 39, 181 56 Lidingö"
          />
          <input
            type="text"
            name="mobile"
            value={newDriver.mobile}
            onChange={handleInputChange}
            placeholder="0701234567"
          />
          <input
            type="text"
            name="email"
            value={newDriver.email}
            onChange={handleInputChange}
            placeholder="info@georgedev.se"
          />
          <input
            type="text"
            name="photoUrl"
            value={newDriver.photoUrl}
            onChange={handleInputChange}
            placeholder="www.example.se/photo.jpeg"
          />
          <div className="photo-preview-section">
            {newDriver.photoUrl && (
              <div className="photo-preview">
                <img src={newDriver.photoUrl} alt="Photo preview" className="photo-preview-img" />
              </div>
            )}
          </div>
          <button type="button" onClick={handleAddDriver}>
            Add Driver
          </button>
        </form>
      </div>

      {/* Edit Driver Form */}
      <div className="edit-driver-section" ref={editSectionRef}>
        <h3>Edit Driver</h3>
        {editDriver && (
          <form className="driver-form">
            <input
              type="text"
              name="name"
              value={editDriver.name}
              onChange={(e) => setEditDriver({ ...editDriver, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="text"
              name="personalNumber"
              value={editDriver.personalNumber}
              onChange={(e) =>
                setEditDriver({ ...editDriver, personalNumber: e.target.value })
              }
              placeholder="Personal Number"
            />
            <input
              type="text"
              name="address"
              value={editDriver.address}
              onChange={(e) => setEditDriver({ ...editDriver, address: e.target.value })}
              placeholder="Address"
            />
            <input
              type="text"
              name="mobile"
              value={editDriver.mobile}
              onChange={(e) => setEditDriver({ ...editDriver, mobile: e.target.value })}
              placeholder="Mobile"
            />
            <input
              type="text"
              name="email"
              value={editDriver.email}
              onChange={(e) => setEditDriver({ ...editDriver, email: e.target.value })}
              placeholder="Email"
            />
            <input
              type="text"
              name="photoUrl"
              value={editDriver.photoUrl}
              onChange={(e) => setEditDriver({ ...editDriver, photoUrl: e.target.value })}
              placeholder="Photo URL"
            />
            <div className="photo-preview-section">
              {editDriver.photoUrl && (
                <div className="photo-preview">
                  <img src={editDriver.photoUrl} alt="Photo preview" className="photo-preview-img" />
                </div>
              )}
            </div>
            <button type="button" onClick={handleUpdateDriver}>
              Update Driver
            </button>
          </form>
        )}
      </div>

      {/* Driver List */}
      <div className="drivers-list">
        <h3>Driver List</h3>
        <ul>
          {drivers.map((driver) => (
            <li key={driver.driverId}>
              <div>
                <strong>{driver.name}</strong> ({driver.personalNumber}) <br />
                Address: {driver.address}, Mobile: {driver.mobile}, Email: {driver.email}
              </div>
              <button onClick={() => handleEditClick(driver)}>Edit</button>
              <button onClick={() => handleConfirmation('delete', driver.driverId)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Finish Button to go back to the previous page */}
      <button onClick={handleFinish} className="finish-btn">
        Finish
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal active">
          <div className="modal-content">
            <p>Are you sure you want to {actionType} this driver?</p>
            <button className="confirm-btn" onClick={confirmAction}>Confirm</button>
            <button className="cancel-btn" onClick={() => setShowConfirmation(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversPage;
