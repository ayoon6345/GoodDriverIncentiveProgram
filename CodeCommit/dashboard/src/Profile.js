import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { post } from 'aws-amplify'; // Make sure to import Auth
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function Profile() {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  // Form state
  const [formData, setFormData] = useState({
    address: '',
    birthdate: '',
    name: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await cognitoUpdateAttributes(formData);
  };

  async function cognitoUpdateAttributes(formData) {
    const apiName = 'AdminQueries';
    const path = '/updateAttributes';
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({
        "AccessToken": accessToken,
        ...formData,
      }),
    };
    try {
      await post(apiName, path, options);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  }

  return (
    <div className="container">
      <h1>User Details</h1>
      {currentUserData ? (
        <div>
          <p>Name: {currentUserData.name}</p>
          <p>UserName: {currentUserData.user_id}</p>
          <p>Email: {currentUserData.email}</p>
          <p>Phone Number: {currentUserData.phone_number}</p>
          <p>User Type: {currentUserData.usertype}</p>
          <p>Your Sponsor is: {currentUserData.sponsor}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="family_name"
              placeholder="Family Name"
              value={formData.name}
              onChange={handleChange}
            />
            <button type="submit">Update Profile</button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
