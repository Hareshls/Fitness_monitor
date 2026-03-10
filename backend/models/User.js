const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    goals: {
        calories: { type: Number, default: 3000 },
        duration: { type: Number, default: 180 },
        workouts: { type: Number, default: 5 }
    },
    age: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    fitness_goal: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'fitness', 'general'],
        default: 'general'
    },
    activity_level: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        default: 'moderate'
    }
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
