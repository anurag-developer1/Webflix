const fetch = require('node-fetch');
 
const trending= async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY}&page=${page}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching trending:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  }

  module.exports = {
   trending,
   };