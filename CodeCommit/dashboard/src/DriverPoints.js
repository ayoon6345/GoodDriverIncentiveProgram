import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import './App.css';
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
        setUpdateStatus({ success: false, message: '' }); // Reset update status after fetching
      })
      .catch(error => console.error('Error fetching data:', error));
  };

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
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(data => Promise.reject(data));
      } else {
        return response.text().then(text => Promise.reject(text));
      }
    }
    return contentType && contentType.indexOf("application/json") !== -1
      ? response.json()
      : response.text();
  })
  .then(data => {
    console.log('Update response:', data);
    setUpdateStatus({ success: true, message: 'Points updated successfully.' });
    fetchUserData(); // Refetch user data only on success
  })
  .catch(error => {
    console.error('Error updating points:', error);
    // Determine if error is an object (from JSON) or text, and set message accordingly
    const errorMessage = typeof error === 'string' ? error : error.message || 'Error updating points.';
    setUpdateStatus({ success: false, message: errorMessage });
  });
};


  return (
    <div className="container">
      <h1>Driver List</h1>
      {updateStatus.message && (
        <p className={updateStatus.success ? 'success-message' : 'error-message'}>{updateStatus.message}</p>
      )}
      <ul>
        {driverUsers.map(driver => (
          <li key={driver.user_id}>
            <p>Name: {driver.name}</p>
            <p>Points: {driver.points}</p>
            <form onSubmit={e => {
              e.preventDefault();
              const newPoints = e.target.points.value;
              handleAdjustPoints(driver.user_id, newPoints);
            }}>
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
