// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './navbar'; // Import the Navbar component
import { getCurrentUser } from 'aws-amplify/auth';
var newList = [];
function Orders() {
    const [cartData, setOrderData] = useState([]);
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
      fetch('/api/getOrders')
        .then(response => response.json())
        .then(data => {
          // Transform the data to match your application's data structure
          const allItems = data.map((product) => ({
            id: product.id,
            user: product.user_id,
            product: product.product_id,
          }));
          setOrderData(allItems) 
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    // Filter out the current user from the user list

    newList = cartData.filter(function (el) {
      if ( el.user ===  currentUser) {
        return el;
      } 
    });
  return (
    <div>
        <Navbar /> 
        <div className="container">
        {newList.map((product) => (
      <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}> 
        <h3>{product.product_id}</h3>

        <button >Add to Cart</button>
      </div>
    ))}
        </div>
    </div>
  );
}

export default Orders;

