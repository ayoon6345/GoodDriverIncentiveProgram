// Import necessary modules
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

// Create Express app
const app = express();
const config = require('../../config.js');

// Create MySQL connection
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'dashboard/build')));

const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log' })
  ]
});

app.get('/about', (req, res) => {
  connection.query('SELECT * FROM about_page_data', (err, results) => {
    if (err) {
      logger.error('Error fetching data:', err); // Log the error to a file
      res.status(500).send('Internal Server Error');
      return;
    }
    const aboutData = results[0];
    // Pass the retrieved data to the AboutUs component
    res.sendFile(path.join(__dirname, 'dashboard/build', 'index.html'));
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
