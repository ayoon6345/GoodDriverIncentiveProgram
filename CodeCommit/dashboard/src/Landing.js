import React from 'react';
import './App.css'; // Import your CSS for styling

function LandingPage() {
  const handleLoginClick = () => {
    window.location.href = 'https://team29cpsc4911login.auth.us-east-1.amazoncognito.com';
  };

  return (
    <div>
      <div className="navbar">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <button className="login-button" onClick={handleLoginClick}>Login / Sign Up</button>
      </div>
      <div className="container">
        <h1>Good Truck Driver Incentive Program</h1>
        <p>Spring 2024</p>
        <section className="content">
          <h1>Sample Landing Page</h1>
        </section>
        <footer className="footer">
          <p>&copy; 2024 Good Truck Driver Incentive Program. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
