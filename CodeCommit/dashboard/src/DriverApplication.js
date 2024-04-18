import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function DriverApplication() {
  const [sponsorNames, setSponsorNames] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchSponsorNames() {
      try {
        const response = await fetch('/api/getSponsorNames');
        const data = await response.json();
        console.log('Sponsor names:', data); // Add this line to check the data
        setSponsorNames(data);
      } catch (error) {
        console.error('Error fetching sponsor names:', error);
      }
    }

    fetchSponsorNames();

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

  const applyToSponsor = async (sponsorName) => {
    try {
      const response = await fetch('/api/addApplication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sponsor: sponsorName,
          driverId: currentUser,
        }),
      });
      const data = await response.json();
      console.log('Application response:', data);
    } catch (error) {
      console.error('Error applying to sponsor:', error);
    }
  };

  return (
    <div>
      <div className="container">
        <h1>Apply to Sponsors</h1>
        <ul>
          {sponsorNames.map((name) => (
            <li key={name}>
              {name} <button onClick={() => applyToSponsor(name)}>Apply</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
