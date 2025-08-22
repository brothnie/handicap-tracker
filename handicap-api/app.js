const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const sqlite3 = require('sqlite3').verbose();

// Server-side Configuration
app.use(cors());
app.use(express.json());

app.post('/handicapApi/authenticateUser', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send({ error: 'Email and password are required' });
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Database error' });
        }
        if (!row || row.password !== password) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        res.send({
            userId: row.id,
            userName: row.name, 
            userEmail: row.email,
            authenticated: true, 
            message: 'Authentication successful' 
        });
    });
});

app.post('/handicapApi/changePassword', (req, res) => {
    const userId = req.body.userId;
    const newPassword = req.body.newPassword;

    if (!userId || !newPassword) {
        return res.status(400).send({ error: 'User ID and new password are required' });
    }

    const sql = `UPDATE users SET password = ? WHERE id = ?`;
    db.run(sql, [newPassword, userId], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Failed to change password', details: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send({ success: true, message: 'Password changed successfully' });
    });
});

app.post('/handicapApi/CreateUser', (req, res)=>{
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    if (!userName || !userEmail || !userPassword) {
        return res.status(400).send({ error: 'Name, Email, and Password are required' });
    }
    
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [userName, userEmail, userPassword], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Failed to create user', details: err.message });
        }
        res.send({ id: this.lastID, name: userName, email: userEmail });
    });
});

// TestDatabase name: test-database.db
// Production Database name: handicap-tracker.db

const db = new sqlite3.Database('./handicap-tracker.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

app.post('/handicapApi/submitRoundData', (req, res) => {
    const { userId, courseName, datePlayed, totalScore, firNumber, girNumber, totalNumberOfPutts, courseRating, slopeRating, totalYards, numberOfHolesPlayed, teePlayed } = req.body;
    if (!userId || !courseName || !datePlayed || !totalScore || !firNumber || !girNumber || !totalNumberOfPutts || !courseRating || !slopeRating || !totalYards || 
        !numberOfHolesPlayed || !teePlayed) {
        return res.status(400).send({ error: 'All fields are required' });
    }
    
    const sql = `INSERT INTO roundData (userId, courseName, datePlayed, totalScore, firNumber, girNumber, totalNumberOfPutts, courseRating, slopeRating, totalYards, numberOfHolesPlayed, teePlayed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [userId, courseName, datePlayed, totalScore, firNumber, girNumber, totalNumberOfPutts, courseRating, slopeRating, totalYards, numberOfHolesPlayed, teePlayed], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Failed to submit round data', details: err.message });
        }
        res.send({ userId, courseName, datePlayed, totalScore, firNumber, girNumber, totalNumberOfPutts, courseRating, slopeRating, totalYards, numberOfHolesPlayed, teePlayed});
    });
});

app.post('/handicapApi/getHandicapData', (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }
    const sql = `SELECT * FROM roundData WHERE userId = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Database error' });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: 'No round data found for this user' });
        }
        res.send(rows);
    });
});

app.post('/handicapApi/getPlayersHandicapIndex', (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }
    const sql = `SELECT totalScore, courseRating, slopeRating, datePlayed FROM roundData WHERE userId = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Database error' });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: 'No round data found for this user' });
        }
        const handicapIndex = calculateHandicapIndex(rows);
        if (handicapIndex === null) {
            console.error('Not enough data to calculate handicap index');
            return res.send({ errorCode: 'notEnoughData', error: 'Not enough data to calculate handicap index' });
        }

        res.send({ handicapIndex });
    });
});

const calculateHandicapIndex = (rounds) => {    
    const differentials = rounds.map(round => {
        const { totalScore, courseRating, slopeRating } = round;
        return ((totalScore - courseRating) * 113) / slopeRating;
    });

    if (rounds.length < 3) {
        return null; // Not enough data to calculate handicap index
    } else {
        differentials.sort((a, b) => a - b);

        const numDifferentialsToUse = Math.min(10, Math.floor(rounds.length / 2));
        const selectedDifferentials = differentials.slice(0, numDifferentialsToUse);

        const averageDifferential = selectedDifferentials.reduce((sum, diff) => sum + diff, 0) / numDifferentialsToUse;

        const handicapIndex = averageDifferential * 0.96;

        return parseFloat(handicapIndex.toFixed(1));
    }
};

app.post('/handicapApi/getFirData', (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }
    const sql = `SELECT firNumber, datePlayed FROM roundData WHERE userId = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Database error' });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: 'No FIR data found for this user' });
        }
        res.send(rows);
    });
});

app.post('/handicapApi/getGIRData', (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }
    const sql = `SELECT girNumber, datePlayed FROM roundData WHERE userId = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Database error' });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: 'No GIR data found for this user' });
        }
        res.send(rows);
    });
});

app.post('/handicapApi/getPuttingData', (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send({ error: 'User ID is required' });
    }
    const sql = `SELECT totalNumberOfPutts, datePlayed, numberOfHolesPlayed FROM roundData WHERE userId = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: 'Database error' });
        }
        if (rows.length === 0) {
            return res.status(404).send({ error: 'No putting data found for this user' });
        }
        res.send(rows);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
    // Example: Create a table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);

    //db.run(`DROP TABLE IF EXISTS roundData`); // Clear existing data for testing
    //db.run(`DROP TABLE IF EXISTS users`); // Clear existing data for testing

    db.run(`CREATE TABLE IF NOT EXISTS roundData (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        courseName TEXT NOT NULL,
        datePlayed TEXT NOT NULL,
        totalScore INTEGER NOT NULL,
        firNumber INTEGER NOT NULL,
        girNumber INTEGER NOT NULL,
        totalNumberOfPutts INTEGER NOT NULL,
        courseRating INTEGER NOT NULL, 
        slopeRating INTEGER NOT NULL, 
        totalYards INTEGER NOT NULL,
        numberOfHolesPlayed INTEGER NOT NULL, 
        teePlayed TEST NOT NULL
    )`);
});