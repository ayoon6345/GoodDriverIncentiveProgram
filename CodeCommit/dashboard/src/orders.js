// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './navbar'; // Import the Navbar component
import { getCurrentUser } from 'aws-amplify/auth';
var userOrder = [];

var userOrders = [];
var productsList = [];

function getProduct(prodId){
  fetch('https://fakestoreapi.com/products/'+prodId)
  .then((response) => response.json())
  .then((data) => {
      // Transform the data to match your application's data structure
      productsList.push(data);
  })
  .catch((error) => {
    console.error('Error fetching products:', error);
  });
}

function Orders() {
  getProduct();
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
      console.log(productsList);
  });


    

  }
  return (
    <div>
        <Navbar /> 
        <div className="container">
        <h3>{userOrder}</h3>
        </div>
    </div>
  );
}

export default Orders;


