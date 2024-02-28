import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import './amplify-config';
import LandingPage from './Landing';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard';
import reportWebVitals from './reportWebVitals';

const App = () => (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={
          <AmplifyAuthenticator>
            <AboutUs />
            <AmplifySignOut />
          </AmplifyAuthenticator>
        } />
        <Route path="/dashboard" element={<DriverDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.render(<App />, document.getElementById('root'));
reportWebVitals();
