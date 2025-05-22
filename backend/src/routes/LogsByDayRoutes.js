const express = require('express');
const router = express.Router();
const { getLogsByDay } = require('../controllers/LogsByDayController');
const { protect } = require('../middleware/authMiddleware');

router.get('/by-day', protect, getLogsByDay);

module.exports = router;