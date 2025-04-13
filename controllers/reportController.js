// Report generation logic
exports.generateReport = async (req, res) => {
    try {
      // Example: generating a basic income vs expenses report
      const transactions = await Transaction.find();
      const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      
      res.status(200).json({ income, expenses });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  