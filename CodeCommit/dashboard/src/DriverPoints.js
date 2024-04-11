import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import './App.css';
import PointConsultation from './PointConsultation';
import config from './amplifyconfiguration.json';

Amplify.configure(config);

function PointsOverview() {
  const [userData, setUserData] = useState([]);
  const [currentUserSponsor, setCurrentUserSponsor] = useState(null); // State to store the current user's sponsor
  const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);

  useEffect(() => {
    fetchUserData();
    const storedStatus = localStorage.getItem('updateStatus');
    if (storedStatus) {
      setUpdateStatus(JSON.parse(storedStatus));
      localStorage.removeItem('updateStatus');
    }
  }, []);

  const fetchUserData = () => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        setUserData(data);
        // Example: Find the current user based on some condition. Adjust according to your actual data structure.
        const currentUser = data.find(user => user.isCurrentUser);
        if (currentUser) {
          setCurrentUserSponsor(currentUser.sponsor); // Assuming 'sponsor' is the property name
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  // Filter to show only drivers with the same sponsor as the current user
  const driverUsers = userData.filter(user => user.usertype === 'driver' && user.sponsor === currentUserSponsor);

  const handleAdjustPoints = (userId, newPoints) => {
    // Ensure newPoints is within the allowed range before sending it to the server
    const adjustedPoints = Math.min(Math.max(parseInt(newPoints, 10), 0), 1000000);

    fetch('/api/updatePoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newPoints: adjustedPoints }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update points');
      }
      return response.json();
    })
    .then(() => {
      setUpdateStatus({ success: true, message: 'Points updated successfully.' });
      localStorage.setItem('updateStatus', JSON.stringify({ success: true, message: 'Points updated successfully.' }));
      fetchUserData(); // Refetch to update the list
    })
    .catch(error => {
      console.error('Error updating points:', error);
      setUpdateStatus({ success: false, message: 'Error updating points.' });
      localStorage.setItem('updateStatus', JSON.stringify({ success: false, message: 'Error updating points.' }));
    });
  };

  return (
    <div className="container">
      <h1>currentUser.sponsor Driver List</h1>
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
              <button type="button" onClick={() => handleOpenConsultModal(driver.user_id)}>Consult Points</button>
            </form>
          </li>
        ))}
      </ul>
      {isConsultModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsConsultModalOpen(false)}>&times;</span>
            <h2>Consult Points for Driver ID: {currentDriverId}</h2>
            <PointConsultation />
          </div>
        </div>
      )}
    </div>
  );
}

export default PointsOverview;
