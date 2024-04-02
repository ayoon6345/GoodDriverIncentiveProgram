import React from 'react';
import { Amplify } from 'aws-amplify';
import Navbar from './navbar'; // Import the Navbar component
import Carousel from './caruousel';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

// Define a custom theme for the authentication UI
const authTheme = {
  // Customize the global style
  container: {
    textAlign: 'center',
    backgroundColor: '#f5f5f5'
  },
  // Customize the sign in form
  signIn: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
  },
  // Customize the sign up form
  signUp: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
  },
  // Customize the forgot password form
  forgotPassword: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
  }
};

function HomePage() {

  return (
    <div>
      <Navbar /> 
      <div className="container">
        <h1>Good Truck Driver Incentive Program</h1>
        <p>CPSC 4911 Spring 2024</p>
        <section className="content">
          <h1>Sample Home Page</h1>
          <Carousel />
        </section>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Good Truck Driver Incentive Program. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default withAuthenticator(HomePage, { theme: authTheme });
