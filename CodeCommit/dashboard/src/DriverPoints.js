import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { getCurrentUser } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import './App.css';
import PointConsultation from './PointConsultation';
Amplify.configure(config);

function PointsOverview() {
  const [userData, setUserData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [aboutData, setAboutData] = useState([]);

  const handleOpenConsultModal = (driverId) => {
    setCurrentDriverId(driverId);
    setIsConsultModalOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
        // Fetch aboutData or any other data you need here
        // and set it to the state
        // For example:
        // const aboutDataResponse = await fetch('/api/getAboutData');
        // const aboutData = await aboutDataResponse.json();
        // setAboutData(aboutData);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

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
      .then(data => setUserData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  const driverUsers = userData.filter(user => user.usertype === 'driver');

  // Filter driverUsers based on the current user's sponsor
  const filteredDrivers = driverUsers.filter(driver => driver.sponsor === (currentUserData ? currentUserData.sponsor : null));

  const handleAdjustPoints = (userId, newPoints) => {
    // Your adjustment logic
  };

  return (
    <div className="container">
      <h1>Driver List</h1>
      {/* Update status message rendering */}
      {updateStatus.message && (
        <p className={updateStatus.success ? 'success-message' : 'error-message'}>{updateStatus.message}</p>
      )}
      <ul>
        {filteredDrivers.map(driver => (
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
      {/* Consultation modal */}
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
