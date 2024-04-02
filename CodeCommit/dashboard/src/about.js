import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar'; // Import the Navbar component
import './App.css';

// AWS Amplify Configuration
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
      <div className="about-container">
        <h1 className="about-header">About Us</h1>
        <div className="about-content">
          <div className="about-item">
            <span className="about-title">Team #:</span>
            <span className="about-detail">{aboutData.team_number}</span>
          </div>
          <div className="about-item">
            <span className="about-title">Version #:</span>
            <span className="about-detail">{aboutData.version_number}</span>
          </div>
          <div className="about-item">
            <span className="about-title">Release Date:</span>
            <span className="about-detail">{aboutData.release_date}</span>
          </div>
          <div className="about-item">
            <span className="about-title">Product Name:</span>
            <span className="about-detail">{aboutData.product_name}</span>
          </div>
          <div className="about-item">
            <span className="about-title">Product Description:</span>
            <span className="about-detail">{aboutData.product_description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(AboutUs);
