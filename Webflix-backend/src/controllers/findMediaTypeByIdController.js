const fetch = require('node-fetch');
const findMediaTypeById= async (req, res) => {
    const { mediaId } = req.query;
  
    if (!mediaId) {
      return res.status(400).json({ error: 'Media ID is required' });
    }
  
    try {
      // First, try to fetch as a movie
      const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${mediaId}?api_key=${process.env.TMDB_API_KEY}`);
  
      if (movieResponse.ok) {
        const movieData = await movieResponse.json();
        return res.json({ mediaType: 'movie', details: movieData });
      }
  
      // If it's not a movie, try as a TV show
      const tvResponse = await fetch(`https://api.themoviedb.org/3/tv/${mediaId}?api_key=${process.env.TMDB_API_KEY}`);
  
      if (tvResponse.ok) {
        const tvData = await tvResponse.json();
        return res.json({ mediaType: 'tv', details: tvData });
      }
  
      // If both requests fail, the ID doesn't correspond to a known movie or TV show
      return res.status(404).json({ error: 'Media not found' });
  
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  }
  module.exports = {
    findMediaTypeById,
  };