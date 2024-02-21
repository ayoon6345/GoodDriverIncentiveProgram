// Import React and the CSS file for styling
import React from 'react';
import './App.css';

// Define the AboutUs component
function AboutUs({ team_number, version_number, release_date, product_name, product_description }) {
  return (
    <div>
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
      </div>
      <div className="container">
        <h1>About Us</h1>
        <p>Team #: {team_number}</p>
        <p>Version #: {version_number}</p>
        <p>Release Date: {release_date}</p>
        <p>Product Name: {product_name}</p>
        <p>Product Description: {product_description}</p>
      </div>
    </div>
  );
}

// Export the AboutUs component
export default AboutUs;

