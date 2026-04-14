const DailyMetric = require('../models/DailyMetric');

// @desc    Get metrics for a specific date
// @route   GET /api/metrics/:date
exports.getMetricsByDate = async (req, res) => {
    try {
        const date = new Date(req.params.date);
        date.setHours(0, 0, 0, 0);

        let metrics = await DailyMetric.findOne({
            userId: req.user.id,
            date: {
                $gte: date,
                $lt: new Date(date).setDate(date.getDate() + 1)
            }
        });

        if (!metrics) {
            // Return empty object if no metrics found
            return res.json({ steps: 0, heartRate: 0, sleepHours: 0, waterIntake: 0 });
        }

        res.json(metrics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update or create metrics for today
// @route   POST /api/metrics
exports.updateMetrics = async (req, res) => {
    try {
        const { steps, heartRate, sleepHours, waterIntake, date } = req.body;
        
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setHours(0, 0, 0, 0);

        let metrics = await DailyMetric.findOneAndUpdate(
            { 
                userId: req.user.id,
                date: {
                    $gte: targetDate,
                    $lt: new Date(targetDate).setDate(targetDate.getDate() + 1)
                }
            },
            { 
                userId: req.user.id,
                date: targetDate,
                steps, 
                heartRate, 
                sleepHours, 
                waterIntake 
            },
            { upsert: true, new: true }
        );

        res.json(metrics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
