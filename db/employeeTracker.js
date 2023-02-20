const mysql = require('mysql2');
const {getAllEmployeeQuery} = require('./queries');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employeeTracker_db'
});

// connect to the database
connection.connect ((err) => {
    if (err) {
        console.error('Error connecting to database: + err.stack');
        return;
    }
    console.log('Connected to database with connection ID' + connection.threadId);

});

// Execute the SQL queries in the SQL file
connection.query(getAllEmployeeQuery, (err, results, fields) => {
    if (err) {
        console.error('Error executing SQL queries: err.stack');
        return;
    }
    console.log('Database schema and tables created successfully.');
});

// Close the connection to the database
connection.end();