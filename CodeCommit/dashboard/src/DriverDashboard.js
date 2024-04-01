import React, { useState, useEffect } from 'react';
import {Container, Row, Col} from "react-bootstrap";
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
  const [name, setName] = useState(''); // Add name state
  const [userType, setusertype] = useState('driver'); // Default value: sponsor
  const [phoneNumber, setPhoneNumber] = useState(''); // Add phoneNumber state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);
 
 const changeView = (view) => {
    setActiveView(view);
  };

  useEffect(() => {
    async function fetchUserType() {
      try {
        const response = await fetch(`/api/getUserType?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setusertype(data.userType);
        } else {
          console.error('Failed to fetch user type');
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    }

    fetchUserType();
  }, [username]);


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

  async function createUser(event) {
  event.preventDefault(); // Prevent the default form submission

  try {
    // Create user in AWS Cognito
    let apiName = 'AdminQueries';
    let path = '/createUser';
    let options = {
      body: {
        "username": username,
        "password": password,
        "email": email,
        "name": name, // Add name field
        "phone_number": phoneNumber, // Add phone_number field
        "userType": userType
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await fetchAuthSession()).tokens.accessToken}`
      }
    };
    await post({ apiName, path, options });

    // Add the user to the MySQL database
    const response = await fetch('/api/createUserInMySQL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: username,
        email: email,
        name: name,
        phone_number: phoneNumber,
        userType: userType // Include user type
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add user to MySQL database');
    }

    // Automatically add user to Admins group if userType is Admin
    if (userType === 'admin') {
      await addToGroup(username);
    }

    setSuccessMessage('User created successfully');
    setErrorMessage('');
  } catch (error) {
    console.error('Failed to add user:', error);
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
      <Navbar />
      <div className="container">
        <h1>{userType === 'driver' ? 'Driver Dashboard' : 'Admin Dashboard'}</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Points Overview</button>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>
        </nav>
        <form onSubmit={createUser}>
          {userType !== 'driver' && (
            <>
              <label>Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label>Name:</label> 
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <label>Phone Number:</label> 
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              <label>User Type:</label>
              <select value={userType} onChange={(e) => setusertype(e.target.value)}>
                <option value="sponsor">Sponsor</option>
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Create User</button>
            </>
          )}
        </form>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {activeView === 'profile' && userType === 'driver' && <Profile />}
        {activeView === 'points' && userType === 'driver' && <PointsOverview />}
        {activeView === 'catalog' && userType === 'driver' && <ProductCatalog />}
        {userType !== 'driver' && (
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
                  <div>Enabled: {user.Enabled ? 'Yes' : 'No'}</div>
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
        )}
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);