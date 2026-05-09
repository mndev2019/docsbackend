const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  mobile: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  profileImage: {
    type: String,
    default: '',
  },

  resetOtp: {
    type: String,
    default: '',
  },

  resetOtpExpire: {
    type: Date,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model(
  'User',
  userSchema
);