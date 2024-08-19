const User = require('../models/userModel');

const mongoose=require('mongoose');

const fetchbookmarks=async (req, res) => { 
    const { userId } = req.query;
    
  
    try
  {
      await mongoose.connect(process.env.MONGODB_URI);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { movieBookmarks, tvSeriesBookmarks } = user;
      res.status(200).json({ movieBookmarks, tvSeriesBookmarks });
    } catch (error) { console.error('Error fetching bookmarks:', error); res.status(500).json({ message: 'Internal server error' }); } finally { await mongoose.connection.close(); } }

    module.exports = {fetchbookmarks,}
