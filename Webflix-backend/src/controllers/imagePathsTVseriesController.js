const fetch = require('node-fetch');
 const imagePathsTVseries = async (req, res) => {
    const { tvseriesId } = req.query;
  
    if (!tvseriesId) {
      return res.status(400).json({ error: 'TV series ID is required' });
    }
  
    try {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${tvseriesId}/images?api_key=${process.env.TMDB_API_KEY}`);
      
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
      console.error('Error fetching tv series images:', error);
      res.status(500).json({ error: 'Failed to fetch tv series images' });
    }
  }
  module.exports = {
    imagePathsTVseries,
  };
