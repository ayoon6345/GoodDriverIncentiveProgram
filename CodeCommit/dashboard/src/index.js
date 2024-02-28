import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Landing';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard'; // Import the dashboard component
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import reportWebVitals from './reportWebVitals';

const AuthenticatedApp = withAuthenticator(() => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/dashboard" element={<DriverDashboard />} />
    </Routes>
    <AmplifySignOut />
  </BrowserRouter>
));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
