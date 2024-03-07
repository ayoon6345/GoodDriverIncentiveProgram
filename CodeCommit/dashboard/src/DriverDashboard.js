import React, { useState } from 'react';
import { Amplify, API } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Navbar from './navbar'; // Import the Navbar component
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  async function listEditors() {
    const apiName = 'AdminQueries';
    const path = '/listUsers';
    const session = await fetchAuthSession();
    const options = { 
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${session.accessToken.jwtToken}`
      }
    };

    try {
      const response = await API.get(apiName, path, options);
      console.log(response);
    } catch (error) {
      console.error('Error listing users:', error);
    }
  }

  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <div className="container">
        <h1>Driver Dashboard</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Points Overview</button>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>
          <button onClick={() => listEditors()}>List Editors</button>
        </nav>
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
