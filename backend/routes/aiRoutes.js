const express = require('express');
const router = express.Router();
const { getWorkoutRecommendation } = require('../controllers/aiController');

// @desc    Get AI workout recommendation
// @route   GET /api/ai/workout-recommendation/:userId
// @access  Public (or Private if middleware added)
router.get('/workout-recommendation/:userId', getWorkoutRecommendation);

module.exports = router;
