const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');

const router = express.Router();

router.get('/create-admin', async (req, res) => {
    try {

        // check if admin user already exists
        const checkAdmin = await pool.query(
            `SELECT * FROM users WHERE username = 'admin'`
        );

        if(checkAdmin.rows.length > 0) {
            return res.status(401).json("Admin user already exists.");
        }    

        const password = "test123";
        const hashedPassword = await bcrypt.hash(password, 10);  

        const createAdmin = await pool.query(
            `INSERT INTO users(username, password, role) 
            VALUES($1, $2, $3) RETURNING *`,
            ["admin", hashedPassword, "admin"]
        );

        if(createAdmin.rows.length === 0) {
            return res.status(401).json("Admin user wasn't created with success");
        }

        res.json("Admin user created successfully!");
            
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;