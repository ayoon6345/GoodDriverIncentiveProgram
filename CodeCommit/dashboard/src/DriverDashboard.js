import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { post } from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import amplifyconfig from './amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  const addToGroup = async () => {
    try {
      const apiName = 'AdminQueries';
      const path = '/addUserToGroup';
      const myInit = {
        body: {
          "username": 'username',
          "groupname": 'groupname'
        }
      };
      const response = await post(apiName, path, myInit);
      console.log('User added to group:', response);
    } catch (error) {
      console.error('Error adding user to group:', error);
    }
  };

  return (
    <div>
      <h1>Driver Dashboard</h1>
      <nav>
        <button onClick={() => changeView('profile')}>Profile</button>
        <button onClick={() => changeView('points')}>Points Overview</button>
        <button onClick={() => changeView('catalog')}>Product Catalog</button>
        <button onClick={addToGroup}>Add User to Group</button>
      </nav>
      {activeView === 'profile' && <h2>Profile</h2>}
      {activeView === 'points' && <h2>Points Overview</h2>}
      {activeView === 'catalog' && <h2>Product Catalog</h2>}
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
