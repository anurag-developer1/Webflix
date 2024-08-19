

const mongoose=require('mongoose');
const Profile=require('../models/profileModel');

const getprofilepic=async (req, res) => {
    try {
      const userId = req.query.userId;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      await mongoose.connect(process.env.MONGODB_URI);
  
      const profile = await Profile.findOne({ userId: userId });
  
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.status(200).json({ 
        profilePicUrl: profile.profilePicture,
        
      });
  
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      res.status(500).json({ message: 'Error fetching profile picture', error: error.message });
    } finally {
      await mongoose.connection.close();
    }
  };

  module.exports = { getprofilepic ,}