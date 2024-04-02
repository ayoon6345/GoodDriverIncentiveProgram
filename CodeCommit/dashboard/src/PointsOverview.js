import React, { useEffect, useState } from 'react';
import './navbar.css';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function CustomNavbar() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setUsername(user.username);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">My App</div>
      <div className="navbar-items">
        <span className="username">{username}</span>
        {/* Add other navbar items here */}
      </div>
    </nav>
  );
}

export default CustomNavbar;
