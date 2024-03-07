export const addUserToGroup = async (username, groupname) => {
  try {
    const response = await fetch('https://lxr0v6oa27.execute-api.us-east-1.amazonaws.com/dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, groupname })
    });
    if (response.ok) {
      return 'User added to group.';
    } else {
      return 'Failed to add user to group.';
    }
  } catch (error) {
    return error.message;
  }
};


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
