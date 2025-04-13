// Dashboard generation logic
exports.getDashboardData = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      const transactions = await Transaction.find({ userId: req.userId });
      
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      const balance = totalIncome - totalExpense;
      
      res.status(200).json({ totalIncome, totalExpense, balance });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  