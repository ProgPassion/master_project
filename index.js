const express = require('express');
const app = express();
const port = 3000;
const authRoutes = require('./auth');
const reportsRoutes = require('./reports');

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api', reportsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
