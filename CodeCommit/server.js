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
app.get('/api/getCart', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(results);
    res.json(results); // Return the entire array of cart data
  });
});
app.get('/api/getApplications', (req, res) => {
  connection.query('SELECT * FROM applications', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of user data
  });
});

// Endpoint to add a driver application to the DB
app.post('/api/addApplication', (req, res) => {
  const { sponsorId, driverId, firstName, lastName, phone, email } = req.body;
  const query = 'INSERT INTO applications (sponsor_id, driver_id, first_name, last_name, phone, email) VALUES (?, ?, ?, ?, ?, ?)';

  connection.query(query, [sponsorId, driverId, firstName, lastName, phone, email], (err, results) => {
    if (err) {
      console.error('Error updating user points in MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      // No user found with the provided ID
      return res.status(404).send('User not found');
    }
    res.status(200).send(`Application added successfully`);
  });
});

app.get('/api/getCatalog:sponsorId', (req, res) => {

  const sponsorId = req.params.sponsorId;

  connection.query('SELECT * FROM catalogs WHERE sponsor_id = ?', [sponsorId], (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of user data
  });
});

app.post('/api/addToCatalog', (req, res) => {
  const { sponsorId, productId } = req.body;
  const query = 'INSERT IGNORE INTO catalogs (sponsor_id, product_id) VALUES (?, ?)';

  connection.query(query, [sponsorId, productId], (err, results) => {
    if (err) {
      console.error('Error adding sponsor product to MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      return res.status(200).send('Sponsor product already exists');
    }
    res.status(201).send('Sponsor product added successfully');
  });
});


// Endpoint to update user points
app.post('/api/updatePoints', (req, res) => {
  const { userId, newPoints } = req.body;
  const query = 'UPDATE users SET points = ? WHERE user_id = ?';

  connection.query(query, [newPoints, userId], (err, results) => {
    if (err) {
      console.error('Error updating user points in MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      // No user found with the provided ID
      return res.status(404).send('User not found');
    }
    res.status(200).send(`Points updated successfully for user ${userId}.`);
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

// Calling Assistant API function
app.post('/api/consultPoint', async (req, res) => {
  const { driverActionDescription, sponsorPointRatio } = req.body;
  const advice = await getPointAdvice(driverActionDescription, sponsorPointRatio);
  res.json({ advice });
});


// For all other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/build', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
