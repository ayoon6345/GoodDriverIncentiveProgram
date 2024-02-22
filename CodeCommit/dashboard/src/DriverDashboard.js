import React, { useState } from 'react';
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile'); // Set the default view to 'profile'

  const changeView = (view) => {
    setActiveView(view);
  };

  return (
    <div>
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

export default DriverDashboard;
