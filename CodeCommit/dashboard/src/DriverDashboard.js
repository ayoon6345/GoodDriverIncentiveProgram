import React, { useState } from 'react';
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import './App.css';


function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  return (
    <div>
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="https://team29cpsc4911login.auth.us-east-1.amazoncognito.com/logout?client_id=79svo07u2k8h4oea15mh3krra7&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fteam29.cpsc4911.com%2Fdashboard" className="logout-button">Logout</a>
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