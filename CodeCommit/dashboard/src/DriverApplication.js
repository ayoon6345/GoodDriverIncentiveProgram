import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });

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
    setUpdateStatus(successStatus);
    localStorage.setItem('updateStatus', JSON.stringify(successStatus)); // Persist the success status
    fetchUserData(); // Refetch user data only on success
  })
  .catch(error => {
    console.error('Error submitting application:', error);
    // Determine if error is an object (from JSON) or text, and set message accordingly
    const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error submitting application' };
    setUpdateStatus(errorMessage);
    localStorage.setItem('updateStatus', JSON.stringify(errorMessage)); // Persist the error status
  });
};

submitApplication( '789', '123', 'Justin', 'Smith', '4103028154', 'email@email.com');

function DriverApplication() {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Applications</h1>
      </div>
    </div>
  );
}

export default DriverApplication;