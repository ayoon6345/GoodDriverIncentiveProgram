import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import Home from './home';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard';
import AdminDashboard from './AdminDashboard';
import ProductSearch from './ProductSearch';
import PointsOverview from './PointsOverview'; // Import PointsOverview component
import { getCurrentUser } from 'aws-amplify/auth'; // Import getCurrentUser function

const App = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    async function fetchUserType() {
      try {
        const user = await getCurrentUser();
        setUserType(user.attributes.find(attr => attr.Name === 'usertype')?.Value || 'driver');
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
        <Route path="/dashboard" element={userType === 'admin' ? <AdminDashboard /> : <DriverDashboard />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/points" element={<PointsOverview />} /> {/* Add PointsOverview route */}
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
