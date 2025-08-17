const express = require('express');
const router = express.Router();
const { signup, login, updatePassword, adminLogin } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Normal user routes
router.post('/signup', signup);
router.post('/login', login);

// Admin login route 
router.post('/login/admin', adminLogin);

router.put('/update-password', auth(['user', 'admin', 'store_owner']), updatePassword);

module.exports = router;
