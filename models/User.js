const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
