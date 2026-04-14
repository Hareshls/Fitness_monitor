const Workout = require('../models/Workout');

// @desc    Get all workouts for a user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
    try {
        console.log('Fetching workouts for user:', req.user._id);
        const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
        res.status(200).json(workouts);
    } catch (error) {
        console.error('Get Workouts Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
    const { 
        workoutType, 
        exercise, 
        duration, 
        caloriesBurned, 
        intensity, 
        difficulty, 
        notes, 
        sets, 
        reps, 
        goal, 
        weight, 
        date 
    } = req.body;

    if (!workoutType || !duration || !caloriesBurned) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        console.log('Creating workout for user:', req.user._id);

        const workout = await Workout.create({
            userId: req.user._id,
            workoutType,
            exercise,
            duration,
            caloriesBurned,
            intensity,
            difficulty,
            notes,
            sets,
            reps,
            goal,
            weight,
            date: date || Date.now()
        });
        res.status(201).json(workout);
    } catch (error) {
        console.error('Create Workout Error:', error);
        res.status(500).json({ message: error.message || 'Error creating workout' });
    }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        // Check if user owns the workout
        if (workout.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedWorkout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' });
        }

        // Check if user owns the workout
        if (workout.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await workout.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout
};
