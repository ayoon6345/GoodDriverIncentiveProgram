import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Landing';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard'; // Import the dashboard component
import { Auth } from 'aws-amplify';
import reportWebVitals from './reportWebVitals';

const ProtectedRoute = ({ element, ...rest }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await Auth.currentAuthenticatedUser();
      } catch (err) {
        window.location.href = '/login'; // Redirect to the sign-in page
      }
    };

    checkAuth();
  }, []);

  return <Route {...rest} element={element} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <ProtectedRoute path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
