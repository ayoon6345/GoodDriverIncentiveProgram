import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import './App.css';


Amplify.configure(config);

function getUsers() {
  const [aboutData, setAboutData] = useState({});

  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => {
        return response.json();
      })
      .then(data => setAboutData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [navigate]);

  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <div className="container">
        <h1>Users</h1>
        <p>Team #: {aboutData.user_id}</p>
        <p>Version #: {aboutData.name}</p>
        <p>Release Date: {aboutData.email}</p>
        <p>Product Name: {aboutData.phone_number}</p>
        <p>Product Description: {aboutData.usertype}</p>
      </div>
    </div>
  );
}

export default (getUsers);
