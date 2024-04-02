import React, { useEffect, useState } from 'react';
import './navbar.css';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function CustomNavbar() {
  const [usersData, setUsersData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsersData() {
      try {
        const response = await fetch('/api/getAllUsers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsersData(data);
      } catch (error) {
        console.error('Error fetching users data:', error);
        setError('Error fetching users data');
      }
    }

    fetchUsersData();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-items">
        {error ? (
          <span className="error">{error}</span>
        ) : (
          <>
            {usersData.map(user => (
              <div key={user.user_id}>
                <span className="username">{user.user_id}</span>
                <span className="userType">{user.usertype}</span>
              </div>
            ))}
            {/* Add other navbar items here */}
          </>
        )}
      </div>
    </nav>
  );
}

export default CustomNavbar;
