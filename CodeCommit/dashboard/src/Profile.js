import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { post } from 'aws-amplify/api';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function PointsOverview() {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newName, setNewName] = useState(''); // New state for form input

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

  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  async function cognitoUpdateAttributes() { // Remove formData parameter
    const apiName = 'AdminQueries';
    const path = '/updateAttributes';
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await fetchAuthSession()).tokens?.accessToken}`
      },
      body: JSON.stringify({ // Ensure proper stringification
        "AccessToken": `${(await fetchAuthSession()).tokens?.accessToken}`,
        name: newName // Use state value
      })
    };
    await post(apiName, path, options);
  }

  function handleNameChange(event) { // Add handleNameChange function
    setNewName(event.target.value);
  }

  async function handleSubmit(event) { // Add handleSubmit function
    event.preventDefault();
    await cognitoUpdateAttributes();
    setNewName(''); // Optional: Reset the name field after submission
  }

  return (
    <div>
      <div className="container">
        <h1>User Details</h1>
        {currentUserData ? (
          <div>
            <p>Name: {currentUserData.name}</p>
            <p>UserName: {currentUserData.user_id}</p>
            <p>Email: {currentUserData.email}</p>
            <p>Phone Number: {currentUserData.phone_number}</p>
            <p>User Type: {currentUserData.usertype}</p>
            <p>Your Sponsor is : {currentUserData.sponsor}</p>
            {/* Add form for name change */}
            <form onSubmit={handleSubmit}>
              <label>
                New Name:
                <input type="text" value={newName} onChange={handleNameChange} />
              </label>
              <button type="submit">Change Name</button>
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default PointsOverview;
