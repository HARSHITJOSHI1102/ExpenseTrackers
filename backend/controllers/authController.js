require('dotenv').config();

const User = require('../models/User');
const OtpToken = require('../models/OtpToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/mailer');

// Register a new user
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userWithoutPassword = { _id: user._id, name: user.name, email: user.email };
    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// Login existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userWithoutPassword = { _id: user._id, name: user.name, email: user.email };
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

// Request OTP for password reset
exports.requestOtp = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpToken.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    const subject = 'Password Reset OTP';
    const text = `Your OTP is ${otp}. It is valid for 10 minutes.`;
    const html = `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`;

    await sendEmail(email, subject, text, html);

    res.json({ msg: 'OTP sent to your email' });
  } catch (err) {
    console.error('OTP request error:', err);
    res.status(500).json({ msg: 'Failed to send OTP' });
  }
};

// ✅ Step 1: Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ msg: 'Email and OTP are required' });
    }

    email = email.toLowerCase().trim();

    const record = await OtpToken.findOne({ email });
    if (!record) {
      return res.status(400).json({ msg: 'OTP not found' });
    }

    if (record.otp !== otp || record.expiresAt < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    res.json({ msg: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ msg: 'Failed to verify OTP' });
  }
};

// ✅ Step 2: Reset password after OTP verification
exports.resetPassword = async (req, res) => {
  try {
    let { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ msg: 'Email and new password are required' });
    }

    email = email.toLowerCase().trim();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await OtpToken.deleteOne({ email });

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ msg: 'Failed to reset password' });
  }
};
