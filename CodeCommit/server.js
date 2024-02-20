const express = require('express');
const mysql = require('mysql');
const app = express();
const config = require('../../config.js');
const ejs = require('ejs');

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

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

app.use(express.static('public'));

app.get('/about', (req, res) => {
  connection.query('SELECT * FROM about_page_data', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    const aboutData = results[0];
    res.render('about', { aboutData: aboutData });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
