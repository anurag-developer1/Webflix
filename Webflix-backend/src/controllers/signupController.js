const User = require('../models/userModel');
const Profile=require('../models/profileModel');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");

const signup= async (req, res) => {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI);
  
      const { username, email, password } = req.body;
  
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });
  
      // Save the new user to the database
      await newUser.save();
  
      // Create a profile for the newly registered user
      const newProfile = new Profile({
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email
      });
  
      // Save the profile to the database
      await newProfile.save();
  
      // Generate a JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h"
      });
  
      // Respond with success message and token
      res.status(201).json({ message: "User registered successfully", jwtToken: token, userId: newUser._id });
    } catch (error) {
      console.error("registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      // Close the MongoDB connection
      mongoose.connection.close();
    }
  };
  module.exports = {signup,}