import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import './App.css';

Amplify.configure(config);

function PointsOverview() {
  const [aboutData, setAboutData] = useState({});

  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => {
        return response.json();
      })
      .then(data => setAboutData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Removed 'navigate' dependency since it's not defined

  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <div className="container">
        <h1>Users</h1>
        {/* Iterate over each user in aboutData array */}
        {aboutData.map(user => (
          <div key={user.user_id}>
            <p>User ID: {user.user_id}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone Number: {user.phone_number}</p>
            <p>User Type: {user.usertype}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PointsOverview;
