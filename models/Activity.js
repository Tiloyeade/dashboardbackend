const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    activityType: { type: String, required: true },
    page: { type: String, default: null }, // Optional, can be null for non-page activities
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);
