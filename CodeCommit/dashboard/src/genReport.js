import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import './App.css';
Amplify.configure(config);

function Report() {
  const [userData, setUserData] = useState(null);
  
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/getUsers');
      const data = await response.json();
      console.log('Fetched data:', data); // Log fetched data
      setUserData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchUserData();
}, []);


  return (
    <div>
      <div className="container">
        <h1>Users</h1>
        {userData && (
          <div>
            <p>Name: {userData.name}</p>
            <p>UserName: {userData.user_id}</p>
            <p>Email: {userData.email}</p>
            <p>Phone Number: {userData.phone_number}</p>
            <p>User Type: {userData.usertype}</p>
            <p>Your Sponsor is : {userData.sponsor}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Report;
