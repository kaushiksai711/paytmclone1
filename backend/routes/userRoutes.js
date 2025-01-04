const express = require('express');
const router = express.Router();
const { signup, login,details ,alldetails,sendOTP,verifyOTP,createLinkToken} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/:id',details);
router.get('/',alldetails);
router.post('/sendOTP',sendOTP)
router.post('/verifyOTP',verifyOTP)
router.post("/create-link-token", createLinkToken);
module.exports = router;
