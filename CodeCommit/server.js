const https = require('https');
const fs = require('fs');
const mysql = require('mysql');
const config = require('../../config');

const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const server = https.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index') { // Updated to handle /about request
        fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading HTML file:', err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
                return;
            }
            
            connection.query('SELECT * FROM about_page_data', (err, results) => {
                if (err) {
                    console.error('Error querying MySQL database:', err);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                    return;
                }
                
                const aboutData = results[0];
                const html = data
                    .replace('<span id="teamNumber"></span>', `<span id="teamNumber">${aboutData.team_number}</span>`)
                    .replace('<span id="versionNumber"></span>', `<span id="versionNumber">${aboutData.version_number}</span>`)
                    .replace('<span id="releaseDate"></span>', `<span id="releaseDate">${aboutData.release_date}</span>`)
                    .replace('<span id="productName"></span>', `<span id="productName">${aboutData.product_name}</span>`)
                    .replace('<span id="productDescription"></span>', `<span id="productDescription">${aboutData.product_description}</span>`);

                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(html);
            });
        });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
