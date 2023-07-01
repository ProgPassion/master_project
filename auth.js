const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authenticateToken = require('./authenticateToken');

const router = express.Router();

// User registration
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Hash the password
    const userRequestRole = req.role;
    res.json(userRequestRole);
    return;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the user in the database
    const newUser = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );

    res.json("User successfully created");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve the user from the database
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credentials');
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!passwordMatch) {
      return res.status(401).json('Invalid Credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
