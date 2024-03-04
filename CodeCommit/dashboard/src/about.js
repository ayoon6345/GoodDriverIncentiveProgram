import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component

Amplify.configure(config);

function AboutUs() {
  const [aboutData, setAboutData] = useState({});
  const navigate = useNavigate();

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
      <Navbar /> {/* Render the Navbar component */}
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

export default withAuthenticator(AboutUs);
