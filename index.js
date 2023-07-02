const express = require('express');
const app = express();
const port = 3000;
const authRoutes = require('./auth');
const reportsRoutes = require('./reports');
const adminReportsRoutes = require('./adminApproves');
const adminCreationRoutes = require('./adminCreation');

app.use(express.json());

// Routes
app.use('/auth', adminCreationRoutes);
app.use('/auth', authRoutes);
app.use('/api', reportsRoutes);
app.use('/api', adminReportsRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
