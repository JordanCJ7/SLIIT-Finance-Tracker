const Notification = require('../models/Notification');

// Create a notification
exports.createNotification = async (req, res) => {
  const { userId, message, type } = req.body;

  try {
    const newNotification = new Notification({ userId, message, type });
    await newNotification.save();
    
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
