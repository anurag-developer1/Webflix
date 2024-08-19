
const User = require('../models/userModel');

const mongoose=require('mongoose');

const jwt = require("jsonwebtoken");

const verifytoken = async (req, res) => {
 
    const token = req.body.token;
    console.log('verify token route hit')
    console.log(token)
    
  
    if (!token) {
      return res.status(401).json({ isValid: false, error: 'No token provided' });
    }
  
    let connection;
    try {
      connection = await mongoose.connect(process.env.MONGODB_URI);
      
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        
      } catch (jwtError) {
        console.error('JWT verification error:', jwtError);
        return res.status(401).json({ isValid: false, error: 'Invalid token' });
      }
  
      const user = await User.findById(decoded.userId);
      if (!user) {
        
        return res.status(401).json({ isValid: false, error: 'User not found' });
      }
      
      res.json({ isValid: true, userId: user._id });
    } catch (error) {
      console.error('General error:', error);
      res.status(500).json({ isValid: false, error: 'Server error' });
    } finally {
      if (connection) {
        await mongoose.connection.close();
        
      }
    }
  }

  module.exports = {verifytoken,}

