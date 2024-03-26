import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { post, get } from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Navbar from './navbar';
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
  const [usersInGroup, setUsersInGroup] = useState([]);

  useEffect(() => {
    fetchUsersInGroup();
  }, []);

  const changeView = (view) => {
    setActiveView(view);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const fetchUsersInGroup = async () => {
    try {
      const apiName = 'AdminQueries';
      const path = '/listUsersInGroup';
      const options = {
        body: {
          groupname: 'Admins'
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
        }
      };
      const response = await post({ apiName, path, options });
      setUsersInGroup(response.data.Users);
    } catch (error) {
      console.error('Failed to fetch users in group:', error);
    }
  };

  const handleAddToGroup = async () => {
    if (!username) {
      setErrorMessage('Username is required.');
      return;
    }

    try {
      const apiName = 'AdminQueries';
      const path = '/addUserToGroup';
      const options = {
        body: {
          username,
          groupname: 'Admins'
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
        }
      };
      await post({ apiName, path, options });
      setSuccessMessage(`User ${username} added to Admins.`);
      setErrorMessage('');
      setUsername('');
      fetchUsersInGroup();
    } catch (error) {
      setErrorMessage('Failed to add user to Admins. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleRemoveFromGroup = async () => {
    if (!username) {
      setErrorMessage('Username is required.');
      return;
    }

    try {
      const apiName = 'AdminQueries';
      const path = '/removeUserFromGroup';
      const options = {
        body: {
          username,
          groupname: 'Admins'
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
        }
      };
      await post({ apiName, path, options });
      setSuccessMessage(`User ${username} removed from Admins.`);
      setErrorMessage('');
      setUsername('');
      fetchUsersInGroup();
    } catch (error) {
      setErrorMessage('Failed to remove user from Admins. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Driver Dashboard</h1>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={handleUsernameChange}
        />
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Points Overview</button>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>
          <button onClick={handleAddToGroup}>Add to Group</button>
          <button onClick={handleRemoveFromGroup}>Remove from Group</button>
        </nav>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
        <h2>Users in Admins Group:</h2>
        <ul>
          {usersInGroup.map((user, index) => (
            <li key={index}>{user.Username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
