import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import './App.css';
Amplify.configure(config);

function Report() {
  const [userData, setUserData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);

  
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

    useEffect(() => {
    fetch('/api/getApplications')
      .then(response => response.json())
      .then(data => {
        setApplicationData(data);

        setHeaders(Object.keys(data[0]));
        setRows(data.map(item => Object.values(item)));
      })
      .catch(error => console.error('Error fetching data:', error));
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
        <h1>Applications</h1>

         <h1>Application List</h1>
        <table>
        <thead>
            <tr>
            {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
        </thead>
        <tbody>
            {rows.map((row, index) => (
            <tr key={index}>
                {row.map((cell, index) => <td key={index}>{cell}</td>)}
            </tr>
            ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default Report;
