const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' }, 
    month: { type: String, required: true }, // Format: YYYY-MM

    // Add flags to track notification statuses
    notified60: {
        type: Boolean,
        default: false // Initially, the user has not been notified for 60% threshold
    },
    notified80: {
        type: Boolean,
        default: false // Initially, the user has not been notified for 80% threshold
    },
    notified100: {
        type: Boolean,
        default: false // Initially, the user has not been notified for 100% threshold
    }
});

module.exports = mongoose.model('Budget', budgetSchema);
