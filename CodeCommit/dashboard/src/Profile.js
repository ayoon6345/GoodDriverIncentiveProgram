import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import ChangePassword from './ChangePassword'; // Import the ChangePassword component
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function PointsOverview() {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('profile');
  const [sponsorArray, setSponsorArray] = useState([]);
  const changeView = (view) => {
    setActiveView(view);
  };

  useEffect(() => {
    fetch('/api/getSponsors')
      .then(response => response.json())
      .then(data => {
        setSponsorArray(data);
        console.log(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


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
  console.log(currentUserData.sponsor);
  const sponsorNames = sponsorArray.filter(s => s.SponsorID === currentUserData.sponsor).map(s => s.SponsorName);

  return (
    <div>
      <div className="container">
        <h1>User Details</h1>
        {currentUserData && sponsorArray ? (
          <div>
            <p>Name: {currentUserData.name}</p>
            <p>UserName: {currentUserData.user_id}</p>
            <p>Email: {currentUserData.email}</p>
            <p>Phone Number: {currentUserData.phone_number}</p>
            <p>User Type: {currentUserData.usertype}</p>
            <p>Sponsors: {sponsorNames.join(', ')}</p>
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
