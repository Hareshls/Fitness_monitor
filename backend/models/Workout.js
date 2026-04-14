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
        enum: ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Running', 'Cycling', 'Swimming', 'Walking', 'Hiking', 'Other']
    },
    exercise: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,
        required: [true, 'Please add duration in minutes']
    },
    caloriesBurned: {
        type: Number,
        required: [true, 'Please add calories burned']
    },
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    notes: {
        type: String,
        default: ''
    },
    sets: {
        type: Number,
        default: 0
    },
    reps: {
        type: Number,
        default: 0
    },
    goal: {
        type: String,
        default: 'General Fitness'
    },
    weight: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
