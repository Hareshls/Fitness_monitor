const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutType: {
        type: String,
        required: [true, 'Please add a workout type'],
        enum: ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other']
    },
    duration: {
        type: Number,
        required: [true, 'Please add duration in minutes']
    },
    caloriesBurned: {
        type: Number,
        required: [true, 'Please add calories burned']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
