import React, { useEffect, useState } from 'react';
import './App.css';

function AboutUs() {
  const [aboutData, setAboutData] = useState({});

useEffect(() => {
  fetch('/api/about')
    .then(response => response.json())
    .then(data => setAboutData(data))
    .catch(error => console.error('Error fetching data:', error));
}, []);


  return (
    <div>
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="https://team29cpsc4911login.auth.us-east-1.amazoncognito.com/logout?client_id=79svo07u2k8h4oea15mh3krra7&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fteam29.cpsc4911.com%2Fdashboard" className="login-button">Login / Sign Up</a>

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
