import React, { useState, useEffect } from 'react';

function ProductCatalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => response.json())
      .then((data) => {
        // Transform the data to match your application's data structure
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
      <h2>Product Catalog</h2>
      <div>
        {products.map((product) => (
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

export default ProductCatalog;
