import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import Home from './home';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard';
import AdminDashboard from './AdminDashboard';
import ProductSearch from './ProductSearch';
import { getCurrentUser } from 'aws-amplify/auth'; // Import getCurrentUser

const App = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    async function fetchUserType() {
      try {
        const user = await getCurrentUser();
        setUserType(user?.attributes.find(attr => attr.Name === 'usertype')?.Value || 'driver');
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    }

    fetchUserType();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        {userType === 'admin' ? (
          <Route path="/dashboard" element={<AdminDashboard />} />
        ) : (
          <Route path="/dashboard" element={<DriverDashboard />} />
        )}
        <Route path="/search" element={<ProductSearch />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
