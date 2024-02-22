import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Landing';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard'; // Import the dashboard component
import Login from './Login'; // Import the login component
import { Auth } from 'aws-amplify'; // Import AWS Amplify Auth
import reportWebVitals from './reportWebVitals';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setAuthenticated(true);
    } catch (error) {
      setAuthenticated(false);
    }
  };

  const PrivateRoute = ({ element, ...rest }) => {
    if (rest.path === '/login') {
      return element;
    }

    return authenticated ? element : <Navigate to="/login" />;
  };

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<PrivateRoute element={<AboutUs />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute element={<DriverDashboard />} />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
