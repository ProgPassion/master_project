const express = require('express');
const pool = require('./db');
const authenticateToken = require('./authenticateToken');

const router = express.Router();

// Regular user reports road issue
router.post('/reports', authenticateToken, async (req, res) => {
    try {
      const { location, type, description } = req.body;
      const userId = req.userId; // Extracted from the token

      // Store the report in the database
      const newReport = await pool.query(
        'INSERT INTO reports (user_id, location, type, description, submit_timestamp, status) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5) RETURNING *',
        [userId, JSON.stringify(location), type, description, "PENDING"]
      );
  
      res.json(newReport.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

router.get('/get-all-reports', authenticateToken, async(req, res) => {
    try {
        const userId = req.userId;
        console.log(userId);
        const getAllReports = await pool.query(
            'SELECT location, type, description, status FROM reports WHERE user_id = $1',
            [userId]
        );
        
        res.json(getAllReports.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;