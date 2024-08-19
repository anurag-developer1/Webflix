const User = require('../models/userModel');

const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");

const login =async (req, res) => {
 
    let connection;
    try {
      // Open MongoDB connection
      connection = await mongoose.connect(process.env.MONGODB_URI);
      
  
      const { email, password } = req.body;
      
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email' });
      }
  
      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Generate an access token
      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h' // Token expires in 1 hour
      });
      
  
      // Send the access token in the response
      res.status(200).json({ message: 'Login successful', jwtToken: accessToken, userId: user._id });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      // Close the MongoDB connection
      if (connection) {
        await mongoose.connection.close();
        
      }
    }
  }
  module.exports={login,}