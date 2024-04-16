import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { post, get } from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Navbar from './navbar';
import './App.css';
import Report from './genReport';
import AdminCreate from './adminCreateUser';


import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userType, setusertype] = useState('driver');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [sponsor, setsponsorname] = useState('amazon');


const changeView = (view) => {
    setActiveView(view);
  };

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



  async function removeFromGroup(username) {
    try {
      const apiName = 'AdminQueries';
      const path = '/removeUserFromGroup';
      const options = {
        body: {
          username: username,
          groupname: 'Admins',
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`,
        },
      };
      await post({ apiName, path, options });
      setSuccessMessage(`User ${username} removed from Admins.`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to remove user from group. Please try again.');
      setSuccessMessage('');
    }
  }

  async function disableUser(username) {
    try {
      const apiName = 'AdminQueries';
      const path = '/disableUser';
      const options = {
        body: {
          username: username,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`,
        },
      };
      await post({ apiName, path, options });
      setSuccessMessage(`User ${username} disabled`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to disable user. Please try again.');
      setSuccessMessage('');
    }
  }

  async function enableUser(username) {
    try {
      const apiName = 'AdminQueries';
      const path = '/enableUser';
      const options = {
        body: {
          username: username,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`,
        },
      };
      await post({ apiName, path, options });
      setSuccessMessage(`User ${username} has been enabled`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to enable user. Please try again.');
      setSuccessMessage('');
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Admin Dashboard</h1>
          <button onClick={() => changeView('report')}>Audit Log</button>
           <button onClick={() => changeView('admincreate')}>Create A User</button>
          <label>Username:</label>
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
                <button onClick={() => removeFromGroup(user.Username)}>Remove from Admins</button>
                <button onClick={() => disableUser(user.Username)}>Disable User</button>
                <button onClick={() => enableUser(user.Username)}>Enable User</button>
              </li>
            ))}
          </ul>
        </div>
           {activeView === 'report' && <Report />}
           {activeView === 'admincreate' && <AdminCreate />}

    </div>
  );
}

export default withAuthenticator(DriverDashboard);
