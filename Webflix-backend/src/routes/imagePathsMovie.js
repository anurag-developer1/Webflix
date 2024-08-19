const express = require('express');
const router = express.Router();
const {imagePathsMovie } = require('../controllers/imagePathsMovieController');

router.get('/', imagePathsMovie);

module.exports = router;