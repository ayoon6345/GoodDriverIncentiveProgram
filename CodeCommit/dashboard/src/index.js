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
import Navbar from './navbar';
const NavBar = ReactDOM.createRoot(document.getElementById('navbar'));
NavBar.render(
  <Navbar />
);
// Wrap your components with withAuthenticator
const AppWithAuth = withAuthenticator(() => (
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
));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppWithAuth /> // Render the AppWithAuth component
);

reportWebVitals();
