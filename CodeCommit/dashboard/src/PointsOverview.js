import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import './App.css';

Amplify.configure(config);

function AboutUs() {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();
  const userId = "joelm"; 
  useEffect(() => {
    // Placeholder for the actual user ID fetching logic
    // For example, you might be getting it from the auth session
    // Replace with actual logic to obtain user ID

    if (userId) {
      fetch(`/api/getUserType?user_id=${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setUserType(data.userType); // Assuming the API returns an object with a userType property
        })
        .catch(error => console.error('Error fetching user type:', error));
    }
  }, [navigate, userId]); // If userId is dynamic, it needs to be a state or prop

  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <div className="container">
        <h1>About Us</h1>
        <p>User Type: {userType}</p> {/* Display the fetched user type */}
      </div>
    </div>
  );
}

export default withAuthenticator(AboutUs);
