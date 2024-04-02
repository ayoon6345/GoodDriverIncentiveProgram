import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react'; // Import Auth for getCurrentUser
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import './App.css';

Amplify.configure(config);

function AboutUs() {
  const [userType, setUserType] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await Auth.getCurrentUser(); // Use getCurrentUser
        setUsername(user.username);
        const userId = user.username; // Assuming username is the user_id
        const response = await fetch(`/api/getUserType?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserType(data.userType);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>About Us</h1>
        <p>User Name: {username}</p>
        <p>User Type: {userType}</p>
      </div>
    </div>
  );
}

export default withAuthenticator(AboutUs);
