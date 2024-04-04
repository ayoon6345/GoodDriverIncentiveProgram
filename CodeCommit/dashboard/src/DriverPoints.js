import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function PointsOverview() {
  const [userData, setUserData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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
        console.log(data); // Log the received data
        setUserData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter out the current user from the user list
  const currentUserData = userData.find(user => user.user_id === currentUser);

  // Filter drivers
  const driverUsers = userData.filter(user => user.usertype === 'driver');

  const handleAdjustPoints = (userId, newPoints) => {
    // Perform logic to adjust points and update the backend
    console.log(`Adjust points for user ${userId} to ${newPoints}`);
  };

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
            <p>You Have : {currentUserData.points} points </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <h2>Driver List</h2>
        <ul>
          {driverUsers.map(driver => (
            <li key={driver.user_id}>
              <p>Name: {driver.name}</p>
              <p>Points: {driver.points}</p>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const newPoints = e.target.points.value;
                  handleAdjustPoints(driver.user_id, newPoints);
                }}
              >
                <input type="number" name="points" defaultValue={driver.points} />
                <button type="submit">Adjust Points</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PointsOverview;
