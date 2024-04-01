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
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
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





  async function createUser() {
    try {
      let apiName = 'AdminQueries';
      let path = '/createUser';
      let options = {
        body: {
          "username": username,
          "password": password,
          "email": email
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
        }
      }
      await post({ apiName, path, options });
      setSuccessMessage(`User ${username} added successfully.`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add user. Please try again.');
      setSuccessMessage('');
    }
  }




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

     async function enableUser(username) {
    try {
      let apiName = 'AdminQueries';
      let path = '/enableUser';
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
      setSuccessMessage(`User ${username} has been enabled`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to enable user. Please try again.');
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


        </nav>
         <form onSubmit={createUser}>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Create User</button>
        </form>
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
                  <div>Name: {user.Attributes.find(attr => attr.Name === 'name')?.Value}</div>
                  {user.Attributes.map((attribute, attrIndex) => (
                    <div key={attrIndex}>
                      {attribute.Name === 'phone_number' && <div>Phone Number: {attribute.Value}</div>}
                      {attribute.Name === 'email' && <div>Email: {attribute.Value}</div>}
                    </div>
                  ))}
                  <div>User Status: {user.UserStatus}</div>
                  <div>Enabled: {user.Enabled ? 'Yes' : 'No'}</div> {/* Display Yes or No based on the value */}
                  <div>User Create Date: {user.UserCreateDate}</div>
                  <div>User Last Modified Date: {user.UserLastModifiedDate}</div>
                  <button onClick={() => addToGroup(user.Username)}>Add to Admins</button>
                  <button onClick={() => removeFromGroup(user.Username)}>Remove from Admins</button>
                  <button onClick={() => disableUser(user.Username)}>Disable User</button>
                  <button onClick={() => enableUser(user.Username)}>Enable User</button>

                </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
