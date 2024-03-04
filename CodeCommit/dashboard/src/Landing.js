import React from 'react';
import { Auth } from 'aws-amplify';
function LandingPage() {
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      // Handle successful sign-out, e.g., redirect to login page
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  const renderAuthButton = () => {
    if (Auth.currentAuthenticatedUser()) {
      return <button onClick={handleSignOut}>Sign Out</button>;
    } else {
      return <button onClick={() => Auth.federatedSignIn()}>Sign In</button>;
    }
  };

  return (
    <div>
      <body>
        <div className="navbar">
          {renderAuthButton()}
        </div>
        <div className="container">
          <h1>TruckStar Rewards</h1>
          <p>CPSC 4911 Spring 2024</p>
          <section className="content">
            <h1>Sample Landing Page</h1>
          </section>
        </div>
        <footer className="footer">
          <p>&copy; 2024 Good Truck Driver Incentive Program. All rights reserved.</p>
        </footer>
      </body>
    </div>
  );
}

export default LandingPage;
