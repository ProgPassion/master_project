const express = require('express');
const app = express();
const port = 3000;
const authRoutes = require('./auth');

app.use(express.json());

// Add your routes here
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
