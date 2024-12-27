const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.transferFunds = async (req, res) => {
    const { senderUpiId, receiverUpiId, amount } = req.body;

    try {
        const sender = await User.findOne({ upiId: senderUpiId});
        const receiver = await User.findOne({ upiId: receiverUpiId});
        console.log(sender,receiver)
        if (!sender || !receiver) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        // Perform transfer
        sender.balance -= amount;
        receiver.balance += amount;
        await sender.save();
        await receiver.save();

        const transaction = new Transaction({ senderUpiId, receiverUpiId, amount:amount });
        await transaction.save();

        res.status(200).json({ message: "Transaction successful" });
    } catch (error) {
        res.status(500).json({ error: "Transaction failed", details: error });
    }
};
exports.transactions = async (req, res) => {
    const { upi } = (req.params);
  
    try {
        const transaction = await Transaction.find({
            $or: [
              { senderUpiId: senderUpiId },
              { receiverUpiId: senderUpiId }
            ]
          });
  
      res.status(200).json({transaction });
    } catch (error) {
      res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
  };
