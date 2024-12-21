// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const crypto = require("crypto");

// Setup express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse incoming URL-encoded data

// Connect to MongoDB
const uri = "mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority"; // Replace with your connection string
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected")).catch(err => console.error("Connection error:", err));

// Define Schema and models
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    upiId: { type: String, required: true },
    balance: { type: Number, default: 1000 }
});

const transactionSchema = new mongoose.Schema({
    senderUpiId: { type: String, required: true },
    receiverUpiId: { type: String, required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

// Helper function to generate unique UPI IDs
const generateUPI = () => crypto.randomBytes(8).toString("hex") + "@paytmclone";

// API Endpoints

// SIGNUP Route
app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;

    // Generate unique UPI ID
    const upiId = generateUPI();

    try {
        const newUser = new User({
            name,
            email,
            password,
            upiId,
            balance: 1000 // Set initial balance
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", upiId });
    } catch (error) {
        res.status(500).json({ error: "Error creating user", details: error });
    }
});

// LOGIN Route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error });
    }
});

// TRANSACTION Route
app.post("/api/transaction", async (req, res) => {
    const { senderUpiId, receiverUpiId, amount } = req.body;

    try {
        const sender = await User.findOne({ upiId: senderUpiId });
        const receiver = await User.findOne({ upiId: receiverUpiId });

        if (!sender || !receiver) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        // Deduct from sender and add to receiver
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        // Record the transaction
        const transaction = new Transaction({
            senderUpiId,
            receiverUpiId,
            amount
        });
        await transaction.save();

        res.status(200).json({ message: "Transaction successful" });
    } catch (error) {
        res.status(500).json({ error: "Transaction failed", details: error });
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
