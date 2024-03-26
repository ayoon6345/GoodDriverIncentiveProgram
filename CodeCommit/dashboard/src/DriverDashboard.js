import React, { useState } from 'react';
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

  const changeView = (view) => {
    setActiveView(view);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  async function addToGroup() {
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
      setSuccessMessage(`User ${username} added to group.`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add user to group. Please try again.');
      setSuccessMessage('');
    }
  }


async function listAdmins(limit){
  let apiName = 'AdminQueries';
  let path = '/listUsersInGroup';
  let options = { 
      query: {
        "groupname": "Admins",
        "limit": limit,
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
      }
  }
  const response = await get({apiName, path, options});
  return response;
}

  
  

  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
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
          <button onClick={addToGroup}>Add to Group</button>
          <button onClick={() => listAdmins(10)}>List Admins</button>

        </nav>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
      </div>
    </div>
  );
}

export default withAuthenticator (DriverDashboard);
