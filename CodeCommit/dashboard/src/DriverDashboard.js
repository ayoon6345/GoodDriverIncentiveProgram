import React, { useState, useEffect } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import AdminDashboard from './AdminDashboard'; // Import the AdminDashboard component
import './App.css';

Amplify.configure(config);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserType(user.attributes['custom:user_type']);
      } catch (error) {
        console.error('Failed to fetch user type:', error);
      }
    };

    fetchUserType();
  }, []);

  const changeView = (view) => {
    setActiveView(view);
  };

  if (userType === 'admin') {
    return <AdminDashboard />;
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
      </nav>
      {activeView === 'profile' && <Profile />}
      {activeView === 'points' && <PointsOverview />}
      {activeView === 'catalog' && <ProductCatalog />}
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
