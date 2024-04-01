import React, { useEffect, useState } from 'react';
import './navbar.css';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';

Amplify.configure(config);

async function handleSignOut() {
  try {
    await signOut({ global: true });
    window.location.href = '/'; // Redirect to the landing page after sign out
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

function CustomNavbar() {
  const [username, setUsername] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setUsername(user.username);
        // Here, make an API call to your backend to fetch the user type
        // The URL '/api/getUserType' is an example. Use your actual endpoint.
        const userTypeResponse = await fetch(`/api/getUserType?username=${user.username}`);
        const userTypeData = await userTypeResponse.json();
        setUserType(userTypeData.userType);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <div className="wrapper">
      <nav>
        {/* Existing elements */}
        <div className="links">
          {/* Conditional rendering based on userType */}
          {userType === 'admin' && (
            <div className="navlinks" onClick={() => {window.location.href='/AdminDashboard'}}>
              <h4>Admin Dashboard</h4>
            </div>
          )}
          {/* Other links */}
        </div>
      </nav>
    </div>
  );
}

export default CustomNavbar;
