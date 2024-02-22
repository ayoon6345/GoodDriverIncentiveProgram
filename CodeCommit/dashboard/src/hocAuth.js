import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

function withAuth(Component) {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      Auth.currentAuthenticatedUser()
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          // Redirect to login page if not authenticated
          window.location.href = 'https://team29cpsc4911login.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=79svo07u2k8h4oea15mh3krra7&redirect_uri=https%3A%2F%2Fteam29.cpsc4911.com%2Fdashboard';
        });
    }, []);

    return isAuthenticated ? <Component {...props} /> : null;
  };
}

export default withAuth;
