import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { get } from 'aws-amplify/api';
import { Bar, Pie } from 'react-chartjs-2'; // Importing chart components
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

  // Data for bar chart
  const barChartData = {
    labels: headers,
    datasets: [
      {
        label: 'Application Data',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: rows[0] // Assuming the first row contains numerical data
      }
    ]
  };

  // Data for pie chart
  const pieChartData = {
    labels: headers,
    datasets: [
      {
        data: rows[0], // Assuming the first row contains numerical data
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#8A2BE2',
          '#20B2AA'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#8A2BE2',
          '#20B2AA'
        ]
      }
    ]
  };

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

        {/* Bar chart */}
        <div>
          <h2>Bar Chart</h2>
          <Bar
            data={barChartData}
            options={{
              title:{
                display:true,
                text:'Application Data',
                fontSize:20
              },
              legend:{
                display:true,
                position:'right'
              }
            }}
          />
        </div>

        {/* Pie chart */}
        <div>
          <h2>Pie Chart</h2>
          <Pie
            data={pieChartData}
            options={{
              title:{
                display:true,
                text:'Application Data',
                fontSize:20
              },
              legend:{
                display:true,
                position:'right'
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Report;
