const express = require('express');
const mysql = require('mysql');

const app = express();
const config = require('../../config.js');

const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.get('/about', (req, res) => {
    db.query('SELECT * FROM credentials', (err, result) => {
        if (err) throw err;
        res.send(`
            <h1>About Page</h1>
            <p>Version #: ${result[0].version}</p>
            <p>Release Date: ${result[0].release_date}</p>
            <p>Product Name: ${result[0].product_name}</p>
            <p>Product Description: ${result[0].product_description}</p>
        `);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});