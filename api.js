const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});


db.connect((err) => {
  if (err) {
    console.error('Error occurred while connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database successfully.');
});

const authenticate = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

app.get('/data', authenticate, (req, res) => {
  db.query('SELECT * FROM your_table', (err, results) => {
    if (err) {
      console.error('Error occurred while fetching data: ' + err.stack);
      res.status(500).send('An error occurred while fetching data.');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Application started on port ${port}.`);
});
