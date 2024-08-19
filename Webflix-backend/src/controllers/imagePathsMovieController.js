
const fetch = require('node-fetch');
const imagePathsMovie= async (req, res) => {
    const { movieId } = req.query;
  
    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }
  
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${process.env.TMDB_API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const { backdrops, posters } = data;
  
      const imagePaths = {
        backdrops: backdrops.map(img => `https://image.tmdb.org/t/p/original${img.file_path}`),
        posters: posters.map(img => `https://image.tmdb.org/t/p/original${img.file_path}`),
      };
  
      res.json(imagePaths);
    } catch (error) {
      console.error('Error fetching movie images:', error);
      res.status(500).json({ error: 'Failed to fetch movie images' });
    }
  }
  module.exports = {
    imagePathsMovie,
  };
