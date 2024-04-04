import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function PointsOverview() {
  const [userData, setUserData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        setUserData(data);
        // Reset update status after fetching so it does not show old messages
        setUpdateStatus({ success: false, message: '' });
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  // Filter drivers
  const driverUsers = userData.filter(user => user.usertype === 'driver');

  const handleAdjustPoints = (userId, newPoints) => {
    fetch('/api/updatePoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newPoints }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update points');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Show a success message
      setUpdateStatus({ success: true, message: 'Points updated successfully.' });
      // Refetch user data to refresh the points displayed
      fetchUserData();
    })
    .catch(error => {
      console.error('Error updating points:', error);
      // Show an error message
      setUpdateStatus({ success: false, message: 'Error updating points.' });
    });
  };

  return (
    <div className="container">
      <h1>Driver List</h1>
      {/* Display update status message */}
      {updateStatus.message && (
        <p className={updateStatus.success ? 'success-message' : 'error-message'}>{updateStatus.message}</p>
      )}
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
