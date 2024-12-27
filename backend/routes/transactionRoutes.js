const express = require('express');
const router = express.Router();
const { transferFunds ,transactions} = require('../controllers/transactionController');

router.post('/transfer', transferFunds);
router.get('/:upi', transactions);

module.exports = router;
