const jwt = require('jsonwebtoken');

// Middleware to validate the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      req.userId = user.userId;
      req.role = user.role;
      next();
    });
  };

  module.exports = authenticateToken;