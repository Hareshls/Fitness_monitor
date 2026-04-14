const express = require('express');
const router = express.Router();
const { getMetricsByDate, updateMetrics } = require('../controllers/metricController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:date', getMetricsByDate);
router.post('/', updateMetrics);

module.exports = router;
