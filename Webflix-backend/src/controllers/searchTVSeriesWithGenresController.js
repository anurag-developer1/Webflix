const fetch = require('node-fetch');
 
const searchTVSeriesWithGenres =   async (req, res) => {
    const { page, with_genres } = req.query;
    
    try {
        const discoverUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${with_genres}`;
        
        const response = await fetch(discoverUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        res.json({
            page: parseInt(page),
            results: data.results,
            total_results: data.total_results,
            total_pages: data.total_pages
        });
    } catch (error) {
        console.error('Error fetching:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
}

module.exports = {
   searchTVSeriesWithGenres,
  };