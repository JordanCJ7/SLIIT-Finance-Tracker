const Budget = require("../../models/Budget");
const mongoose = require("mongoose");

describe("Budget Model", () => {
  it("should create a budget with valid data", async () => {
    const budget = new Budget({
      userId: new mongoose.Types.ObjectId(),
      category: "Food",
      amount: 500,
      currency: "USD",
      month: "2025-03", // ✅ Add this field to fix the test
    });

    await expect(budget.validate()).resolves.toBeUndefined();
  });

  it("should set default currency to USD if not provided", async () => {
    const budget = new Budget({
      userId: new mongoose.Types.ObjectId(),
      category: "Entertainment",
      amount: 200,
      month: "2025-03", // ✅ Ensure month is included
    });

    expect(budget.currency).toBe("USD");
  });
});
