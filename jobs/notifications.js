const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const moment = require('moment');

const checkDuePayments = async () => {
    try {
        const upcomingTransactions = await Transaction.find({
            isRecurring: true,
            nextRecurrenceDate: { 
                $lte: moment().add(2, 'days').endOf('day').toDate(),
                $gte: moment().startOf('day').toDate()
            }
        });

        for (let transaction of upcomingTransactions) {
            await Notification.create({
                userId: transaction.userId,
                message: `Reminder: You have a recurring payment for ${transaction.category} due on ${moment(transaction.nextRecurrenceDate).format('YYYY-MM-DD')}.`,
                type: 'reminder'
            });
        }
    } catch (error) {
        console.error('Error checking due payments:', error);
    }
};

// Check for goal progress
const checkGoalProgress = async () => {
    try {
        const goals = await Goal.find({ status: 'in-progress' });

        for (let goal of goals) {
            const progress = (goal.savedAmount / goal.targetAmount) * 100;

            if (progress >= 80 && progress < 100) {
                await Notification.create({
                    userId: goal.userId,
                    message: `Great job! You have saved ${progress.toFixed(1)}% towards your goal: ${goal.name}.`,
                    type: 'alert'
                });
            } else if (progress >= 100) {
                goal.status = 'completed';
                await goal.save();
                await Notification.create({
                    userId: goal.userId,
                    message: `Congratulations! You have reached your savings goal: ${goal.name}.`,
                    type: 'alert'
                });
            }
        }
    } catch (error) {
        console.error('Error checking goal progress:', error);
    }
};

// Export both functions
module.exports = { checkDuePayments, checkGoalProgress };
