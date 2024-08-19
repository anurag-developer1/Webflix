const express = require('express');
const router = express.Router();
const { searchTVSeries } = require('../controllers/searchTVSeriesController');

router.get('/', searchTVSeries);

module.exports = router;