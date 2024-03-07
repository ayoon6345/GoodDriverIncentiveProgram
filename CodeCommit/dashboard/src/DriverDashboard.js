import React, { useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './navbar'; // Import the Navbar component
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import './App.css';
import { addUserToGroup, listUsers } from './adminApi'; // Import the API functions

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');
  const [username, setUsername] = useState('');
  const [groupname, setGroupname] = useState('');
  const [message, setMessage] = useState('');

  const changeView = (view) => {
    setActiveView(view);
  };

  const handleAddUserToGroup = async () => {
    const result = await addUserToGroup(username, groupname);
    setMessage(result);
    setUsername('');
    setGroupname('');
  };

const [users, setUsers] = useState([]);

const handleListUsers = async () => {
  const result = await listUsers();
  console.log(result); // Add this line to log the result
  if (Array.isArray(result)) {
    setUsers(result);
  } else {
    setMessage(JSON.stringify(result)); // Update this line to stringify the result
  }
};



  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <div className="container">
        <h1>Driver Dashboard</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Points Overview</button>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>
        </nav>
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}

        {/* Admin Actions */}
        <div className="admin-actions">
          <h2>Admin Actions</h2>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Group Name"
              value={groupname}
              onChange={(e) => setGroupname(e.target.value)}
            />
            <button onClick={handleAddUserToGroup}>Add User to Group</button>
            <button onClick={handleListUsers}>List Users</button>
{users.length > 0 && (
  <ul>
    {users.map((user) => (
      <li key={user.Username}>{user.Username}</li>
    ))}
  </ul>
)}

          </div>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
