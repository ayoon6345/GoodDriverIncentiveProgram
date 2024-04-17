import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { CognitoIdentityProviderClient, ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function PointsOverview() {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState(null);

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
        setAboutData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  async function cognitoChangePassword(currentPassword, newPassword) {
    try {
      const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
      const input = {
        PreviousPassword: currentPassword,
        ProposedPassword: newPassword,
        AccessToken: (await getCurrentUser()).signInUserSession.accessToken.jwtToken,
      };
      const command = new ChangePasswordCommand(input);
      await client.send(command);
      setPasswordChangeSuccess(true);
      setPasswordChangeError(null);
    } catch (error) {
      setPasswordChangeError(error.message);
      setPasswordChangeSuccess(false);
    }
  }

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  return (
    <div>
      <div className="container">
        <h1>User Details</h1>
        {currentUserData ? (
          <div>
            <p>Name: {currentUserData.name}</p>
            <p>UserName: {currentUserData.user_id}</p>
            <p>Email: {currentUserData.email}</p>
            <p>Phone Number: {currentUserData.phone_number}</p>
            <p>User Type: {currentUserData.usertype}</p>
            <p>Your Sponsor is: {currentUserData.sponsor}</p>
            {passwordChangeSuccess && <p>Password changed successfully!</p>}
            {passwordChangeError && <p>Error: {passwordChangeError}</p>}
            <button onClick={() => cognitoChangePassword("CURRENT_PASSWORD", "NEW_PASSWORD")}>
              Change Password
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default PointsOverview;
