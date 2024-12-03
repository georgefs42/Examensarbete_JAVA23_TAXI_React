import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Drivers.css"

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({
    name: "",
    personalNumber: "",
    address: "",
    mobile: "",
    email: "",
    photo: null,
  });
  const [editDriver, setEditDriver] = useState(null);

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
          photo: null,
        });
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

  return (
    <div>
      <Header />
      <h2>Drivers</h2>
      <div>
        <h3>Add New Driver</h3>
        <input
          type="text"
          name="name"
          value={newDriver.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="personalNumber"
          value={newDriver.personalNumber}
          onChange={handleInputChange}
          placeholder="Personal Number"
        />
        <input
          type="text"
          name="address"
          value={newDriver.address}
          onChange={handleInputChange}
          placeholder="Address"
        />
        <input
          type="text"
          name="mobile"
          value={newDriver.mobile}
          onChange={handleInputChange}
          placeholder="Mobile"
        />
        <input
          type="text"
          name="email"
          value={newDriver.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <button onClick={handleAddDriver}>Add Driver</button>
      </div>

      <div>
        <h3>Edit Driver</h3>
        {editDriver && (
          <div>
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
              onChange={(e) => setEditDriver({ ...editDriver, personalNumber: e.target.value })}
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
            <button onClick={handleUpdateDriver}>Update Driver</button>
          </div>
        )}
      </div>

      <div>
        <h3>Driver List</h3>
        <ul>
          {drivers.map((driver) => (
            <li key={driver.driverId}>
              {driver.name} - {driver.personalNumber}
              <button onClick={() => setEditDriver(driver)}>Edit</button>
              <button onClick={() => handleDeleteDriver(driver.driverId)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default DriversPage;
