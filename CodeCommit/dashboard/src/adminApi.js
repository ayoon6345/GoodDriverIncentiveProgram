export const listUsers = async () => {
  try {
    const response = await fetch('https://lxr0v6oa27.execute-api.us-east-1.amazonaws.com/dev/listUsers', {
      method: 'GET'
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return 'Failed to list users.';
    }
  } catch (error) {
    return error.message;
  }
};

// Add similar functions for other Admin Queries API routes
