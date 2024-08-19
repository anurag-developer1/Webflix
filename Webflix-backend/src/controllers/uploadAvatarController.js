
const Profile=require('../models/profileModel');
const mongoose=require('mongoose');
const uploadCloudinary = require('../utils/cloudinary');
const path = require('path');



const uploadAvatar=async(req,res)=>{ try {
    // Check if file exists
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
     // Upload to Cloudinary
     const cloudinaryResult = await uploadCloudinary(path.join(__dirname, '..','..', 'public', 'img', 'users', req.file.filename));
     if (!cloudinaryResult) {
       return res.status(500).json({ message: 'Error uploading to Cloudinary' });
     }
    

    await mongoose.connect(process.env.MONGODB_URI);

    // Update the profile picture field
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.body.userId },
      { profilePicture: cloudinaryResult.croppedUrl, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile picture updated successfully', profile: updatedProfile });
  } catch (error) {
    console.error('Error in file upload:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
  }
    
}
module.exports={uploadAvatar,}

