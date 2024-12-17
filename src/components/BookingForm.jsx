import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer, Autocomplete } from '@react-google-maps/api';
import '../css/home/BookingForm.css';

const googleMapsApiKey = 'AIzaSyBwCKoA7Kag_0I3R7zh26vYasIRh70LM34';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    pickupAddress: '',
    extraAddress: '',
    dropOffAddress: '',
    date: '', // New state for the booking date
    time: '', // New state for the booking time
  });

  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [price, setPrice] = useState(null);
  const [directions, setDirections] = useState(null);

  const [pickupLatLng, setPickupLatLng] = useState(null);
  const [dropOffLatLng, setDropOffLatLng] = useState(null);
  const [extraAddressLatLng, setExtraAddressLatLng] = useState(null);

  const [mapCenter, setMapCenter] = useState({
    lat: 59.3293, // Stockholm's latitude
    lng: 18.0686, // Stockholm's longitude
  });

  const [bookingStatus, setBookingStatus] = useState(null);

  const formRef = useRef(null);

  const calculatePrice = (distanceKm, durationMin) => {
    const baseFee = 68; // SEK
    const costPerKm = 20; // SEK per km
    const costPerHour = 775; // SEK per hour
    const bookingFee = 50; // SEK

    const distanceCost = distanceKm * costPerKm;
    const durationCost = (durationMin / 60) * costPerHour;

    const totalPrice = baseFee + distanceCost + durationCost + bookingFee;
    return totalPrice;
  };

  useEffect(() => {
    if (pickupLatLng && dropOffLatLng) {
      const directionsService = new window.google.maps.DirectionsService();
      const request = {
        origin: pickupLatLng,
        destination: dropOffLatLng,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          const distanceKm = result.routes[0].legs[0].distance.value / 1000; // in km
          const durationMin = result.routes[0].legs[0].duration.value / 60; // in minutes
          setDistance(distanceKm);
          setDuration(durationMin);
          setPrice(calculatePrice(distanceKm, durationMin));
        } else {
          alert('Error calculating directions: ' + status);
        }
      });
    }
  }, [pickupLatLng, dropOffLatLng]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAutocomplete = (type, address) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK') {
        const latLng = results[0].geometry.location;
        if (type === 'pickup') {
          setPickupLatLng(latLng);
        } else if (type === 'dropoff') {
          setDropOffLatLng(latLng);
        } else if (type === 'extra') {
          setExtraAddressLatLng(latLng);
        }
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupLatLng || !dropOffLatLng) {
      alert('Please provide valid pickup and dropoff locations');
      return;
    }

    const bookingData = {
      ...formData,
      distance: distance,
      duration: duration,
      price: price,
    };

    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const responseText = await response.text(); // Get raw response text

      // Log the raw response for debugging
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      // Attempt to parse the response as JSON
      try {
        const data = JSON.parse(responseText);
        setBookingStatus(`Booking confirmed! ID: ${data.id}`);
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        setBookingStatus(`Error: Received an invalid response from the server`);
      }

      // Optionally reset the form here after successful booking
      resetForm();

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setBookingStatus(`Error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      pickupAddress: '',
      extraAddress: '',
      dropOffAddress: '',
      date: '', // Reset date
      time: '', // Reset time
    });
    setPickupLatLng(null);
    setDropOffLatLng(null);
    setExtraAddressLatLng(null);
    setDistance(null);
    setDuration(null);
    setPrice(null);
    setDirections(null);
  };

  const handleModify = () => {
    formRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancel = () => {
    resetForm();
    setBookingStatus(null);
  };

  return (
    <div className="booking-form-container">
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}>
        <div className="booking-form-wrapper">
          <div className="booking-form-left" ref={formRef}>
            <form onSubmit={handleSubmit}>
              <h2>Taxi Booking</h2>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Mobile:</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Pickup Address:</label>
                <Autocomplete onPlaceChanged={() => handleAutocomplete('pickup', formData.pickupAddress)}>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    required
                    placeholder="Pickup address"
                  />
                </Autocomplete>
              </div>
              <div>
                <label>Extra Address (Optional):</label>
                <Autocomplete onPlaceChanged={() => handleAutocomplete('extra', formData.extraAddress)}>
                  <input
                    type="text"
                    name="extraAddress"
                    value={formData.extraAddress}
                    onChange={handleInputChange}
                    placeholder="Extra address (optional)"
                  />
                </Autocomplete>
              </div>
              <div>
                <label>Dropoff Address:</label>
                <Autocomplete onPlaceChanged={() => handleAutocomplete('dropoff', formData.dropOffAddress)}>
                  <input
                    type="text"
                    name="dropOffAddress"
                    value={formData.dropOffAddress}
                    onChange={handleInputChange}
                    required
                    placeholder="Dropoff address"
                  />
                </Autocomplete>
              </div>
              
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label>Time:</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {distance !== null && (
                <div>
                  <h3>Booking Details:</h3>
                  <p>Distance: {distance.toFixed(2)} km</p>
                  <p>Duration: {duration.toFixed(0)} min</p>
                  <p>Price: {price.toFixed(2)} SEK</p>
                </div>
              )}

              <div>
                <button type="submit">Book Now</button>
              </div>
            </form>
            {bookingStatus && <p>{bookingStatus}</p>}
            <div className="modify-buttons">
              <button type="button" onClick={handleModify}>Modify</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </div>

          <div className="booking-form-right">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={12}
            >
              {pickupLatLng && <Marker position={pickupLatLng} />}
              {dropOffLatLng && <Marker position={dropOffLatLng} />}
              {extraAddressLatLng && <Marker position={extraAddressLatLng} />}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>
        </div>
      </LoadScript>
    </div>
  );
};

export default BookingForm;
