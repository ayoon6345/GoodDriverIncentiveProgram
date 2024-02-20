const express = require('express');
const mysql = require('mysql');
const app = express();
const config = require('../../../config.js');

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
      </head>
      <body>
        <h1>About Us</h1>
        <p>Team #: ${aboutData.team_number}</p>
        <p>Version #: ${aboutData.version_number}</p>
        <p>Release Date: ${aboutData.release_date}</p>
        <p>Product Name: ${aboutData.product_name}</p>
        <p>Product Description: ${aboutData.product_description}</p>
        <a href="/">Home</a>
      </body>
      </html>
    `;
    res.send(html);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
