import React from 'react';
import { useCart } from './CartContext'; // Adjust the import path based on where your context is located

function ShoppingCartPage() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 && <p>Your cart is empty</p>}
      {cartItems.map((item, index) => (
        <div key={item.id} style={{ marginBottom: '10px' }}>
          <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
          <span>{item.name}</span> - 
          <span> Points: {item.price}</span>
          <button onClick={() => removeFromCart(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default ShoppingCartPage;
