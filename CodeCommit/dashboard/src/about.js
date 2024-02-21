// Import React and the CSS file for styling
import React from 'react';
import './App.css';

// Define the AboutUs component
function AboutUs() {
  // Replace the placeholders with actual values or props as necessary
  const teamNumber = "Your Team Number";
  const versionNumber = "Your Version Number";
  const releaseDate = "Your Release Date";
  const productName = "Your Product Name";
  const productDescription = "Your Product Description";

  return (
    <div>
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
      </div>
      <div className="container">
        <h1>About Us</h1>
        <p>Team #: {teamNumber}</p>
        <p>Version #: {versionNumber}</p>
        <p>Release Date: {releaseDate}</p>
        <p>Product Name: {productName}</p>
        <p>Product Description: {productDescription}</p>
      </div>
    </div>
  );
}

// Export the AboutUs component
export default AboutUs;
