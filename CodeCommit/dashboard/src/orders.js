
// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './navbar'; // Import the Navbar component
import { getCurrentUser } from 'aws-amplify/auth';
var userOrder = [];
var productsList = [];

function getProduct(prodID){
  fetch('https://fakestoreapi.com/products' + prodID)
  .then((response) => response.json())
  .then((data) => {
            // Transform the data to match your application's data structure
            const order = data.map((product) => ({
              id: product.id,
              name: product.title,
              price: Math.round(product.price * 100), // Convert price to points (assuming 1 point = $0.01)
              availability: 'In stock', // Fake Store API doesn't provide availability, so we'll just assume everything is in stock
              description: product.description,
              image: product.image,
            }));
            productsList.push(order);
  })
  .catch((error) => {
    console.error('Error fetching products:', error);
  });
}
function Orders() {
    const [userOrders, setOrderData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [products, setProducts] = useState([]);

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

    userOrder = userOrders.filter(function (el) {
      if ( el.user ===  currentUser) {
        return el;
      } 
    });
    userOrder.forEach(function (arrayItem) {
      getProduct(arrayItem.product);
  });
    console.log(productsList);
  return (
    <div>
        <Navbar /> 
        <div className="container">
        {userOrder.map((product) => (
      <div > 
        <h3>{product.user}</h3>
        <h3>{product.product}</h3>
        <button >Add to Cart</button>
      </div>
    ))}
        </div>
    </div>
  );
}

export default Orders;
