const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// SQLite connection setup
const db = new sqlite3.Database('mydatabase1.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
        return;
    }
    console.log('Connected to SQLite database');
    
    // Create the users table if it doesn't exist (including the 'course' column)
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            course TEXT
        )
    `);
});

// Handle form submissions
app.post('/submit', (req, res) => {
    const { name, email, course } = req.body;
    const sql = 'INSERT INTO users (name, email, course) VALUES (?, ?, ?)';
    db.run(sql, [name, email, course], function (err) {
        if (err) {
            console.error('Error inserting data into the table:', err);
            res.send('Error submitting form');
        } else {
            console.log(`Data inserted successfully with ID: ${this.lastID}`);
            res.send('Form submitted successfully');
        }
    });
});

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
