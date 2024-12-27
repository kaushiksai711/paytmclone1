const express = require('express');
const router = express.Router();
const { signup, login,details } = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/:upi',details)

module.exports = router;
