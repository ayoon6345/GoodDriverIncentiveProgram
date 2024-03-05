import React, { useState } from 'react';
import { Amplify, API } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import amplifyconfig from './amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  const listUsers = async () => {
    try {
      const response = await API.get('AdminQueries', '/listUsers');
      console.log('List of users:', response);
    } catch (error) {
      console.error('Error listing users:', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await API.post('AdminQueries', '/addUser', {
        body: { username: 'newUser' },
      });
      console.log('User added:', response);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (username) => {
    try {
      const response = await API.del('AdminQueries', '/deleteUser', {
        body: { username },
      });
      console.log('User deleted:', response);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>Driver Dashboard</h1>
      <nav>
        <button onClick={() => changeView('profile')}>Profile</button>
        <button onClick={() => changeView('listUsers')}>List Users</button>
        <button onClick={() => changeView('addUser')}>Add User</button>
        <button onClick={() => changeView('deleteUser')}>Delete User</button>
      </nav>
      {activeView === 'profile' && <h2>Profile</h2>}
      {activeView === 'listUsers' && <button onClick={listUsers}>List Users</button>}
      {activeView === 'addUser' && <button onClick={addUser}>Add User</button>}
      {activeView === 'deleteUser' && (
        <button onClick={() => deleteUser('userToDelete')}>Delete User</button>
      )}
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
