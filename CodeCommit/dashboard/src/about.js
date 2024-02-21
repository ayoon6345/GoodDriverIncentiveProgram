import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './App.css'; // Make sure the CSS file is appropriately located and imported

function AboutUs() {
  const [aboutData, setAboutData] = useState({
    teamNumber: '',
    versionNumber: '',
    releaseDate: '',
    productName: '',
    productDescription: ''
  });

  useEffect(() => {
    fetch('/about') // Adjust the endpoint if needed
      .then(response => response.json())
      .then(data => setAboutData({
        teamNumber: data.team_number,
        versionNumber: data.version_number,
        releaseDate: new Date(data.release_date).toLocaleDateString(),
        productName: data.product_name,
        productDescription: data.product_description
      }))
      .catch(error => console.error('Error fetching about data:', error));
  }, []);

  return (
    <div>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
      </div>
      <div className="container">
        <h1>About Us</h1>
        <p>Team #: {aboutData.teamNumber}</p>
        <p>Version #: {aboutData.versionNumber}</p>
        <p>Release Date: {aboutData.releaseDate}</p>
        <p>Product Name: {aboutData.productName}</p>
        <p>Product Description: {aboutData.productDescription}</p>
      </div>
    </div>
  );
}

export default AboutUs;
