import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateCurrentUserAttributes } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    usertype: '',
    sponsor: '',
  });
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        const userData = { name: user.username, ...user.attributes }; // Assume user.attributes contains the rest of the fields
        setCurrentUserData(userData);
        setFormData(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    }

    fetchCurrentUser();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    console.log("Updating user profile with data:", formData);
  
    try {
      await updateCurrentUserAttributes(formData); // Assumes this function exists or similar functionality
      setCurrentUserData(formData); // Update the displayed user data with the new form data
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="container">
      <h1>Edit Profile</h1>
      {currentUserData ? (
        <form>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>User Type:</label>
            <input
              type="text"
              name="usertype"
              value={formData.usertype}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Your Sponsor:</label>
            <input
              type="text"
              name="sponsor"
              value={formData.sponsor}
              onChange={handleInputChange}
            />
          </div>

          <button type="button" onClick={handleUpdateProfile}>
            Update Profile
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
