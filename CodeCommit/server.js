const express = require('express');
const mysql = require('mysql');
const React = require('react-jsx');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const About = require('./src/about.js'); // Path to your About component
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/about', (req, res) => {
  connection.query('SELECT * FROM about_page_data', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    const aboutData = results[0];
    const appHtml = ReactDOMServer.renderToString(<About aboutData={aboutData} />);
    const indexHtmlPath = path.resolve(__dirname, 'public', 'about.html');
    fs.readFile(indexHtmlPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file: ' + err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }
      data = data.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      res.send(data);
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
