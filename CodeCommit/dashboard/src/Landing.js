import React from 'react';
import { signIn } from 'aws-amplify/auth';

async function signIn({ username, password }) {
  try {
    const { isSignedIn, nextStep } = await signIn({ username, password });
  } catch (error) {
    console.log('error signing in', error);
  }
}


function LandingPage() {
  

  return (
    <div>
      <div className="navbar">
       <button onClick={signIn} className="signin-button">Sign In</button> 
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
