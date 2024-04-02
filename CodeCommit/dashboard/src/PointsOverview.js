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
      .then(data => {
        console.log(data); // Log the received data
        setAboutData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Users</h1>
        {Array.isArray(aboutData) ? (
          aboutData.map(user => (
            <div key={user.user_id}>
              <p>User ID: {user.user_id}</p>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Phone Number: {user.phone_number}</p>
              <p>User Type: {user.usertype}</p>
            </div>
          ))
        ) : (
          <div>
            <p>User ID: {aboutData.user_id}</p>
            <p>Name: {aboutData.name}</p>
            <p>Email: {aboutData.email}</p>
            <p>Phone Number: {aboutData.phone_number}</p>
            <p>User Type: {aboutData.usertype}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PointsOverview;
