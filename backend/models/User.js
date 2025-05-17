const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email address']
  },
  password: { type: String, required: true },
}, { timestamps: true });

// Pre-save hook to hash password
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

module.exports = mongoose.model('User', userSchema);
