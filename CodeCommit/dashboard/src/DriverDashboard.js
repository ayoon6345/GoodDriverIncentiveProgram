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
  const [username, setUsername] = useState('');
  const [activeView, setActiveView] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

//add users to group
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
      setSuccessMessage(`User ${username} added to Admins.`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add user to Admins. Please try again.');
      setSuccessMessage('');
    }
  }

//remove users from group
async function removeFromGroup() {
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
      setErrorMessage('Failed to add user to group. Please try again.');
      setSuccessMessage('');
    }
  }


const listAll = async (limit = 25) => {
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
      .then(response => {
        return response.response;
      })
      .then(result => {
        return result.body.json();
      })
      .then((data) => {
        setUsers(data.Users);
      });
  }, []);

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
          <button onClick={removeFromGroup}>Remove from Group</button>
        </nav>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
        <div>
          <h2>Users</h2>
          <ul>
            {users.map(user => (
              <li key={user.username}>{user.username}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;