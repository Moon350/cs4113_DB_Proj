const express = require('express');
const app = express();
const morgan = require("morgan") //import morgan
const {log} = require("mercedlogger") // import mercedlogger's log function
const cors = require("cors") // import cors
const mysql = require('mysql');

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
const {PORT = 3333} = process.env

// GLOBAL MIDDLEWARE
app.use(cors()) // add cors headers
app.use(morgan("tiny")) // log the request for debugging
app.use(express.json()) // parse json bodies

//used to access css pages
app.use(express.static('views'));


//Make MySQL Database Connection
const connection = mysql.createConnection({
	host : 'localhost',
	database : 'tables',
	user : 'root',
	password : 'sofia'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});



// ROUTES 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Endpoint to handle the HTTP request for retrieving data from the MySQL table
app.get('/getData', (req, res) => {
  // Perform the database query to retrieve data from the table
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Data retrieved successfully
    return res.json(results);
  });
});

// Close the database connection when the application is terminated
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});

// APP LISTENER
app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`))
