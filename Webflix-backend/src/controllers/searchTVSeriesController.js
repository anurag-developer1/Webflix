const fetch = require('node-fetch');
 const searchTVSeries= async (req, res) => {
    const { query, page = 1 } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    
    const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=${page}&language=en-US&include_adult=false`;
    
    try {
        const response = await fetch(searchUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching TV series:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
}
module.exports = {
    searchTVSeries,
   };