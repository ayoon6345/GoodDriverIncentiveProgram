import React, { useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './navbar';
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

  const getUserInfo = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userInfo = await Auth.adminGetUser({
        Username: user.username,
        UserPoolId: amplifyconfig.aws_user_pools_id,
      });
      console.log(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Driver Dashboard</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Points Overview</button>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>
          <button onClick={getUserInfo}>Get User Info</button>
        </nav>
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
