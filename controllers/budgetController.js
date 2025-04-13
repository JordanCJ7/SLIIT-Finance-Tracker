const Budget = require('../models/Budget');

// Create a new budget
exports.createBudget = async (req, res) => {
  const { userId, category, amount, currency } = req.body;

  try {
    const newBudget = new Budget({ userId, category, amount, currency });
    await newBudget.save();
    
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get the budget for a user
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.userId });
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
