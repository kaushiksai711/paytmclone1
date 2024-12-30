
const User = require("../models/User");
const crypto = require("crypto");
const mongoose = require('mongoose');

// Convert the id parameter to ObjectId

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
    const { id } = (req.params);
        //example id :'6769b91294d30fdadae3bf7e'
        const objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId)
    try {
        /*trying with object id _id  */
        const { id } = (req.params);
        //example id :'6769b91294d30fdadae3bf7e'
        const objectId = new mongoose.Types.ObjectId(id);
        console.log(objectId)
        const user = await User.findById(objectId);
        console.log(user)
        
    console.log(req)
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