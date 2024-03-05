import React, { useState, useEffect } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import './App.css';

Amplify.configure(config);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');
  const changeView = (view) => {
    setActiveView(view);
  };

  const createUser = async () => {
    try {
      await Auth.signUp({
        username: 'username', // Provide a unique username
        password: 'password', // Provide a password
        attributes: {
          email: 'email@example.com', // Provide an email address
          // Add any other user attributes you want to include
        },
      });
      console.log('User successfully created');
    } catch (error) {
      console.error('Error creating user:', error);
    }
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
          <button onClick={createUser}>Create User</button> {/* Add a button to create a user */}
        </nav>
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
