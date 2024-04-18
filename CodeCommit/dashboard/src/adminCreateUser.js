import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { post, get } from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import './App.css';
import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function AdminCreate() {
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
  const [customSponsor, setCustomSponsor] = useState('');

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

  async function createUser(event) {
    event.preventDefault();

    try {
      const apiName = 'AdminQueries';
      const path = '/createUser';
      const options = {
        body: {
          username: username,
          password: password,
          email: email,
          name: name,
          phone_number: phoneNumber,
          userType: userType,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${(await fetchAuthSession()).tokens.accessToken}`,
        },
      };
      await post({ apiName, path, options });

      const sponsorToUse = customSponsor || sponsor;

      const response = await fetch('/api/createUserInMySQL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: username,
          email: email,
          name: name,
          phone_number: phoneNumber,
          userType: userType,
          sponsor: sponsorToUse,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add user to MySQL database');
      }

      // Check userType and add to group if necessary
      if (userType === 'sponsor' || userType === 'admin') {
        await addToGroup(username); // Make sure this function handles setting success or error messages appropriately
      } else {
        setSuccessMessage('User created successfully');
      }
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to add user:', error);
      setErrorMessage('Failed to add user. Please try again.');
      setSuccessMessage('');
    }
  }

  async function addToGroup(username) {
    try {
      const apiName = 'AdminQueries';
      const path = '/addUserToGroup';
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
      setSuccessMessage(`User ${username} added to Admins.`);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add user to Admins. Please try again.');
      setSuccessMessage('');
    }
  }

  return (
    <div>
      <div className="container">
        <h1>Admin Create User</h1>
        <form onSubmit={createUser} className="user-form">
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
          {userType === 'sponsor' && (
            <>
              <label>Sponsor Name:</label>
              <select value={sponsor} onChange={(e) => setsponsorname(e.target.value)}>
                <option value="amazon">AMAZON</option>
                <option value="walmart">WALMART</option>
                <option value="costco">COSTCO</option>
                <option value="none">No Sponsor</option>
              </select>
            </>
          )}
          {userType === 'sponsor' && sponsor === 'none' && (
            <>
              <label>Custom Sponsor Name:</label>
              <input type="text" value={customSponsor} onChange={(e) => setCustomSponsor(e.target.value)} />
            </>
          )}
          <button type="submit">Create User</button>
        </form>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default withAuthenticator(AdminCreate);
