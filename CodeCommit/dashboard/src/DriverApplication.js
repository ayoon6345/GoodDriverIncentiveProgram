import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);


const submitApplication = (sponsorId, driverId, firstName, lastName, phone, email) => {
  fetch('/api/addApplication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sponsorId, driverId, firstName, lastName, phone, email }),
  })
  .then(response => {
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(data => Promise.reject(data));
      } else {
        return response.text().then(text => Promise.reject(text));
      }
    }
    return contentType && contentType.indexOf("application/json") !== -1
      ? response.json()
      : response.text();
  })
  .then(data => {
    console.log('Submission response:', data);
    const successStatus = { success: true, message: 'Points updated successfully.' };
  })
  .catch(error => {
    console.error('Error submitting application:', error);
    // Determine if error is an object (from JSON) or text, and set message accordingly
    const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error submitting application' };
  });
};

//submitApplication( '789', '123', 'Justin', 'Smith', '4103028154', 'email@email.com');

function DriverApplication() {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    sponsorId: '',
    driverId: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the received data
        setAboutData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { sponsorId, driverId, firstName, lastName, phone, email } = formData;
    submitApplication(sponsorId, driverId, firstName, lastName, phone, email);
  };

  function submitApplication(sponsorId, driverId, firstName, lastName, phone, email) {
    // Implementation of submitApplication function
    console.log('Submitting application with the following data:', { sponsorId, driverId, firstName, lastName, phone, email });
    // Add your fetch logic here
  }

  return (
    <div>
      <div className="container">
        <h1>Applications</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            name="sponsorId"
            value={formData.sponsorId}
            onChange={handleChange}
            placeholder="Sponsor ID"
            required
          />
          <input 
            type="text"
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            placeholder="Driver ID"
            required
          />
          <input 
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input 
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          <input 
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <button type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export default DriverApplication;