import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import AboutUs from './about';
import Home from './home';
import DriverDashboard from './DriverDashboard'; // Import the dashboard component
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
Amplify.configure(config);

// Define your App component
const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<DriverDashboard />} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Conditionally render App with or without authentication
const Root = () => {
  const isAuthenticated = true; // Replace with your authentication check
  return isAuthenticated ? <AppWithAuth /> : <AppWithoutAuth />;
};

// Wrap your App component with withAuthenticator
const AppWithAuth = withAuthenticator(App);

// Render the Root component
ReactDOM.render(<Root />, document.getElementById('root'));

reportWebVitals();
