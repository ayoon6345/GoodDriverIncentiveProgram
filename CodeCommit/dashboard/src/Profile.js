import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { API } from 'aws-amplify';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function Profile() {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    birthdate: '',
    family_name: '',
    given_name: '',
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

  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = await getCurrentUser().getSession().then(session => session.accessToken.jwtToken);
      const updateResponse = await API.post('apiName', '/updateAttributes', {
        body: {
          AccessToken: accessToken,
          ...formData
        },
      });
      console.log(updateResponse);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

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
          <p>Your Sponsor is : {currentUserData.sponsor}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <form onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        <input
          type="text"
          name="given_name"
          value={formData.given_name}
          onChange={handleChange}
          placeholder="Given Name"
        />
        <input
          type="text"
          name="family_name"
          value={formData.family_name}
          onChange={handleChange}
          placeholder="Family Name"
        />
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          placeholder="Birthdate"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
