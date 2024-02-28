import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react'; // Import withAuthenticator
import LandingPage from './Landing';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard'; // Import the dashboard component
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import awsconfig from './amplify-config';
Amplify.configure(awsconfig);

// Wrap your components with withAuthenticator
const AppWithAuth = withAuthenticator(() => (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<DriverDashboard />} /> {/* Add the dashboard route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppWithAuth /> // Render the AppWithAuth component
);

reportWebVitals();
