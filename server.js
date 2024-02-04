const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));


const db = new sqlite3.Database('mydatabase1.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err);
        return;
    }
    console.log('Connected to SQLite database');
    
    
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            course TEXT
        )
    `);
});


app.post('/submit', (req, res) => {
    const { name, email, course } = req.body;
    const sql = 'INSERT INTO users (name, email, course) VALUES (?, ?, ?)';
    db.run(sql, [name, email, course], function (err) {
        if (err) {
            console.error('Error inserting data into the table:', err);
            res.send('Error submitting ');
        } else {
            console.log(`Data inserted successfully with ID: ${this.lastID}`);
            res.send('Registered successfully');
        }
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
