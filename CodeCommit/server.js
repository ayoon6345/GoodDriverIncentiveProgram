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
  res.sendFile(__dirname + '/public/about.html');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
