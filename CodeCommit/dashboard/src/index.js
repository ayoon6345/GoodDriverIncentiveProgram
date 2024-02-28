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

// Custom component to conditionally apply withAuthenticator
const ProtectedRoute = ({ path, element }) => {
  if (path === '/') {
    return <Route path={path} element={element} />;
  }
  return <Route path={path} element={withAuthenticator(element)} />;
};

const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <ProtectedRoute path="/" element={<LandingPage />} />
        <ProtectedRoute path="/home" element={<Home />} />
        <ProtectedRoute path="/about" element={<AboutUs />} />
        <ProtectedRoute path="/dashboard" element={<DriverDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App /> // Render the App component
);

reportWebVitals();
