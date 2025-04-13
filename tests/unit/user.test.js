const User = require('../../models/User');

describe('User Model', () => {
    it('should require name, email, and password', async () => {
        const user = new User({});
        try {
            await user.validate();
        } catch (err) {
            expect(err.errors.name).toBeDefined();
            expect(err.errors.email).toBeDefined();
            expect(err.errors.password).toBeDefined();
        }
    });
});