import React, { useState, useEffect } from 'react';
import { Amplify} from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';

Amplify.configure(config);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await Auth.listUsers();
        setUsers(userList.Users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const createUser = async () => {
    try {
      await Auth.signUp({
        username: newUserUsername,
        password: newUserPassword,
        attributes: {
          // Add any additional attributes here
        }
      });
      alert('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const deleteUser = async (username) => {
    try {
      await Auth.adminDeleteUser({ username });
      setUsers(users.filter((user) => user.Username !== username));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.Username}>
            {user.Username}
            <button onClick={() => deleteUser(user.Username)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Create New User</h3>
      <input
        type="text"
        placeholder="Username"
        value={newUserUsername}
        onChange={(e) => setNewUserUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={newUserPassword}
        onChange={(e) => setNewUserPassword(e.target.value)}
      />
      <button onClick={createUser}>Create User</button>
    </div>
  );
}

export default withAuthenticator(AdminDashboard);
