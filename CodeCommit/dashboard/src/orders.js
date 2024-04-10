// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './navbar'; // Import the Navbar component
import { getCurrentUser } from 'aws-amplify/auth';
var userOrder = [];
var userOrders = [];

function Orders() {

    const [currentUser, setCurrentUser] = useState(null);
    var productsList = [];

    function getProduct(prodID){
      fetch('https://fakestoreapi.com/products/' + prodID)
      .then((response) => response.json())
      .then((data) => {
        productsList.push(data);     
        console.log(productsList); 
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
    }
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
          userOrders = data.map((product) => ({
            id: product.id,
            user: product.user_id,
            product: product.product_id,
          }));
          console.log(userOrders);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    // Filter out the current user from the user list
    if(userOrders.length > 0){
    userOrder = userOrders.filter(function (el) {
      if ( el.user ===  currentUser) {
       return el;
      } 
    })
    console.log(userOrder);
    userOrder.forEach(function (arrayItem) {
      getProduct(arrayItem.product);
  });
  }

    
  return (
    <div>
        <Navbar /> 
        <div className="container">
        {userOrder.map((product) => (
      <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
        <h3>{product.product}</h3>
        <button >Add to Cart</button>
      </div>
    ))}
        </div>
    </div>
  );
}

export default Orders;

