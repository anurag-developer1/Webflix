// middleware.js

const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://movie-tv-app-phi.vercel.app', 'https://delightful-fudge-553d4a.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// JWT verification middleware
function authenticateToken(req, res, next) {
  console.log('verifying token');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


const secureHeaders = helmet();
const logRequests = morgan('combined');

// Export the middleware functions
module.exports = {
  corsOptions,
  authenticateToken,secureHeaders,logRequests
};