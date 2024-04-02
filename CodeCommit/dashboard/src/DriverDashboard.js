import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { withAuthenticator} from '@aws-amplify/ui-react'; // Import getCurrentUser
import '@aws-amplify/ui-react/styles.css';

import Navbar from './navbar';
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import AdminDashboard from './AdminDashboard'; // Import AdminDashboard component
import SponsorDashboard from './SponsorDashboard'; // Import SponsorDashboard component
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function DriverDashboard() {
  
  const [usertype, setusertype] = useState('driver');
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        // Assuming the user type is stored in the 'usertype' attribute
        setUsertype((user.attributes || []).find(attr => attr.Name === 'usertype')?.Value || '');
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
        <h1>Driver Dashboard</h1>
        {usertype === 'driver' && (
          <nav>
            <button onClick={() => changeView('profile')}>Profile</button>
            <button onClick={() => changeView('points')}>Points Overview</button>
            <button onClick={() => changeView('catalog')}>Product Catalog</button>
          </nav>
        )}
        {usertype === 'admin' && <AdminDashboard />} {/* Render AdminDashboard if user is admin */}
        {usertype === 'sponsor' && <SponsorDashboard />} {/* Render SponsorDashboard if user is sponsor */}
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
