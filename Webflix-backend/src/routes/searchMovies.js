const express = require('express');
const router = express.Router();
const { searchMovies } = require('../controllers/searchMoviesController');

router.get('/', searchMovies);

module.exports = router;