import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { get } from 'aws-amplify/api';
import './App.css';
Amplify.configure(config);

function Report() {
  const [applicationData, setApplicationData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);

  async function listAll(limit = 25) {
    try {
      const apiName = 'AdminQueries';
      const path = '/listUsers';
      const options = {
        queryStringParameters: { limit: limit },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`,
        },
      };
      const response = await get({ apiName, path, options });
      return response;
    } catch (error) {
      console.error('Failed to list users:', error);
      throw error;
    }
  }

  useEffect(() => {
    listAll()
      .then((response) => response.response)
      .then((result) => result.body.json())
      .then((data) => {
        setUsers(data.Users);
      })
      .catch((error) => console.error('Error:', error));
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

  // Function to convert data to CSV format
  function convertToCSV(data) {
    const csvContent = "data:text/csv;charset=utf-8," +
      data.map(row => row.join(",")).join("\n");
    return encodeURI(csvContent);
  }

  // Event handler for the "Save as .csv" button
  function handleDownloadCSV() {
    const csvData = convertToCSV([headers, ...rows]);
    const link = document.createElement('a');
    link.setAttribute('href', csvData);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div>
      <div className="container">
        <div>
          <h2>Users:</h2>
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                <div>Username: {user.Username}</div>
                <div>Name: {user.Attributes.find((attr) => attr.Name === 'name')?.Value}</div>
                {user.Attributes.map((attribute, attrIndex) => (
                  <div key={attrIndex}>
                    {attribute.Name === 'phone_number' && <div>Phone Number: {attribute.Value}</div>}
                    {attribute.Name === 'email' && <div>Email: {attribute.Value}</div>}
                  </div>
                ))}
                <div>User Status: {user.UserStatus}</div>
                <div>Enabled: {user.Enabled ? 'Yes' : 'No'}</div>
                <div>User Create Date: {user.UserCreateDate}</div>
                <div>User Last Modified Date: {user.UserLastModifiedDate}</div>
              </li>
            ))}
          </ul>
        </div>

        <h1>Application List</h1>
        <button onClick={handleDownloadCSV}>Save as .csv</button>
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
