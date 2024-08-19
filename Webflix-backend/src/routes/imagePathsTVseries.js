const express = require('express');
const router = express.Router();
const {imagePathsTVseries } = require('../controllers/imagePathsTVseriesController');

router.get('/', imagePathsTVseries);

module.exports = router;