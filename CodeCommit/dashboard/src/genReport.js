import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function Report() {
const [aboutData, setAboutData] = useState([]);


  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        setAboutData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  return (
    <div>
      <div className="container">
        <h1>Users</h1>
          <div>
            <p>Name: {name}</p>
            <p>UserName: {user_id}</p>
            <p>Email: {email}</p>
            <p>Phone Number: {phone_number}</p>
            <p>User Type: {usertype}</p>
           <p>Your Sponsor is : {sponsor}</p>
          </div>
      </div>
    </div>
  );
}

export default Report;
