const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },
  aiRequestsToday: {
    type: Number,
    default: 0,
  },
  aiRequestsReset: {
    type: Date,
    default: null,
  },
  razorpayCustomerId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;