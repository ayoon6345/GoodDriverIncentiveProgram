import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
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
  const [userStatusCounts, setUserStatusCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');

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
        const counts = data.Users.reduce((acc, user) => {
          acc[user.UserStatus] = acc[user.UserStatus] ? acc[user.UserStatus] + 1 : 1;
          return acc;
        }, {});
        setUserStatusCounts(counts);
        updateChart(users);
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

  useEffect(() => {
    const filteredUsers = users.filter(user => {
      const fullName = user.Attributes.find(attr => attr.Name === 'name')?.Value || '';
      const email = user.Attributes.find(attr => attr.Name === 'email')?.Value || '';
      return fullName.toLowerCase().includes(searchQuery.toLowerCase()) || email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const finalUsers = filter ? filteredUsers.filter(user => user.UserStatus === filter) : filteredUsers;

    updateChart(finalUsers);
  }, [searchQuery, filter]);

   function convertToCSV(headers, rows, users) {
    const userHeaders = ['Username', 'Name', 'Phone Number', 'Email', 'User Status', 'Enabled', 'User Create Date', 'User Last Modified Date'];
    const userData = users.map(user => [
      user.Username,
      user.Attributes.find(attr => attr.Name === 'name')?.Value || '',
      user.Attributes.find(attr => attr.Name === 'phone_number')?.Value || '',
      user.Attributes.find(attr => attr.Name === 'email')?.Value || '',
      user.UserStatus,
      user.Enabled ? 'Yes' : 'No',
      user.UserCreateDate,
      user.UserLastModifiedDate
    ]);
    const csvContent = "data:text/csv;charset=utf-8," +
      [headers, ...rows, userHeaders, ...userData].map(row => row.join(",")).join("\n");
    return encodeURI(csvContent);
  }


  function handleDownloadCSV() {
    const csvData = convertToCSV(headers, rows, users);
    const link = document.createElement('a');
    link.setAttribute('href', csvData);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
  }

  function updateChart(filteredUsers) {
    const counts = filteredUsers.reduce((acc, user) => {
      acc[user.UserStatus] = acc[user.UserStatus] ? acc[user.UserStatus] + 1 : 1;
      return acc;
    }, {});
    const ctx = document.getElementById('userStatusChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: 'User Counts per Status',
          data: Object.values(counts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  return (
    <div className="report-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          {Object.keys(userStatusCounts).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="users-section">
        <h2>Users:</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              <div><strong>Username:</strong> {user.Username}</div>
              <div><strong>Name:</strong> {user.Attributes.find(attr => attr.Name === 'name')?.Value}</div>
              {user.Attributes.map((attribute, attrIndex) => (
                <div key={attrIndex}>
                  {attribute.Name === 'phone_number' && <div><strong>Phone Number:</strong> {attribute.Value}</div>}
                  {attribute.Name === 'email' && <div><strong>Email:</strong> {attribute.Value}</div>}
                </div>
              ))}
              <div><strong>User Status:</strong> {user.UserStatus}</div>
              <div><strong>Enabled:</strong> {user.Enabled ? 'Yes' : 'No'}</div>
              <div><strong>User Create Date:</strong> {user.UserCreateDate}</div>
              <div><strong>User Last Modified Date:</strong> {user.UserLastModifiedDate}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="applications-section">
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

      <div className="chart-section">
        <h2>User Status Chart</h2>
        <canvas id="userStatusChart"></canvas>
      </div>

      <button onClick={handleDownloadCSV}>Save as .csv</button>
    </div>
  );
}

export default Report;
