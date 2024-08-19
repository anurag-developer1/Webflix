
const trailer=async (req, res) => {
    const { mediaType, id } = req.query;
  
   
  
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      res.json(data);
  
      
    } catch (error) {
      console.error('Error fetching trailer from TMDB:', error);
      res.status(500).json({ error: 'Error fetching trailer' });
    }
  }

  module.exports = {
    trailer,
  };

