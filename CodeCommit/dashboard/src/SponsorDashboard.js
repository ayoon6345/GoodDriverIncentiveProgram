import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { post, get } from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './navbar';
import Profile from './Profile';
import Points from './DriverPoints';
import SponsorCatalog from './SponsorCatalog';
import SponsorApplications from './SponsorApplications';
import Report from './genReport';
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function SponsorDashboard() {
  const [activeView, setActiveView] = useState('profile');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userType, setusertype] = useState('driver');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sponsor, setsponsorname] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [aboutData, setAboutData] = useState([]);

  const changeView = (view) => {
    setActiveView(view);
  };

useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        setAboutData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);


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
        sponsor: currentUserData.sponsor,
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
          <Navbar />
      <div className="container">
        <h1>Sponsor Dashboard</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Assign Points To Drivers</button>
          <button onClick={() => changeView('catalog')}>Sponsor Catalog</button>
          <button onClick={() => changeView('report')}>Generate A Report</button>
          <button onClick={() => changeView('applications')}>Applications</button>
        </nav>
      {currentUserData && currentUserData.sponsor ? (
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
            <option value="sponsor">Sponsor User</option>
            <option value="driver">Sponsored Driver</option>
          </select>
          <label>Sponsor Name:</label>
          <select value={sponsor} onChange={(e) => setsponsorname(e.target.value)}>
            <option value={currentUserData.sponsor}>{currentUserData.sponsor}</option>
          </select>
          <button type="submit">Create Sponsor User</button>
        </form>
      ) : (
        <p>Loading sponsor information...</p>
      )}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <Points />}
        {activeView === 'catalog' && <SponsorCatalog />}
        {activeView === 'report' && <Report />}
        {activeView === 'applications' && <SponsorApplications />}

       
      </div>
    </div>
  );
}

export default withAuthenticator(SponsorDashboard);
