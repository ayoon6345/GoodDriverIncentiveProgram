import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import Home from './home';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard';
import ProductSearch from './ProductSearch';

const App = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<DriverDashboard />} /> 
        <Route path="/search" element={<ProductSearch />} /> 
      </Routes>
    </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
