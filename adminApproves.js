const express = require('express');
const pool = require('./db');
const authenticateToken = require('./authenticateToken');

const router = express.Router();

router.get('/highest-num-of-reports', authenticateToken, async (req, res) => {
    try {
        const role = req.role;

        if(role !== "admin") {
            return res.status(401).json("Only admin has the rights to see all reports");
        }

        const highestNumberOfReports = await pool.query(
            `SELECT users.username, COUNT(reports.user_id) AS reports_num
            FROM users
            INNER JOIN reports ON reports.user_id = users.id
            WHERE role = 'user'
            GROUP BY users.username, reports.user_id`
        );

        if(highestNumberOfReports.rows.length === 0) {
            return res.status(401).json("There are no reports submited yet");
        }

        const response = [];
        for(const element of highestNumberOfReports.rows) {
            const reportsIds = await pool.query(
                `SELECT reports.id FROM reports INNER JOIN users ON
                users.id = reports.user_id WHERE users.username = $1`,
                [element.username]
            );
            element.reportsIds = reportsIds.rows.map(row => {
                return row.id;
            });
            response.push(element);
        }

        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});


router.get('/highest-num-of-reports-approved', authenticateToken, async (req, res) => {
    try {
        const role = req.role;

        if(role !== "admin") {
            return res.status(401).json("Only admin has the rights to see all reports");
        }

        const highestNumberOfApprovedReports = await pool.query(
            `SELECT users.username, COUNT(reports.user_id) AS reports_num
            FROM users
            INNER JOIN reports ON reports.user_id = users.id
            WHERE role = 'user' AND reports.status='ACCEPTED'
            GROUP BY users.username, reports.user_id`
        );

        if(highestNumberOfApprovedReports.rows.length === 0) {
            return res.status(401).json("There are no approved reports yet");
        }

        const response = [];
        for(const element of highestNumberOfApprovedReports.rows) {
            const reportsIds = await pool.query(
                `SELECT reports.id FROM reports INNER JOIN users ON
                users.id = reports.user_id WHERE users.username = $1 AND reports.status='ACCEPTED'`,
                [element.username]
            );
            element.reportsIds = reportsIds.rows.map(row => {
                return row.id;
            });
            response.push(element);
        }

        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/highest-num-of-reports-rejected', authenticateToken, async (req, res) => {
    try {
        const role = req.role;

        if(role !== "admin") {
            return res.status(401).json("Only admin has the rights to see all reports");
        }

        const highestNumberOfRejectedReports = await pool.query(
            `SELECT users.username, COUNT(reports.user_id) AS reports_num
            FROM users
            INNER JOIN reports ON reports.user_id = users.id
            WHERE role = 'user' AND reports.status='REJECTED'
            GROUP BY users.username, reports.user_id`
        );

        if(highestNumberOfRejectedReports.rows.length === 0) {
            return res.status(401).json("There are no approved reports yet");
        }

        const response = [];
        for(const element of highestNumberOfRejectedReports.rows) {
            const reportsIds = await pool.query(
                `SELECT reports.id FROM reports INNER JOIN users ON
                users.id = reports.user_id WHERE users.username = $1 AND reports.status='REJECTED'`,
                [element.username]
            );
            element.reportsIds = reportsIds.rows.map(row => {
                return row.id;
            });
            response.push(element);
        }

        res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin approves or rejects reports
router.put('/give-report-verdict/:id', authenticateToken, async (req, res) => {
    try {
        const role = req.role;

        if(role !== "admin") {
            return res.status(401).json("Only admin has the rights to set verdict for a report");
        }

        const { status } = req.body;
  
        // Update the status of the report in the database
        const updatedReport = await pool.query(
            'UPDATE reports SET status = $1, verdict_timestamp = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
            
        if(updatedReport.rows.length === 0) {
            return res.status(401).json("No report was updated. Please check the report id");
        }    

        res.json(updatedReport.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin deletes a report by id
router.delete('/delete-report/:id', authenticateToken, async (req, res) => {
    try {
        const role = req.role;

        if(role !== "admin") {
            return res.status(401).json("Only admin has the rights to set verdict for a report");
        }

        const deletedReport = await pool.query(
            'DELETE FROM reports WHERE id = $1 RETURNNING *',
            [req.params.id]
        );

        if(deletedReport.rows.length === 0) {
            return res.status(401).json("No report was deleted. Please check the report id");
        }

        res.json("Report was deleted successfully.");
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/get-reports-by-status', authenticateToken, async (req, res) => {
    try {
        const role = req.role;

        if(role !== "admin") {
            return res.status(401).json("Only admin has the rights to set verdict for a report");
        }

        const { status } = req.body;

        const getReportsByStatus = await pool.query(
            'SELECT id, location, type, description, status FROM reports WHERE status = $1',
            [status]
        );

        if(getReportsByStatus.rows.length === 0) {
            return res.status(401).json(`There are no reports with status ${status}`);
        }

        res.json(getReportsByStatus.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;