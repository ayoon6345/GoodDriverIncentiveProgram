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
  const [userStatusCounts, setUserStatusCounts] = useState({});

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
        const statusCounts = data.Users.reduce((acc, user) => {
          acc[user.UserStatus] = (acc[user.UserStatus] || 0) + 1;
          return acc;
        }, {});
        setUserStatusCounts(statusCounts);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className="report-container">
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

      <div className="bar-graph">
        <h2>User Status Counts</h2>
        <div className="bar-container">
          {Object.entries(userStatusCounts).map(([status, count]) => (
            <div key={status} className="bar">
              <div className="bar-label">{status}</div>
              <div className="bar-inner" style={{ width: `${(count / users.length) * 100}%` }}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Report;
