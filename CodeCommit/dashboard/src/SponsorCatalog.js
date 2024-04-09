import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './navbar';
//import Profile from './Profile';
//import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
//import DriverApplication from './DriverApplication';
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function SponsorCatalog() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  return (
    <div>
        <Navbar />
        <div className="container">
        <h1>Sponsor Catalog</h1>
        <nav>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>
        </nav>
        {activeView === 'catalog' && <ProductCatalog />}
        </div>
    </div>
  );
}

export default withAuthenticator(SponsorCatalog);