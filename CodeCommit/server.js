const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const app = express();
const config = require('../../config.js');
const amplifyConfig = require('./dashboard/src/amplifyconfiguration.json');

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

// Configure AWS SDK
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: amplifyConfig.aws_project_region,
  accessKeyId: amplifyConfig.aws_access_key_id,
  secretAccessKey: amplifyConfig.aws_secret_access_key
});

app.get('/api/list-users', (req, res) => {
  console.log('Fetching user data...');
  const params = {
    UserPoolId: amplifyConfig.aws_user_pools_id,
    AttributesToGet: [
      'email',
      'phone_number',
      'custom:your-custom-attribute'
    ]
  };

  cognito.listUsers(params, (err, data) => {
    if (err) {
      console.error('Error listing users:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    console.log('User data fetched successfully:', data);
    const users = data.Users.map(user => ({
      Username: user.Username,
      Attributes: user.Attributes.reduce((acc, attr) => {
        acc[attr.Name] = attr.Value;
        return acc;
      }, {})
    }));

    console.log('Sending user data:', users);
    res.json(users);
  });
});


// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'dashboard/build')));

app.get('/api/about', (req, res) => {
  connection.query('SELECT * FROM about_page_data', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    const aboutData = results[0];
    aboutData.release_date = new Date(aboutData.release_date).toLocaleDateString();
    res.json(aboutData);
  });
});

// For all other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/build', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
