import React from 'react';
import './App.css'; // Import your CSS for styling

function LandingPage() {
  return (
    <div>
      <div className="navbar">
        <a href="/">Home</a>
        <a href="https://team29cpsc4911login.auth.us-east-1.amazoncognito.com/login?client_id=79svo07u2k8h4oea15mh3krra7&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fteam29.cpsc4911.com%2Fdashboard" className="login-button">Login / Sign Up</a>
      </div>
      <div className="container">
        <h1>Good Truck Driver Incentive Program</h1>
        <p>Spring 2024</p>
        <section className="content">
          <h1>Sample Landing Page</h1>
        </section>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Good Truck Driver Incentive Program. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
