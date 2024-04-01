import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';

// Import your dashboard components
import DriverDashboard from './DriverDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardWrapper = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const session = await fetchAuthSession();
        const username = session.idToken.payload['cognito:username'];
        // Assuming you have an endpoint that returns the userType based on username
        const response = await fetch(`/api/getUserType?username=${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include any necessary authorization or authentication headers
          },
        });
        
        if (response.ok) {
          const { userType } = await response.json();
          setUserType(userType);
        } else {
          throw new Error('Failed to fetch user type');
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
        navigate('/'); // Redirect to a default page on error
      }
    };

    fetchUserType();
  }, [navigate]);

  if (!userType) return <div>Loading...</div>; // Or any other loading state representation

  // Render the appropriate dashboard based on userType
  switch (userType) {
    case 'admin':
      return <AdminDashboard />;
    case 'driver':
      return <DriverDashboard />;
    default:
      return <div>Unauthorized Access</div>; // Handle unknown userType or unauthorized access
  }
};
