import React from 'react';
import { signIn as amplifySignIn } from 'aws-amplify/auth'; // Rename the imported function to avoid conflict

async function signIn({ username, password }) {
  try {
    const { isSignedIn, nextStep } = await amplifySignIn({ username, password }); // Use amplifySignIn to avoid conflict
    // Handle sign-in success
  } catch (error) {
    console.log('error signing in', error);
  }
}

function LandingPage() {
  return (
    <div>
      <div className="navbar">
        <button onClick={() => signIn({ username: 'your_username', password: 'your_password' })} className="signin-button">Sign In</button> {/* Pass username and password as arguments */}
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
