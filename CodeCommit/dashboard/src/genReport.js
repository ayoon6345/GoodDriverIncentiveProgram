import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import './App.css';
Amplify.configure(config);

function Report() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUsers');
        const data = await response.json();
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
        {userData.map((user, index) => (
          <div key={index}>
            <p>Name: {user.name}</p>
            <p>UserName: {user.user_id}</p>
            <p>Email: {user.email}</p>
            <p>Phone Number: {user.phone_number}</p>
            <p>User Type: {user.usertype}</p>
            <p>Your Sponsor is : {user.sponsor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Report;
