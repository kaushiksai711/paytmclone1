const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    upiId: { type: String, unique: true },
    balance: { type: Number, default: 1000 }
});

module.exports = mongoose.model('User', userSchema);
