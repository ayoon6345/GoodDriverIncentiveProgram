import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './navbar';
import ProductCatalog from './ProductCatalog';
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);


function ChooseItemsForCatalog() {

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState([]);

  const fetchUserData = () => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        setUserData(data);
        // Optionally reset update status here if you prefer it to clear on data fetch instead of on mount
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  useEffect(() => {
    fetchUserData();
    console.log(userData);
    }
  );


  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => response.json())
      .then((data) => {
        const transformedData = data.map((product) => ({
          id: product.id,
          name: product.title,
          price: Math.round(product.price * 100), // Convert price to points (assuming 1 point = $0.01)
          availability: 'In stock', // Fake Store API doesn't provide availability, so we'll just assume everything is in stock
          description: product.description,
          image: product.image,
        }));
        setProducts(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div>
      <h1>Your Catalog</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {products.map((product) => (
          <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{product.name}</h3>
            <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
            <p style={{ fontStyle: 'italic' }}>Availability: {product.availability}</p>
            <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
            <button onClick={() => onAddToCatalog(product.id,)}>Add to Catalog</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SponsorCatalog() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  return (
    <div>
        <Navbar />
        <div className="container">
        <h1>Sponsor Catalog</h1>
        <nav>
          <button onClick={() => changeView('catalog')}>All Items</button>
          <button onClick={() => changeView('choose_catalog')}>Your Catalog</button>
        </nav>
        {activeView === 'catalog' && <ProductCatalog />}
        {activeView === 'choose_catalog' && <ChooseItemsForCatalog />}
        </div>
    </div>
  );
}

export default withAuthenticator(SponsorCatalog);