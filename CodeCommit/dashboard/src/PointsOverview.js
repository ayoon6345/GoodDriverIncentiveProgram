import React, { useEffect, useState } from 'react';
import './navbar.css';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function CustomNavbar() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getCurrentUser();
        const userId = user.username;
        const response = await fetch(`/api/getUserType?user_id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserData({ username: user.username, userType: data.userType });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">My App</div>
      <div className="navbar-items">
        {userData && (
          <>
            <span className="username">{userData.username}</span>
            <span className="userType">{userData.userType}</span>
          </>
        )}
        {/* Add other navbar items here */}
      </div>
    </nav>
  );
}

export default CustomNavbar;
