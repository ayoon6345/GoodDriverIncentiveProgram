import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { post, get } from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Navbar from './navbar'; // Import the Navbar component
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');
  const [username, setUsername] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);

  const changeView = (view) => {
    setActiveView(view);
  };

  async function listAll(limit = 25) {
    let apiName = 'AdminQueries';
    let path = '/listUsers';
    let options = {
      queryStringParameters: {
        "limit": limit,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
      }
    }
    const response = await get({ apiName, path, options });
    return response;
  }

  useEffect(() => {
    listAll()
      .then(response => response.response)
      .then(result => result.body.json())
      .then((data) => {
        setUsers(data.Users);
      });
  }, []);

  async function addToGroup(username) {
    try {
      let apiName = 'AdminQueries';
      let path = '/addUserToGroup';
      let options = {
        body: {
          "username": username,
          "groupname": "Admins"
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
        }
      }
      await post({ apiName, path, options });
      setSuccessMessage(`User ${username} added to Admins.`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add user to Admins. Please try again.');
      setSuccessMessage('');
    }
  }

  async function removeFromGroup(username) {
    try {
      let apiName = 'AdminQueries';
      let path = '/removeUserFromGroup';
      let options = {
        body: {
          "username": username,
          "groupname": "Admins"
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
        }
      }
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
      let apiName = 'AdminQueries';
      let path = '/disableUser';
      let options = {
        body: {
          "username": username,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
        }
      }
      await post({ apiName, path, options });
      setSuccessMessage(`User ${username} disabled`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to disable user. Please try again.');
      setSuccessMessage('');
    }
  }

  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <div className="container">
        <h1>Driver Dashboard</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Points Overview</button>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>

          <button onClick={listAll}>List All</button>
        </nav>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
        <div>
          <h2>Users:</h2>
            <ul>
              {users.map((user, index) => (
                <li key={index}>
                  <div>Username: {user.Username}</div>
                  {user.Attributes.map((attribute, attrIndex) => (
                    <div key={attrIndex}>
                      {attribute.Name === 'phone_number' && <div>Phone Number: {attribute.Value}</div>}
                      {attribute.Name === 'email' && <div>Email: {attribute.Value}</div>}
                    </div>
                  ))}
                  <div>User Status: {user.UserStatus}</div>
                  <div>Enabled: {user.Enabled}</div>
                  <div>User Create Date: {user.UserCreateDate}</div>
                  <div>User Last Modified Date: {user.UserLastModifiedDate}</div>
                  <button onClick={() => addToGroup(user.Username)}>Add to Group</button>
                  <button onClick={() => removeFromGroup(user.Username)}>Remove from Group</button>
                  <button onClick={() => disableUser(user.Username)}>Disable User</button>
                </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
