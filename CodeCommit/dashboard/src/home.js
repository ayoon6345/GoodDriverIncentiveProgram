import React from 'react';
import { signOut } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import Navbar from './navbar'; // Import the Navbar component
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
Amplify.configure(config);


function HomePage() {
  const handleSignOut = async () => {
    try {
      await signOut();
      // Handle successful sign-out, e.g., redirect to login page
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  return (
    <div>
      <Navbar /> 
      <div className="container">
        <h1>Good Truck Driver Incentive Program</h1>
        <p>CPSC 4911 Spring 2024</p>
        <section className="content">
          <h1>Sample Home Page</h1>
        </section>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Good Truck Driver Incentive Program. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default withAuthenticator(HomePage);
