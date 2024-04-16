import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function SponsorApplications() {

  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [applicationData, setApplicationData] = useState([]);

  useEffect(() => {
    fetch('/api/getUserApplication')
      .then(response => response.json())
      .then(data => {
        setApplicationData(data);
        setHeaders(Object.keys(data[0]));
        setRows(data.map(item => Object.values(item)));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

 const handleAccept = (userId) => {
  fetch('/api/acceptApplication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  })
  .then(response => {
    if (response.ok) {
      // Handle success
      console.log(`Application accepted successfully for user ${userId}.`);
    } else {
      // Handle error
      console.error('Error accepting application:', response.statusText);
    }
  })
  .catch(error => console.error('Error accepting application:', error));
};

const handleDecline = (userId) => {
  fetch('/api/declineApplication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  })
  .then(response => {
    if (response.ok) {
      // Handle success
      console.log(`Application declined successfully for user ${userId}.`);
    } else {
      // Handle error
      console.error('Error declining application:', response.statusText);
    }
  })
  .catch(error => console.error('Error declining application:', error));
};


  return (
    <div>
      <div className="container">
        <h1>Application List</h1>
        <table>
          <thead>
            <tr>
              {headers.map(header => <th key={header}>{header}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                <td>
                  <button onClick={() => handleAccept(row[userIdIndex])}>Accept</button>
                  <button onClick={() => handleDecline(row[userIdIndex])}>Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SponsorApplications;
