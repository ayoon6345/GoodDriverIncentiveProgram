import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
import ChangePassword from './ChangePassword'; // Import the ChangePassword component

Amplify.configure(config);

function PointsOverview() {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
 const [activeView, setActiveView] = useState('profile');

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

          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <nav>
          <button onClick={() => changeView('ChangePassword')}>Change Password</button>
        </nav>
        {activeView === 'ChangePassword' && <ChangePassword />}
    </div>
  );
}

export default PointsOverview;
