// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './navbar'; // Import the Navbar component
import { getCurrentUser } from 'aws-amplify/auth';
function Orders() {
    const [cartData, setCartData] = useState([]);
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
      fetch('/api/getCart')
        .then(data => {
          console.log(data); // Log the received data
        })
        .catch(error => console.error('Error fetching Data:', error));
    }, []);
  
  
    // Filter out the current user from the user list
    const currentUserData = cartData.find(user => user.user_id === currentUser);
  return (
    <div>
        <Navbar /> 
        <div className="container">
        </div>
    </div>
  );
}

export default Orders;
