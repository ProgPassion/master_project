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
      res.status(500).send('Server Error');
    }
});

router.get('/get-all-reports', authenticateToken, async(req, res) => {
    try {
        const userId = req.userId;
        const getAllReports = await pool.query(
            'SELECT id, location, type, description, status FROM reports WHERE user_id = $1',
            [userId]
        );
        
        getAllReports.rows.forEach(element => {
          element.location = JSON.parse(element.location);
        });

        res.json(getAllReports.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/reports/:id', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const reportId = req.params.id;

      const getReportById = await pool.query(
        'SELECT location, type, description, status FROM reports WHERE user_id = $1 AND id = $2',
        [userId, reportId]
      );

      if(getReportById.rows.length === 0) {
        return res.status(401).json("Please check the report id because is incorrect");
      }  

      getReportById.rows.forEach(element => {
        element.location = JSON.parse(element.location);
      });

      res.json(getReportById.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');  
  }
});

router.put('/reports/:id', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const reportId = req.params.id;
      const { location, type, description } = req.body;

      const updatedReportById = await pool.query(
        'UPDATE reports SET location = $1, type = $2, description = $3, submit_timestamp = CURRENT_TIMESTAMP, status = $4 WHERE user_id = $5 AND id = $6 RETURNING *',
        [JSON.stringify(location), type, description, "PENDING", userId, reportId]
      );

      if(updatedReportById.rows.length === 0) {
        return res.status(401).json("No report has been updated. Check the report id");
      }

      updatedReportById.rows.forEach(element => {
        element.location = JSON.parse(element.location);
      });

      res.json(updatedReportById.rows[0]);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

router.delete('/reports/:id', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId;
      const reportId = req.params.id;

      const deleteReportById = await pool.query(
        'DELETE FROM reports WHERE user_id = $1 AND id = $2 RETURNING *',
        [userId, reportId]
      );

      if(deleteReportById.rows.length === 0) {
        return res.status(401).json("No report has been deleted. Check the report id");
      }

      res.json("The report was deleted successfully!");
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

module.exports = router;