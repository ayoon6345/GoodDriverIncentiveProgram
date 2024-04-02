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
  const [userType, setUserType] = useState('');
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
        setUserType(user.attributes.find(attr => attr.Name === 'usertype')?.Value || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the received data
        setAboutData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

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
