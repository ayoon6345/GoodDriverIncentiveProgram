import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard'; // Import the dashboard component
import reportWebVitals from './reportWebVitals';
import '../../../amplify-config';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<DriverDashboard />} /> {/* Add the dashboard route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
