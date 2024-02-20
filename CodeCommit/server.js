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

// Add this line to parse JSON bodies
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dashboard/build')));

app.get('/about', (req, res) => {
  connection.query('SELECT * FROM about_page_data', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    const aboutData = results[0];
    fs.readFile(__dirname + '/dashboard/public/about.html', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file: ' + err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }
      data = data.replace('${team_number}', aboutData.team_number)
                 .replace('${version_number}', aboutData.version_number)
                 .replace('${release_date}', new Date(aboutData.release_date).toLocaleDateString())
                 .replace('${product_name}', aboutData.product_name)
                 .replace('${product_description}', aboutData.product_description);
      res.send(data);
    });
  });
});

app.post('/api/update-about', (req, res) => {
  const { team_number, version_number, release_date, product_name, product_description } = req.body;
  const sql = 'UPDATE about_page_data SET team_number = ?, version_number = ?, release_date = ?, product_name = ?, product_description = ? WHERE id = 1';
  connection.query(sql, [team_number, version_number, release_date, product_name, product_description], (err, result) => {
    if (err) {
      console.error('Error updating data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(req.body); // Send back the updated data
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/build', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});