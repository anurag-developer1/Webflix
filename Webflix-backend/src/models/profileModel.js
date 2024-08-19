const mongoose = require('mongoose');
const User = require('./userModel'); // Import user schema

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, ref: 'User' },
  email: { type: String, ref: 'User' },// Assuming email is a string
  fullName: { type: String, required: false },
  dateOfBirth: { type: Date, default: null }, // Set default value to null for optional field
 
  
  profilePicture: {
    type: String,
    maxlength: [1000, 'Profile picture URL is too long']
  }, // URL to profile picture
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;