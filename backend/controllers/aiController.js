const User = require('../models/User');
const Workout = require('../models/Workout');
const aiWorkoutService = require('../services/aiWorkoutService');

const getWorkoutRecommendation = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch previous workouts for potentially more advanced AI logic (optional)
        const previousWorkouts = await Workout.find({ userId }).sort({ date: -1 }).limit(5);

        // Process data using recommendation algorithm
        const recommendation = await aiWorkoutService.getRecommendation(user);

        res.status(200).json({ recommendation });
    } catch (error) {
        console.error('AI Recommendation Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getWorkoutRecommendation
};
