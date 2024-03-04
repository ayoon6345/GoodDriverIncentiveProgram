import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

function LandingPage() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsSignedIn(true);
    } catch (error) {
      setIsSignedIn(false);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div>
      <div className="navbar">
        {isSignedIn ? (
          <button onClick={signOut}>Sign Out</button>
        ) : (
          <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
        )}
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
