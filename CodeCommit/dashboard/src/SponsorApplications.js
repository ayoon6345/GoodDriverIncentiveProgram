import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function SponsorApplications() {
  const [aboutData, setAboutData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        setAboutData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  useEffect(() => {
    fetch('/api/getApplications')
      .then(response => response.json())
      .then(data => {
        console.log("LOGGING APPLICATION DATA");
        console.log(data); // Log the received data
        setApplicationData(data);

        setHeaders(Object.keys(data[0]));
        setRows(data.map(item => Object.values(item)));
        console.log("This worked");
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  console.log("rows and headers");
  console.log(rows);
  console.log(headers);

  return (
    <div>
      <div className="container">
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

export default SponsorApplications;
