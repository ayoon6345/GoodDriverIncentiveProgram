import React, { useState, useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { get } from 'aws-amplify/api';
import './App.css';
Amplify.configure(config);

function Report() {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState([]);

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
        const userData = data.Users.map((user) => {
          return {
            username: user.Username,
            name: user.Attributes.find((attr) => attr.Name === 'name')?.Value || '',
            phoneNumber: user.Attributes.find((attr) => attr.Name === 'phone_number')?.Value || '',
            email: user.Attributes.find((attr) => attr.Name === 'email')?.Value || '',
            userStatus: user.UserStatus,
            enabled: user.Enabled ? 'Yes' : 'No',
            userCreateDate: user.UserCreateDate,
            userLastModifiedDate: user.UserLastModifiedDate,
          };
        });
        setUserData(userData);
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
              <div><strong>Name:</strong> {user.Attributes.find((attr) => attr.Name === 'name')?.Value}</div>
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

      <div className="chart-container">
        <h2>User Status Distribution:</h2>
        <div className="bar-graph">
          {userData.map((user, index) => (
            <div key={index} className="bar" style={{ height: '20px', width: user.enabled === 'Yes' ? '200px' : '100px' }}>
              {user.username} - {user.enabled}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Report;
