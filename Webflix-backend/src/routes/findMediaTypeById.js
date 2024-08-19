const express = require('express');
const router = express.Router();
const { findMediaTypeById } = require('../controllers/findMediaTypeByIdController');

router.get('/', findMediaTypeById);

module.exports = router;