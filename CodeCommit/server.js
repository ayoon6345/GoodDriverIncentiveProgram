const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const app = express();
const config = require('../../config.js');

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


// Import body-parser to parse request bodies
// Make sure to install it using npm if you haven't already
const bodyParser = require('body-parser');

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to create a new user in the database
app.post('/api/createUser', (req, res) => {
  const { username, email } = req.body;
  
  // SQL query to insert the new user
  const query = 'INSERT INTO users (username, email) VALUES (?, ?)';
  
  connection.query(query, [username, email], (err, results) => {
    if (err) {
      console.error('Error inserting data: ' + err.stack);
      res.status(500).send('Failed to create user');
      return;
    }
    res.status(200).send(`User ${username} created successfully.`);
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
