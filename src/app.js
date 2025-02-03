const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

// Load environment variables
const port = process.env.PORT || 3000;
const SQLHost = process.env.SQL_HOST || "";
const SQLUser = process.env.SQL_USER || "root";
const SQLPassword = process.env.SQL_PASSWORD || "";

const app = express();

// Setup MySQL connection
const db = mysql.createConnection({
    host: SQLHost,
    user: SQLUser,
    password: SQLPassword,
    database: "demoapp"
});

// Connect to MySQL database
db.connect(err => {
    if(err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log(`Database connected to ${SQLUser}@${SQLHost}`);
    const query = "CREATE TABLE IF NOT EXISTS Users (UUID SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT, Username VARCHAR(30) NOT NULL, Pass CHAR(60) NOT NULL, Email VARCHAR(60), Birthday VARCHAR(60), PRIMARY KEY(UUID), UNIQUE(Username), UNIQUE(Email))"
    db.query(query, (err, result) => {
        if(err) {
            console.error("Failed to setup database table!");
            throw err;
        }
    })
})

// Enable JSON request payloads
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('Server is live!');
});

// Create a new user
app.post('/user', (req, res) => {
    const username = req.body.username || "";
    const password = req.body.password || "";
    const email = req.body.email || "";
    const birthday = new Date(req.body.birthday || "2000-01-01");
    const query = 'INSERT INTO Users (Username, Pass, Email, Birthday) VALUES(?, ?, ?, ?)';

    bcrypt.hash(password, 5, (err, hash) => {
        db.query(query, [username, hash, email, birthday.toISOString()], (err, result) => {
            if(err) {
                res.status(500).json({ message: `Failed to add user ${username}`, error: err });
                console.log(`Failed to create user: ${username}`);
                return;
            }
            res.json({ message: `User '${username}' created successfully!` });
            console.log(`Created user: ${username}`);
        })
    });
});

// Initialize Express
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`)
});