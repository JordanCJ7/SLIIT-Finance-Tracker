const Goal = require("../../models/Goal");
const mongoose = require("mongoose");

describe("Goal Model", () => {
  it("should create a goal with valid data", async () => {
    const goal = new Goal({
      userId: new mongoose.Types.ObjectId(),
      name: "Save for vacation", // ✅ Add this field
      targetAmount: 1000,
      savedAmount: 100, // Optional but good practice
      deadline: new Date("2025-12-31"),
    });

    await expect(goal.validate()).resolves.toBeUndefined();
  });

  it("should set default status to 'in-progress'", async () => {
    const goal = new Goal({
      userId: new mongoose.Types.ObjectId(),
      name: "Emergency Fund", // ✅ Ensure name is included
      targetAmount: 5000,
      deadline: new Date("2026-01-01"),
    });

    expect(goal.status).toBe("in-progress");
  });

  it("should throw an error if targetAmount is negative", async () => {
    try {
      const goal = new Goal({
        userId: new mongoose.Types.ObjectId(),
        name: "Negative Goal", // ✅ Ensure name is included
        targetAmount: -500, // ❌ Invalid
        deadline: new Date("2025-06-30"),
      });

      await goal.validate();
    } catch (err) {
      expect(err.errors.targetAmount).toBeDefined();
    }
  });
});
