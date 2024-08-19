const express = require('express');
const router = express.Router();
const { searchMoviesWithGenres } = require('../controllers/searchMoviesWithGenresController');

router.get('/', searchMoviesWithGenres);

module.exports = router;