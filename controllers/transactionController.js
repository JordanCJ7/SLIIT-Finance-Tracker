const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    const { amount, category, type, currency, tags, userId } = req.body;
  
    try {
      // Validate that the userId exists in the User collection
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Create and save the transaction
      const newTransaction = new Transaction({ amount, category, type, currency, tags, userId });
      await newTransaction.save();
      
      res.status(201).json(newTransaction);
    } catch (err) {
      console.error('Error creating transaction:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
