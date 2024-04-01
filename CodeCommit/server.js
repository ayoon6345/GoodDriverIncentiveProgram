const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const config = require('../../config.js');

// Middleware to parse JSON bodies
app.use(express.json());

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

// Handle createUser request
app.post('/createUser', (req, res) => {
  const { email, username } = req.body;
  if (!email || !username) {
    res.status(400).send('Email and username are required');
    return;
  }

  const query = 'INSERT INTO users (email, username) VALUES (?, ?)';
  connection.query(query, [email, username], (err, results) => {
    if (err) {
      console.error('Error inserting data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(`User ${username} added successfully.`);
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
