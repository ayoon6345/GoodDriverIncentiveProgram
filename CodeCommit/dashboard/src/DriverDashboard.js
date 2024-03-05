import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { post, get } from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import amplifyconfig from './amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const apiName = 'AdminQueries';
        const path = '/listUsers';
        const response = await get(apiName, path);
        setUsers(response.Users);
      } catch (error) {
        console.error('Error listing users:', error);
      }
    }
    getUsers();
  }, []);

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
      {activeView === 'profile' && (
        <div>
          <h2>Profile</h2>
          <ul>
            {users.map(user => (
              <li key={user.Username}>{user.Username}</li>
            ))}
          </ul>
        </div>
      )}
      {activeView === 'points' && <h2>Points Overview</h2>}
      {activeView === 'catalog' && <h2>Product Catalog</h2>}
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
