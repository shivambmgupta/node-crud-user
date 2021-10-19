const mongoose = require('mongoose');
const { activityTime } = require('../config/config');

const ActiveUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    loginTime: {
        type: Date,
        required: true,
        expires: activityTime
    }
}, { timestamps: true });

exports.ActiveUsers = mongoose.model('ActiveUsers', ActiveUserSchema);
