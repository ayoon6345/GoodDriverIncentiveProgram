// ProductCatalog.js
import React, { useState, useEffect } from 'react';

function ProductCatalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from API or database
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
            <img src={product.image} alt={product.name} />
            {/* Add button to "purchase" product */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;
