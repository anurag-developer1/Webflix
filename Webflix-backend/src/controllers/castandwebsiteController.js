

const castandwebsite=async (req, res) => {
 
    const { mediaType, movieId } = req.query;
  
    // Validate mediaType
    if (mediaType !== 'movie' && mediaType !== 'tv') {
      return res.status(400).json({ error: 'Invalid media type. Must be "movie" or "tv".' });
    }
  
    try {
      // Fetch cast details
      const castUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/credits?api_key=${process.env.TMDB_API_KEY}`;
      const castResponse = await fetch(castUrl);
      const castData = await castResponse.json();
  
      // Fetch additional details including website
      const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}?api_key=${process.env.TMDB_API_KEY}`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();
  
      // Extract relevant information
      const cast = castData.cast.slice(0, 10);
      const websiteurl = detailsData.homepage;
  
      
  
      // Send the combined data
      res.json({
        cast,
        website: websiteurl,
        // You can include more fields from detailsData if needed
      })
    } catch (error) {
      console.error('Error fetching cast and website details:', error);
      res.status(500).json({ error: 'An error occurred while fetching cast and website details' });
    }
  }

  module.exports = {castandwebsite,}