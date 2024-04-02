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
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCurrentUser();
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

  // Assuming user_id is the correct identifier and matches currentUser
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        {/* Conditionally render routes based on currentUserData and its usertype */}
        {currentUserData ? (
          currentUserData.usertype === 'admin' ? (
            <Route path="/dashboard" element={<AdminDashboard />} />
          ) : (
            <Route path="/dashboard" element={<DriverDashboard />} />
          )
        ) : (
          // Optional: Render a loading component or null while user data is being fetched
          <Route path="/dashboard" element={<div>Loading...</div>} />
        )}
        <Route path="/search" element={<ProductSearch />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
