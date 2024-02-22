// DriverDashboard.js
import React from 'react';
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';

function DriverDashboard() {
  return (
    <div>
      <h1>Driver Dashboard</h1>
      <Profile />
      <PointsOverview />
      <ProductCatalog />
    </div>
  );
}

export default DriverDashboard;
