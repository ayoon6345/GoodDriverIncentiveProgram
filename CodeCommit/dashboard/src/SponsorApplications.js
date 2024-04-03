import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function SponsorApplications() {
  const [aboutData, setAboutData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
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

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  useEffect(() => {
    fetch('/api/applications')
      .then(response => response.json())
      .then(data => {
        console.log("LOGGING APPLICATION DATA");
        console.log(data); // Log the received data
        setApplicationData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <div className="container">
        <h1>Application List</h1>
        <div className="container">
          testdata
        </div>
      </div>
    </div>
  );
}

export default SponsorApplications;
