const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    senderUpiId: { type: String, required: true },
    receiverUpiId: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
