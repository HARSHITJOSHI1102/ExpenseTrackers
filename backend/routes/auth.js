const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

const {
  register,
  login,
  requestOtp,
  verifyOtp,
  resetPassword,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp); // ✅ NEW
router.post('/reset-password', resetPassword); // ✅ NEW

// Example protected route
router.get('/protected-route', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


module.exports = router;
