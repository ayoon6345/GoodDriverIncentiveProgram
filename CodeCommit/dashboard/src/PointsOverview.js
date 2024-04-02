
import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import './App.css';

Amplify.configure(config);

function AboutUs() {
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const userId = "joelm"; // Assuming userId is static for this example

    fetch(`/api/getUserType?user_id=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        setUserType(data);
      })
      .catch(error => console.error('Error fetching user type:', error));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>About Us</h1>
        <p>User Type: {userType}</p>
      </div>
    </div>
  );
}

export default withAuthenticator(AboutUs);