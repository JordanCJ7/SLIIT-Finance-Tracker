const Transaction = require('../../models/Transaction');

describe('Transaction Model', () => {
    it('should require amount, category, and type', async () => {
        const transaction = new Transaction({});
        try {
            await transaction.validate();
        } catch (err) {
            expect(err.errors.amount).toBeDefined();
            expect(err.errors.category).toBeDefined();
            expect(err.errors.type).toBeDefined();
        }
    });
});