import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import './App.css';
import PointConsultation from './PointConsultation';
Amplify.configure(config);

function PointsOverview() {
  const [userData, setUserData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);

  const handleOpenConsultModal = (driverId) => {
    setCurrentDriverId(driverId);
    setIsConsultModalOpen(true);
  };

  useEffect(() => {
    fetchUserData();
    // Attempt to retrieve the update status from local storage on component mount
    const storedStatus = localStorage.getItem('updateStatus');
    if (storedStatus) {
      setUpdateStatus(JSON.parse(storedStatus));
      // Optionally clear the message from local storage if you don't want it to persist across multiple refreshes
      localStorage.removeItem('updateStatus');
    }
  }, []);

  const fetchUserData = () => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        setUserData(data);
        // Optionally reset update status here if you prefer it to clear on data fetch instead of on mount
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
      const successStatus = { success: true, message: 'Points updated successfully.' };
      setUpdateStatus(successStatus);
      localStorage.setItem('updateStatus', JSON.stringify(successStatus)); // Persist the success status
      fetchUserData(); // Refetch user data only on success
    })
    .catch(error => {
      console.error('Error updating points:', error);
      // Determine if error is an object (from JSON) or text, and set message accordingly
      const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error updating points.' };
      setUpdateStatus(errorMessage);
      localStorage.setItem('updateStatus', JSON.stringify(errorMessage)); // Persist the error status
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
              /*<button type="button" onClick={() => openPointConsultation(driver.user_id)}>Consult Points</button>*/
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
