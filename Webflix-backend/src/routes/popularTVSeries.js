const express = require('express');
const router = express.Router();
const { popularTVSeries } = require('../controllers/popularTVSeriesController');

router.get('/', popularTVSeries);

module.exports = router;