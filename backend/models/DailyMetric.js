const mongoose = require('mongoose');

const dailyMetricSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    steps: {
        type: Number,
        default: 0
    },
    heartRate: {
        type: Number,
        default: 0
    },
    sleepHours: {
        type: Number,
        default: 0
    },
    waterIntake: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Ensure one entry per user per day
dailyMetricSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyMetric', dailyMetricSchema);
