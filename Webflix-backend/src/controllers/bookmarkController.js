const User = require('../models/userModel');

const mongoose=require('mongoose');

const bookmark=async (req, res) => {
    let connection;
    try {
      // Open MongoDB connection
      await mongoose.connect(process.env.MONGODB_URI);
      
      connection = mongoose.connection;
  
      const { userId, action } = req.query;
      const { mediaType, details } = req.body;
      console.log(mediaType,details)
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      let bookmarkList;
      if (mediaType === 'movie') {
        bookmarkList = user.movieBookmarks;
      } else if (mediaType === 'tv') {
        bookmarkList = user.tvSeriesBookmarks;
      } else {
        return res.status(400).json({ message: 'Invalid media type' });
      }
  
      const existingBookmarkIndex = bookmarkList.findIndex(bookmark => bookmark.details.id === details.id);
  
      if (action === 'add') {
        if (existingBookmarkIndex === -1) {
          bookmarkList.push({ mediaType, details });
        }
      } else if (action === 'remove') {
        if (existingBookmarkIndex !== -1) {
          bookmarkList.splice(existingBookmarkIndex, 1);
        }
      } else {
        return res.status(400).json({ message: 'Invalid action. Use "add" or "remove".' });
      }
  
      // Save the updated user document
      await user.save();
  
      res.status(200).json({ 
        message: `Bookmark ${action === 'add' ? 'added' : 'removed'} successfully`, 
        movieBookmarks: user.movieBookmarks,
        tvSeriesBookmarks: user.tvSeriesBookmarks
      });
  
    } catch (error) {
      console.error('Error updating bookmark:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      // Close MongoDB connection
      if (connection) {
        await connection.close();
        
      }
    }
  };
  module.exports = {bookmark,}
