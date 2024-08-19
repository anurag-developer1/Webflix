const express = require('express');
const router = express.Router();
const { popularMovies } = require('../controllers/popularMoviesController');

router.get('/', popularMovies);

module.exports = router;