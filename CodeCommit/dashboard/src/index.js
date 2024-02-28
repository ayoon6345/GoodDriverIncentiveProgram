import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import Home from './Home';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard'; // Import the dashboard component
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
Amplify.configure(config);


// Wrap your components with withAuthenticator
const AppWithAuth = withAuthenticator(() => (
 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <React.StrictMode>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<DriverDashboard />} /> 
        </React.StrictMode>
      </Routes>
    </BrowserRouter>
  
));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppWithAuth /> // Render the AppWithAuth component
);

reportWebVitals();
