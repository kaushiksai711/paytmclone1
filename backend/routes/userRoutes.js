const express = require('express');
const router = express.Router();
const { signup, login,details ,alldetails} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/:id',details);
router.get('/',alldetails);

module.exports = router;
