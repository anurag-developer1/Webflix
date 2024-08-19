const express = require('express');
const router = express.Router();
const { searchTVSeriesWithGenres } = require('../controllers/searchTVSeriesWithGenresController');

router.get('/', searchTVSeriesWithGenres);

module.exports = router;