const express = require('express');
const router = express.Router();
const { createBudget, getBudget } = require('../controllers/budgetController');

router.post('/', createBudget);
router.get('/', getBudget);

module.exports = router;
