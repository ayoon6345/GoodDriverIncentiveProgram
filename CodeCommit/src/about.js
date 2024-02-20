import React from 'react';

const About = ({ aboutData }) => (
  <div>
    <h1>About Us</h1>
    <p>Team #: {aboutData.team_number}</p>
    <p>Version #: {aboutData.version_number}</p>
    <p>Release Date: {new Date(aboutData.release_date).toLocaleDateString()}</p>
    <p>Product Name: {aboutData.product_name}</p>
    <p>Product Description: {aboutData.product_description}</p>
  </div>
);

export default About;
