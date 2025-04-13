const express = require('express');
const router = express.Router();
const { generateReport } = require('../controllers/reportController');

router.get('/', generateReport);

module.exports = router;
