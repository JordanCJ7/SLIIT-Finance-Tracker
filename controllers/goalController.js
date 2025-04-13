const Goal = require('../models/Goal');

// Create a new goal
exports.createGoal = async (req, res) => {
  const { userId, name, targetAmount, savedAmount, deadline } = req.body;

  try {
    const newGoal = new Goal({ userId, name, targetAmount, savedAmount, deadline });
    await newGoal.save();
    
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId });
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
