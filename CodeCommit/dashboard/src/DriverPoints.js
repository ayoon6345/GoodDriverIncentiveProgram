import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function PointsOverview() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Fetch all users data
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the received data
        setUserData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter drivers
  const driverUsers = userData.filter(user => user.usertype === 'driver');

  const handleAdjustPoints = (userId, newPoints) => {
    // Perform logic to adjust points and update the backend
    console.log(`Adjust points for user ${userId} to ${newPoints}`);
     fetch('/api/updatePoints', {
      method: 'POST',
     headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newPoints }),
     })
     .then(response => response.json())
     .then(data => console.log(data))
     .catch(error => console.error('Error updating points:', error));
  };

  return (
    <div className="container">
      <h1>Driver List</h1>
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
  );
}

export default PointsOverview;
