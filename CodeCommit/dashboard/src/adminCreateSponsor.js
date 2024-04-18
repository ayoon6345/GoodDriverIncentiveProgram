// CreateSponsor.js
import React, { useState } from 'react';
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
      const response = await fetch('/api/createUserInMySQL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: sponsorID, // Assuming user_id corresponds to sponsorID
          email: '', // Set email, name, phoneNumber, userType, and sponsor according to your requirements
          name: '',
          phone_number: '',
          userType: '',
          sponsor: '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create sponsor');
      }

      setSuccessMessage('Sponsor created successfully');
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to create sponsor:', error);
      setErrorMessage('Failed to create sponsor. Please try again.');
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
