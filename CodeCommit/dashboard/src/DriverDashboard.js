import React, { useState } from 'react';
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import './App.css';
import { signOut } from 'aws-amplify/auth';


function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Handle successful sign-out, e.g., redirect to login page
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };


  return (
    <div>
      <div className="navbar">
        <a href="/home">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/about">About Us</a>
        <button onClick={handleSignOut} className="signout-button">Sign Out</button> {/* Add the sign-out button */}
      </div>
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
  );
}

export default (DriverDashboard);