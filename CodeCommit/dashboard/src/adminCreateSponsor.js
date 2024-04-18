// CreateSponsor.js
import React, { useState } from 'react';
import { post } from 'aws-amplify/api';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function CreateSponsor() {
  const [sponsorID, setSponsorID] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorPointRatio, setSponsorPointRatio] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function createSponsor(event) {
    event.preventDefault();

    try {
      const apiName = 'AdminQueries';
      const path = '/createSponsor';
      const options = {
        body: {
          sponsorID: sponsorID,
          sponsorName: sponsorName,
          sponsorPointRatio: sponsorPointRatio,
          isActive: isActive,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await Auth.currentSession().getIdToken().getJwtToken()}`,
        },
      };
      await post(apiName, path, options);
      setSuccessMessage('Sponsor created successfully');
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to add sponsor:', error);
      setErrorMessage('Failed to add sponsor. Please try again.');
      setSuccessMessage('');
    }
  }

  return (
    <div>
      <h1>Create Sponsor</h1>
      <form onSubmit={createSponsor}>
        <label>Sponsor ID:</label>
        <input type="text" value={sponsorID} onChange={(e) => setSponsorID(e.target.value)} required />
        <label>Sponsor Name:</label>
        <input type="text" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} required />
        <label>Sponsor Point Ratio:</label>
        <input type="text" value={sponsorPointRatio} onChange={(e) => setSponsorPointRatio(e.target.value)} required />
        <label>Is Active:</label>
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <button type="submit">Create Sponsor</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default withAuthenticator(CreateSponsor);
