import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard';
import reportWebVitals from './reportWebVitals';
import { withAuthenticator } from '@aws-amplify/ui-react'; // Import withAuthenticator

const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

const AppWithAuth = withAuthenticator(App, { includeGreetings: true }); // Wrap the App component with withAuthenticator

ReactDOM.render(<AppWithAuth />, document.getElementById('root'));

reportWebVitals();
