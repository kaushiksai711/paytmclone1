
const User = require("../models/User");
const crypto = require("crypto");

// Helper function to generate unique UPI IDs
const generateUPI = () => crypto.randomBytes(8).toString("hex") + "@paytmclone";

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    const upiId = generateUPI();

    try {
        const newUser = new User({ name, email, password, upiId, balance: 1000 });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", upiId });
    } catch (error) {
        res.status(500).json({ error: "Error creating user", details: error });
    }
};

exports.login = async (req, res) => {
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
};
exports.details=async (req, res) => {
    
    try {
        
        const { upi } = (req.params);
        const user = await User.findOne({upiId:upi});
        
    console.log(req)
    console.log(upi)
        if (user) {
            res.status(200).json({ user });
        } 
        else{
            res.status(404).json({ error: "User not found" });
            }
    } catch (error) {
        res.status(500).json( 'error' );
    }
  };