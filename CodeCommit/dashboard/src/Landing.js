import React from 'react';
import Amplify, { Auth } from 'aws-amplify';

function LandingPage() {
  const signOut = async () => {
    try {
      await Auth.signOut(); // Sign out the user
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <div className="navbar">
        <a href="/">Home</a>
        <button onClick={signOut} className="signout-button">Sign Out</button> {/* Add the sign-out button */}
      </div>
      <div className="container">
        <h1>Good Truck Driver Incentive Program</h1>
        <p>CPSC 4911 Spring 2024</p>
        <section className="content">
          <h1>Sample Landing Page</h1>
        </section>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Good Truck Driver Incentive Program. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
