import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Navbar from './navbar';
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import AdminDashboard from './AdminDashboard'; // Import AdminDashboard component
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function SponsorDashboard() {
  const [usertype, setUsertype] = useState('');
  const [activeView, setActiveView] = useState('profile'); // Add activeView state

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        // Assuming the user type is stored in the 'usertype' attribute
        setUsertype(user.attributes.find(attr => attr.Name === 'usertype')?.Value || '');
      } catch (err) {
        console.log(err);
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Sponsor Dashboard</h1>
        {usertype === 'sponsor' && (
          <nav>
            <button onClick={() => setActiveView('profile')}>Profile</button>
            <button onClick={() => setActiveView('points')}>Points Overview</button>
            <button onClick={() => setActiveView('catalog')}>Product Catalog</button>
          </nav>
        )}
        {usertype === 'admin' && <AdminDashboard />} {/* Render AdminDashboard if user is admin */}
        {usertype === 'sponsor' && <SponsorDashboard />} {/* Render SponsorDashboard if user is sponsor */}
      </div>
    </div>
  );
}

export default withAuthenticator(SponsorDashboard);
