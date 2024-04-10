// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './navbar'; // Import the Navbar component
import { getCurrentUser } from 'aws-amplify/auth';
var userOrder = [];
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
function Orders() {
    const [userOrders, setOrderData] = useState([]);
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
          setOrderData(allItems);
          userOrder = userOrders.filter(function (el) {
            if ( el.user ===  currentUser) {
              getProduct(el.product);
              return el;
            } 
          })
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    
  return (
    <div>
        <Navbar /> 
        <div className="container">
        {productsList.map((product) => (
      <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
        <h3>{product.name}</h3>
        <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
        <p style={{ fontStyle: 'italic' }}>Availability: {product.availability}</p>
        <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
        <button >Add to Cart</button>
      </div>
    ))}
        </div>
    </div>
  );
}

export default Orders;

