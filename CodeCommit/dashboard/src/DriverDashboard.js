import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import './App.css';
import { deleteUser } from 'aws-amplify/auth';

Amplify.configure(config);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const changeView = (view) => {
    setActiveView(view);
  };

  const handleDeleteUser = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUser();
      // Redirect user to a different page or show a message upon successful deletion
    } catch (error) {
      console.log(error);
    }
    setShowDeleteConfirmation(false);
  };

  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <div className="container">
        <h1>Driver Dashboard</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Points Overview</button>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>
          <button onClick={handleDeleteUser}>Delete User</button>
        </nav>
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}

        {showDeleteConfirmation && (
          <div className="modal">
            <div className="modal-content">
              <p>Do you really want to delete?</p>
              <button onClick={confirmDeleteUser}>Yes</button>
              <button onClick={() => setShowDeleteConfirmation(false)}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
