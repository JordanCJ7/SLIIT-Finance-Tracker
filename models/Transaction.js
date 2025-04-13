const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  currency: { type: String, required: true, default: 'USD' },
  tags: { type: [String], 
          default: [], 
          // tagging transactions 
          validate: [tags => tags.length <= 5, 'Cannot have more than 5 tags per transaction.']  }, // Limit number of tags
  isRecurring: { type: Boolean, default: false },
  recurrencePattern: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: null },
  recurrenceEndDate: { type: Date, default: null },
  nextRecurrenceDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
