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
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => {
        return response.json();
      })
      .then(data => setUserData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [navigate]);

  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <div className="container">
        <h1>About Us</h1>
        <p>Team #: {userData.usertype}</p>
      </div>
    </div>
  );
}

export default withAuthenticator(AboutUs);
