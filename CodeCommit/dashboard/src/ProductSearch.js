import React, { useState, useEffect } from 'react';
import Navbar from './navbar'; // Import the Navbar component
function ProductSearch() {
  var newList = [];
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => response.json())
      .then((data) => {
                // Transform the data to match your application's data structure
                const allItems = data.map((product) => ({
                  id: product.id,
                  name: product.title,
                  price: Math.round(product.price * 100), // Convert price to points (assuming 1 point = $0.01)
                  availability: 'In stock', // Fake Store API doesn't provide availability, so we'll just assume everything is in stock
                  description: product.description,
                  image: product.image,
                }));
                setProducts(allItems)  
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);
console.log(products);
  var d = localStorage.getItem("searchinput");
  newList = products.filter(function (el) {
    if ( el.name.toLowerCase().indexOf( d ) > -1 ) {
      return el;
    } 
  });
console.log(newList);
  return (
    <div>
        <Navbar /> 
        <div className="container">
      <h2>Product Catalog</h2>
      {newList.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>Points: {product.price}</p>
            <p>Availability: {product.availability}</p>
            <p>Description: {product.description}</p>
            <img src={product.image} alt={product.name} style={{ width: '100px' }} />
            {/* Add button to "purchase" product */}
          </div>
        ))}
    </div>
    </div>
  );
}

export default ProductSearch;
