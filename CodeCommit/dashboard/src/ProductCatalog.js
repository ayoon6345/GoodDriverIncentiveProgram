import React, { useState, useEffect } from 'react';

function ProductCatalog() {
  const [products, setProducts] = useState([]);

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
    <div style={{ padding: '20px' }}>
      <h2>Product Catalog</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {products.map((product) => (
          <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{product.name}</h3>
            <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
            <p style={{ fontStyle: 'italic' }}>Availability: {product.availability}</p>
            <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
            {/* Placeholder for future "purchase" button */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;
