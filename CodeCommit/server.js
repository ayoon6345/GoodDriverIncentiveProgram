const express = require('express');
const mysql = require('mysql');
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

app.use(express.static('public'));


app.get('/about', (req, res) => {
  connection.query('SELECT * FROM about_page_data', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    const aboutData = results[0];
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>About Us</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            color: #333;
          }
          .navbar {
            background-color: #333;
            color: #fff;
            padding: 10px 20px;
          }
          .navbar a {
            color: #fff;
            text-decoration: none;
            margin-right: 20px;
          }
          .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            margin-bottom: 10px;
          }
          a {
            text-decoration: none;
            color: #007bff;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="navbar">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
        </div>
        <div class="container">
          <h1>About Us</h1>
          <p>Team #: ${aboutData.team_number}</p>
          <p>Version #: ${aboutData.version_number}</p>
          <p>Release Date: ${aboutData.release_date}</p>
          <p>Product Name: ${aboutData.product_name}</p>
          <p>Product Description: ${aboutData.product_description}</p>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
