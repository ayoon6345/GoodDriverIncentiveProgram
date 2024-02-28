import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AboutUs() {
  const [aboutData, setAboutData] = useState({});
  const navigate = useNavigate();
    const handleSignOut = async () => {
    try {
      await signOut();
      // Handle successful sign-out, e.g., redirect to login page
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  useEffect(() => {
    fetch('/api/about')
      .then(response => {
        if (response.status === 401) {
          // Redirect to login if not authenticated
          navigate('/login');
          return;
        }
        return response.json();
      })
      .then(data => setAboutData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [navigate]);

  return (
    <div>
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="/dashboard">Dashboard</a>
       <button onClick={handleSignOut} className="signout-button">Sign Out</button> {/* Add the sign-out button */}

      </div>
      <div className="container">
        <h1>About Us</h1>
        <p>Team #: {aboutData.team_number}</p>
        <p>Version #: {aboutData.version_number}</p>
        <p>Release Date: {aboutData.release_date}</p>
        <p>Product Name: {aboutData.product_name}</p>
        <p>Product Description: {aboutData.product_description}</p>
      </div>
    </div>
  );
}

export default AboutUs;
