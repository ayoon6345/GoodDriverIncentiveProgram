import React, { useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { listUsers } from './adminApi'; // Import the listUsers function

function DriverDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const handleListUsers = async () => {
    const result = await listUsers();
    if (Array.isArray(result)) {
      setUsers(result);
    } else {
      setMessage(result);
    }
  };

  return (
    <div>
      <h1>Driver Dashboard</h1>
      <button onClick={handleListUsers}>List Users</button>
      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.Username}>{user.Username}</li>
          ))}
        </ul>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
