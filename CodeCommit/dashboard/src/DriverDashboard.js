import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import { get } from 'aws-amplify/api'
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

async function listEditors(limit){
  let apiName = 'AdminQueries';
  let path = '/listUsers';
  let options = { 
      queryStringParameters: {
        "groupname": "admins",
        "limit": limit,
      },
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await fetchAuthSession()).tokens.accessToken.payload}`
      }
  }
  const response = await get({apiName, path, options});
  return response;
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
          <button onClick={() => listEditors(10)}>List Editors</button>

        </nav>
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
