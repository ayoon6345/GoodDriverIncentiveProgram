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

app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

app.post('/api/createUserInMySQL', (req, res) => {
  const { user_id, name, email, phone_number, userType } = req.body; // Get user details from request body

  const query = `INSERT INTO users (user_id, name, email, phone_number, usertype) VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [user_id, name, email, phone_number, userType], (err, results) => {
    if (err) {
      console.error('Error adding user to MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).send(`User ${user_id} added successfully to MySQL database.`);
  });
});

app.get('/api/getUsers', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of user data
  });
});


app.get('/api/applications', (req, res) => {
  connection.query('SELECT * FROM applications', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    const applicationData = results[0];
    res.json(applicationData);
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
