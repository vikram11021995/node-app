const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  ipAddress: { type: String, required: true },
  expiryTime: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: Date.now() } // Adjust expiry time as needed
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;
