import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function GetSponsorCatalog() {
  const [catalogData, setCatalogData] = useState([]);

  useEffect(() => {
    fetch('/api/getCatalog/14321')
      .then(response => response.json())
      .then(data => {
        setCatalogData(data);
        console.log("Catalog data");
        console.log(catalogData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  const idsArray = catalogData.map(product => product.id);

  return idsArray;
}


function ChooseItemsForCatalog() {
  
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState([]);
  const [catalogData, setCatalogData] = useState([]);//Getting sponsor catalog product ids

  useEffect(() => {
    fetch('/api/getCatalog/14321')
      .then(response => response.json())
      .then(data => {
        console.log("Data");
        console.log(data);
        setCatalogData(data.map(product => product.id));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const addToCatalog = (productId,sponsorId) => {
    console.log("adding" + productId);
    
    fetch('/api/addToCatalog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sponsorId, productId }),
    })
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(data => Promise.reject(data));
        } else {
          return response.text().then(text => Promise.reject(text));
        }
      }
      return contentType && contentType.indexOf("application/json") !== -1
        ? response.json()
        : response.text();
    })
    .then(data => {
      console.log('Response:', data);
      const successStatus = { success: true, message: 'Catalog updated successfully.' };
    })
    .catch(error => {
      console.error('Error adding to catalog:', error);
      // Determine if error is an object (from JSON) or text, and set message accordingly
      const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error submitting application' };
    });
  }
    
  useEffect(() => {
    if (catalogData.length > 0) {  // Check to prevent running before data is fetched
      fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
          console.log("This is the catalog data");
          console.log(catalogData);
          const filteredData = data.filter(product => !catalogData.includes(product.id));
          console.log("Filtered data");
          console.log(filteredData);
          const transformedData = filteredData.map((product) => ({
            id: product.id,
            name: product.title,
            price: Math.round(product.price * 100), // Convert price to points
            availability: 'In stock',
            description: product.description,
            image: product.image,
          }));
          setProducts(transformedData);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [catalogData]); // Include catalogData in the dependency array



  return (
    <div>
      <h1>Choose Items for Catalog</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {products.map((product) => (
          <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{product.name}</h3>
            <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
            <p style={{ fontStyle: 'italic' }}>Availability: {product.availability}</p>
            <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
            <button onClick={() => addToCatalog(product.id,'14321')}>Add to Catalog</button>
          </div>
        ))}
      </div>
    </div>
  );
}



function UniqueCatalog() {
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState([]);
  const [catalogData, setCatalogData] = useState([]);//Getting sponsor catalog product ids

  useEffect(() => {
    fetch('/api/getCatalog/14321')
      .then(response => response.json())
      .then(data => {
        console.log("Data");
        console.log(data);
        setCatalogData(data.map(product => product.id));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const addToCatalog = (productId,sponsorId) => {
    console.log("adding" + productId);
    
    fetch('/api/addToCatalog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sponsorId, productId }),
    })
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(data => Promise.reject(data));
        } else {
          return response.text().then(text => Promise.reject(text));
        }
      }
      return contentType && contentType.indexOf("application/json") !== -1
        ? response.json()
        : response.text();
    })
    .then(data => {
      console.log('Response:', data);
      const successStatus = { success: true, message: 'Catalog updated successfully.' };
    })
    .catch(error => {
      console.error('Error adding to catalog:', error);
      // Determine if error is an object (from JSON) or text, and set message accordingly
      const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error submitting application' };
    });
  }
    
  useEffect(() => {
    if (catalogData.length > 0) {  // Check to prevent running before data is fetched
      fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
          console.log("This is the catalog data");
          console.log(catalogData);
          const filteredData = data.filter(product => catalogData.includes(product.id));
          console.log("Filtered data");
          console.log(filteredData);
          const transformedData = filteredData.map((product) => ({
            id: product.id,
            name: product.title,
            price: Math.round(product.price * 100), // Convert price to points
            availability: 'In stock',
            description: product.description,
            image: product.image,
          }));
          setProducts(transformedData);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [catalogData]); // Include catalogData in the dependency array



  return (
    <div>
      <h1>Choose Items for Catalog</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {products.map((product) => (
          <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{product.name}</h3>
            <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
            <p style={{ fontStyle: 'italic' }}>Availability: {product.availability}</p>
            <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
            <button onClick={() => addToCatalog(product.id,'14321')}>Add to Catalog</button>
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
        <div className="container">
        <h1>Sponsor Catalog</h1>
        <nav>
          <button onClick={() => changeView('unique_catalog')}>Your Catalog</button>
          <button onClick={() => changeView('choose_catalog')}>Choose Items</button>
        </nav>
        {activeView === 'unique_catalog' && <UniqueCatalog />}
        {activeView === 'choose_catalog' && <ChooseItemsForCatalog />}
        </div>
    </div>
  );
}

export default withAuthenticator(SponsorCatalog);